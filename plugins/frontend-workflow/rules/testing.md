---
paths:
  - "**/*.test.{ts,tsx}"
  - "src/test/**/*"
  - "vitest.config.*"
---

# Testing rules

Load whenever you work on tests. Patterns and templates live in the `testing-standards` skill — these are the invariants.

- **Test behavior, not implementation.** Assert what the user sees and does; never assert on internal state, hook call counts, or CSS class names. A passing test should survive a refactor that preserves behavior.
- **Query priority**: `getByRole` (with accessible name) → `getByLabelText` → `getByText` → `getByTestId` as last resort. If you can't find it by role, that's usually an accessibility bug — fix the component, not the query.
- **User interactions** via `userEvent`, not `fireEvent` — it simulates real event sequences (pointer, focus, keyboard).
- **API mocking at the network layer with MSW**, never by mocking fetch/axios or React Query internals. Shared handlers live in `src/test/handlers/`; override per-test with `server.use()`.
- **Integration tests** cover the acceptance criteria of the ticket: render the screen, drive it like a user, assert the outcome — including loading, error, and empty paths.
- **Async**: `findBy*`/`waitFor`, never arbitrary timeouts. No `act()` warnings left in output.
- **Coverage**: every interactive component has unit tests + an axe test; every AC maps to at least one test named after the behavior (`shows validation error when email is invalid`).
