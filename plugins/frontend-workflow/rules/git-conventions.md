# Git conventions

- **Branches**: `feat/<TICKET-KEY>-<short-slug>` (e.g. `feat/PROJ-123-date-picker`). Never commit to `main` — the guard-git hook also blocks this mechanically.
- **Commits**: Conventional Commits with the Jira key as scope: `feat(PROJ-123): add appointment date picker`. Allowed types: feat, fix, refactor, test, docs, chore, perf, style, ci. The key enables Jira smart-commit linking.
- **Atomic commits**: one logical change per commit. Tests belong in the same commit as the code they cover.
- **Before any commit**: full test suite, `npm run lint`, and `npm run typecheck` must be clean. Don't `git add` files unrelated to the ticket.
- **PRs**: push the feature branch, create the PR with the `pr-description` skill against the `.github/pull_request_template.md` sections. Keep PRs under ~400 changed lines where possible; split otherwise.
