---
paths:
  - "src/components/**/*.{ts,tsx}"
  - "src/screens/**/*.{ts,tsx}"
  - "src/theme/**/*"
  - "src/styles/**/*"
---

# Design implementation rules

Figma is the source of truth for visuals; `src/theme/tokens.ts` is the source of truth in code. These rules load whenever you work on components, screens, or styles.

- **Tokens only.** Never hardcode colors, spacing, radii, shadows, or font sizes. Every visual value maps to a token. If a Figma value has no matching token, stop and flag it — either the design drifted or the token set needs an addition (designer decision, not yours).
- **Spacing scale**: 4px base scale (`space-1` = 4px … ). Off-scale values from Figma (e.g. 13px) are usually rendering artifacts — confirm against the token, don't copy the pixel.
- **Breakpoints**: mobile 375, tablet 768, desktop 1440. Implement mobile-first; every screen must be intentional at all three (and reflow down to 320px without horizontal scroll).
- **Component states are part of the design.** A component isn't done with only its default state: implement hover, focus-visible, active, disabled, loading, empty, and error states wherever the design or common sense requires them. If Figma omits a state, derive it from the design system's existing patterns and note it in the PR.
- **Reuse before building.** Match the Figma frame to existing components in `src/components/` first (the `figma-to-code` skill describes how). New one-off variants of existing components need a reason in the plan.
- **Dark mode** (if the screen supports it): use semantic tokens (`surface`, `on-surface`), never literal palette values, so both themes work from one implementation.
