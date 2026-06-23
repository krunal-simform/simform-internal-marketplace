# Changelog — frontend-workflow

All notable changes to this plugin follow [Keep a Changelog](https://keepachangelog.com/)
and [Semantic Versioning](https://semver.org/).

## [1.1.0] — 2026-06-23

### Changed
- **Any base branch.** The workflow no longer requires starting on `main`. The
  feature branch is created from whatever branch is checked out, and the
  orchestrator announces *"a new branch will be created from `<branch-name>`"*
  up front. `code-reviewer` and `frontend-security-review` now diff against that
  base branch (passed in / defaulting to `main`) instead of a hardcoded `main`.
- **Temporary test screenshots.** Figma reference screenshots are captured into a
  temp directory outside the repo (`${TMPDIR:-/tmp}/frontend-workflow/<KEY>/design-refs/`)
  instead of `.claude/design-refs/`, and are deleted in the final step — they are
  never committed. `figma-to-code` and `ui-verifier` updated to use the temp path.
- **Interactive gates.** Workflow gates (dirty tree, missing AC/Figma, plan
  approval, 3 failed UI-verify rounds, PR now-or-later, unmappable design token)
  now use the **AskUserQuestion** tool to ask the developer and continue on their
  answer, instead of ending the turn.

## [1.0.0] — 2026-06-22

### Added
- `frontend-task` orchestrator skill (`/frontend-task <JIRA-KEY>`) driving the
  full ticket lifecycle: Jira → Figma → plan → implement → UI verify → review →
  commit → PR, with hard approval gates.
- Knowledge/action skills: `figma-to-code`, `testing-standards`, `a11y-checklist`
  (bundled axe scan), `frontend-security-review` (bundled dep audit),
  `pr-description`, `address-pr-feedback`.
- Subagents: `ui-verifier` (Playwright MCP visual + WCAG 2.2 AA QA) and
  `code-reviewer` (read-only diff review against acceptance criteria).
- Hooks (`hooks/hooks.json`): `format-on-edit.sh` (PostToolUse Edit|Write —
  prettier + eslint --fix) and `guard-git.sh` (PreToolUse Bash — blocks commits
  to main/master and force pushes, runs gitleaks on staged changes, enforces
  Conventional Commits with a Jira key).
- Bundled MCP servers (`.mcp.json`): Atlassian, Figma Dev Mode, Playwright, GitHub.
- `rules/` standards (design-tokens, accessibility, testing, security,
  git-conventions, workflow-guardrails) referenced by the skills and agents.
- `setup/` assets a plugin cannot inject (permissions `settings.json`, project
  `CLAUDE.md`, `pull_request_template.md`) for the consuming repo to copy in.

### Converted from
- The previous drop-in `.claude/` project configuration. Hook commands were
  rewired from `$CLAUDE_PROJECT_DIR/.claude/hooks/` to `${CLAUDE_PLUGIN_ROOT}/hooks/`,
  and cross-component file references in agents/skills now resolve via
  `${CLAUDE_PLUGIN_ROOT}`.
