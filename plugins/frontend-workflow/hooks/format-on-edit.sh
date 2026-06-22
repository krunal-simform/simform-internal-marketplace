#!/usr/bin/env bash
# PostToolUse hook (matcher: Edit|Write).
# Formats and lint-fixes every file Claude edits, so style is deterministic
# and the model never spends effort on formatting.
# Input: hook JSON on stdin; we extract tool_input.file_path.
# This hook never blocks (always exits 0) — it runs *after* the edit.

set -uo pipefail

command -v jq >/dev/null 2>&1 || exit 0   # jq required; skip silently if absent

FILE_PATH=$(jq -r '.tool_input.file_path // empty' 2>/dev/null)
[ -n "$FILE_PATH" ] && [ -f "$FILE_PATH" ] || exit 0

cd "${CLAUDE_PROJECT_DIR:-.}" || exit 0

case "$FILE_PATH" in
  *.ts|*.tsx|*.js|*.jsx)
    npx prettier --write "$FILE_PATH" >/dev/null 2>&1
    npx eslint --fix "$FILE_PATH" >/dev/null 2>&1
    ;;
  *.css|*.json|*.md|*.html|*.yml|*.yaml)
    npx prettier --write "$FILE_PATH" >/dev/null 2>&1
    ;;
esac

exit 0
