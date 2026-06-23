# frontend-workflow

End-to-end Claude Code workflow for **React + TypeScript** frontend teams. Drives a Jira
ticket through the full lifecycle — **Jira → Figma → plan → implement → UI verify → review
→ commit → PR** — with deterministic guards that don't depend on the model behaving.

## What's inside

| Component | Items |
| --- | --- |
| **Skills** | `frontend-task` (orchestrator), `figma-to-code`, `testing-standards`, `a11y-checklist`, `frontend-security-review`, `pr-description`, `address-pr-feedback` |
| **Agents** | `ui-verifier` (visual + a11y QA via Playwright MCP), `code-reviewer` (read-only diff review) |
| **Hooks** | `format-on-edit.sh` (PostToolUse: prettier + eslint --fix), `guard-git.sh` (PreToolUse: blocks commits to main/master, force pushes, secrets via gitleaks, non-conventional commit messages) |
| **MCP servers** | Atlassian (Jira), Figma Dev Mode, Playwright, GitHub |
| **Rules** | `rules/` — design-tokens, accessibility, testing, security, git-conventions, workflow-guardrails (referenced by the skills and agents) |

## What enforces what

| Concern | Soft guidance (context) | Hard enforcement (deterministic) |
| --- | --- | --- |
| Formatting/lint | — | `format-on-edit.sh` PostToolUse hook |
| No commits to main, secrets, commit format | `rules/git-conventions.md` | `guard-git.sh` PreToolUse hook |
| Design tokens, a11y, testing standards | `rules/` + skills | ESLint (`jsx-a11y`), vitest-axe, `ui-verifier` agent |
| Dangerous commands | — | permissions in `setup/settings.json` (see install) |

## Install

1. **Add the marketplace and install** (from the `simform-internal` marketplace):

   ```
   /plugin marketplace add <path-or-url-to-simform-internal-marketplace>
   /plugin install frontend-workflow@simform-internal
   ```

   This activates the skills, agents, hooks, and MCP servers automatically.

2. **Make the hooks executable** (once, after install):

   ```
   chmod +x "$(claude plugin root frontend-workflow)"/hooks/*.sh
   ```

3. **Install host dependencies:**
   - `jq` (hooks parse hook JSON): `brew install jq`
   - `gitleaks` (commit secret scan): `brew install gitleaks` — without it the guard logs a warning and skips the scan
   - dev deps used by skills/scripts: `npm i -D @axe-core/playwright playwright vitest-axe`

4. **Connect MCP servers** (first run prompts approval/OAuth where needed):
   - Atlassian + GitHub + Playwright load from the bundled `.mcp.json` — approve when Claude Code asks
   - Figma: open the Figma **desktop** app → Preferences → enable the **Dev Mode MCP server** (serves `http://127.0.0.1:3845/mcp`)
   - Verify with `/mcp`; if your Playwright tool names differ, pin the exact `mcp__playwright__*` names in `agents/ui-verifier.md`

### Project-side setup (things a plugin cannot inject for you)

Claude Code plugins cannot ship `permissions`, a project `CLAUDE.md`, or a PR template — those
must live in the consuming repository. Copy them from this plugin's `setup/` directory:

| Copy from | Copy to | Why |
| --- | --- | --- |
| `setup/settings.json` | merge into your repo's `.claude/settings.json` | command allow/ask/deny permissions |
| `setup/CLAUDE.md` | merge into your repo's `CLAUDE.md` | project stack, commands, layout, conventions |
| `setup/pull_request_template.md` | `.github/pull_request_template.md` | the `pr-description` skill fills this |

The hard denies (force push, commits to `main`) are also enforced mechanically by
`guard-git.sh`, so the workflow stays safe even before you merge the permissions block.

## Use

```
claude
/frontend-task PROJ-123
```

The feature branch is created from **whatever branch is currently checked out** (it doesn't
have to be `main`) — the orchestrator tells you which base branch it will branch from before
starting. At every gate (plan approval, missing AC/Figma, repeated UI-verify failures, PR
now-or-later) it asks you interactively via Claude's question prompt and waits on your choice
rather than ending the session — nothing is edited before you approve the plan (step 3).
Figma reference screenshots are written to a temporary directory outside the repo and deleted
when the workflow finishes, so they are never committed.

To handle review feedback or red CI on an open PR:

```
/address-pr-feedback 456
```

## Adapting

- **Jest instead of Vitest**: update `rules/testing.md`, `skills/testing-standards/`, and swap `vitest-axe` → `jest-axe`
- **Different token source**: edit `rules/design-tokens.md` + `skills/figma-to-code/references/token-mapping.md`
- **Ticket key format**: regex in `hooks/guard-git.sh` (currently `[A-Z]+-[0-9]+`)
- **Plan-first sessions**: add `"defaultMode": "plan"` under `permissions` in your project `.claude/settings.json`
