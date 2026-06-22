---
paths:
  - "src/**/*.tsx"
---

# Accessibility rules (WCAG 2.2 AA)

Load whenever you touch a React component. The full checklist with success criteria lives in the `a11y-checklist` skill — these are the rules that must hold in code.

- **Semantic HTML first.** `button` for actions, `a` for navigation, native inputs with `label`, headings in order. Reach for ARIA only when no native element expresses the semantics — and then follow the ARIA Authoring Practices pattern completely (roles, states, *and* keyboard behavior).
- **Everything interactive is keyboard operable.** Logical tab order, no traps. Custom widgets implement the expected keys (Enter/Space activate, Esc closes, arrows navigate within composites).
- **Focus is managed, not lost.** Visible focus indicator on every interactive element (never `outline: none` without replacement). Dialogs trap focus and restore it on close. After route changes, move focus to the new screen's heading.
- **Async states are announced.** Loading/success/error feedback uses `aria-live` (polite for results, assertive for errors). Buttons that trigger async work get `aria-busy` while pending.
- **Forms**: every input has a programmatic label; errors are tied to the field with `aria-describedby` and identified in text, not color alone.
- **Media & images**: meaningful images get descriptive `alt`; decorative ones get `alt=""`.
- **Touch targets** ≥ 24×24 CSS px (2.5.8).
- **Every interactive component ships an axe test** (`vitest-axe`) and its `.test.tsx` covers keyboard interaction.
