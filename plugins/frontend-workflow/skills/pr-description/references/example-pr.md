# Example PR (target quality)

**Title**: `feat(PROJ-123): add appointment date picker to booking flow`

---

## Summary

Booking previously required typing dates free-form, causing ~12% of submissions to fail
server validation (PROJ-119). This adds a `DatePicker` component to the booking screen,
built on our existing `Popover` + `Calendar` primitives, with availability fetched from
`/api/availability`. Invalid dates are now unselectable rather than rejected after submit.

## Links

- Jira: PROJ-123
- Figma: Booking / "Date selection" frames (desktop + mobile)

## Screenshots

| Breakpoint | Figma | Implementation |
| ---------- | ----- | -------------- |
| 375px      | (img) | (img)          |
| 768px      | (img) | (img)          |
| 1440px     | (img) | (img)          |

States: disabled dates (img), loading availability (img), API error fallback (img).

## Test plan

- Unit (`DatePicker.test.tsx`): renders with label (AC-1), keyboard model — arrows navigate days, Enter selects, Esc closes and restores focus (AC-3), disabled dates unselectable (AC-2), axe clean.
- Integration (`BookingScreen.test.tsx`): selecting a date updates the summary and enables submit (AC-1), availability API failure shows retry alert (AC-4), empty availability shows guidance (AC-5). MSW handlers in `src/test/handlers/availability.ts`.
- Manual: VoiceOver announcement of selected date (no automated proxy).

## Accessibility

- [x] Keyboard-only walkthrough passes
- [x] axe scan clean on /booking (0 violations, wcag22aa tags)
- [x] Names/roles/states correct (grid/gridcell pattern per APG)
- [x] Contrast AA (tokens only; verified at design stage)

## Risk & rollback

Booking flow only; `DatePicker` not yet exported from the design system. No flag — UI
is additive and the old text input is removed in this PR (revert = restore input).
Single-commit revert is safe; no schema/API changes.
