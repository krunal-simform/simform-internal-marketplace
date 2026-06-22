#!/usr/bin/env bash
# PreToolUse hook (matcher: Bash).
# Deterministic guardrails for git commands. Uses the modern JSON output
# (hookSpecificOutput.permissionDecision) to deny with a reason Claude can read.
# Non-git commands pass through instantly.

set -uo pipefail

command -v jq >/dev/null 2>&1 || exit 0

INPUT=$(cat)
CMD=$(printf '%s' "$INPUT" | jq -r '.tool_input.command // empty')
[ -n "$CMD" ] || exit 0

deny() {
  jq -n --arg reason "$1" '{
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: "deny",
      permissionDecisionReason: $reason
    }
  }'
  exit 0
}

# --- Guard: force pushes (backstop to permissions.deny) -----------------
case "$CMD" in
  *"git push"*"--force"*|*"git push"*" -f"*)
    deny "Force pushes are not allowed in this repository."
    ;;
esac

# --- Guards that only apply to commits ----------------------------------
case "$CMD" in
  *"git commit"*) ;;
  *) exit 0 ;;
esac

cd "${CLAUDE_PROJECT_DIR:-.}" || exit 0

# 1. Never commit to main/master — ticket work happens on feat/<KEY>-<slug>.
BRANCH=$(git branch --show-current 2>/dev/null)
if [ "$BRANCH" = "main" ] || [ "$BRANCH" = "master" ]; then
  deny "Committing directly to '$BRANCH' is not allowed. Create a branch first: git checkout -b feat/<TICKET-KEY>-<slug>"
fi

# 2. Secret scan on staged changes (deterministic, not model-dependent).
if command -v gitleaks >/dev/null 2>&1; then
  if ! gitleaks protect --staged --no-banner --redact >/dev/null 2>&1; then
    deny "gitleaks found potential secrets in the staged changes. Remove them before committing (run: gitleaks protect --staged --no-banner)."
  fi
else
  echo "guard-git: gitleaks not installed — staged secret scan skipped" >&2
fi

# 3. Commit message must follow Conventional Commits with a ticket key,
#    e.g. feat(PROJ-123): add date picker. Only checked when -m is used;
#    commitlint/husky remain the authority if configured.
MSG=$(printf '%s' "$CMD" | sed -n 's/.*-m[[:space:]]*"\([^"]*\)".*/\1/p')
if [ -n "$MSG" ]; then
  if ! printf '%s' "$MSG" | grep -qE '^(feat|fix|refactor|test|docs|chore|perf|style|ci)\([A-Z]+-[0-9]+\)(!)?: .+'; then
    deny "Commit message must be Conventional Commits with the Jira key, e.g. feat(PROJ-123): add appointment date picker. Got: $MSG"
  fi
fi

exit 0
