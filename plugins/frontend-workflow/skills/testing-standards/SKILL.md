---
name: testing-standards
description: How this team writes frontend tests — Vitest, React Testing Library,
  MSW, vitest-axe. Use whenever writing or planning unit or integration tests for
  React components or screens, deriving test cases from acceptance criteria, or
  reviewing test quality. Use even for "just add a quick test".
---

# Testing standards

The invariants live in `${CLAUDE_PLUGIN_ROOT}/rules/testing.md` — read them when working on
test files. This skill is the *how*: deriving cases, structuring files, and the project's patterns.

## Deriving test cases from acceptance criteria

Each AC becomes one or more tests named after the behavior, not the implementation:

- AC: "User sees a validation error for an invalid email" →
  `it('shows validation error when email is invalid')`
- For every AC, also derive its unhappy paths: API failure, empty data, slow response
  (loading state), permission-denied where applicable. Designs usually show these states;
  the tests prove them.

Write the test list during planning (step 3 of `frontend-task`), get it approved with the
plan, then implement test-first: failing test → code → green, one case at a time.

## What goes where

- **Unit (component)**: `src/components/<Name>/<Name>.test.tsx` — props/variants, interaction, keyboard behavior, axe.
- **Integration (screen)**: `src/screens/<Screen>/<Screen>.test.tsx` — render with providers + MSW, drive the full user flow per AC.
- Shared utilities: `src/test/` (`renderWithProviders`, MSW `server`, handler factories).

## Patterns

Read `references/test-patterns.md` for the canonical examples: renderWithProviders setup,
MSW handler overrides per test, vitest-axe usage, userEvent keyboard testing, and React
Query test config. When creating a new component test file, start from
`assets/component-test-template.tsx` (copy it, don't import it).

## Quality bar (what review checks)

- Tests fail for the right reason — delete the implementation line a test covers and it should go red.
- No snapshot tests for behavior; snapshots only for stable serialized output (rare).
- No `data-testid` where a role query works; no `fireEvent` where `userEvent` works.
- Axe test present for every interactive component:
  `expect(await axe(container)).toHaveNoViolations()`.
