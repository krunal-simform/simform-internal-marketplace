# Changelog — frontend-workflow

All notable changes to this plugin follow [Keep a Changelog](https://keepachangelog.com/)
and [Semantic Versioning](https://semver.org/).

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
