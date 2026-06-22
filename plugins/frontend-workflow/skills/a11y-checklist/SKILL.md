---
name: a11y-checklist
description: WCAG 2.2 AA checklist and automated axe scanning for this project.
  Use when planning accessibility work for a screen, implementing interactive
  components, verifying rendered UI for accessibility, or whenever WCAG, axe,
  screen readers, keyboard navigation, or contrast come up.
---

# Accessibility checklist & tooling

The code-level rules live in `${CLAUDE_PLUGIN_ROOT}/rules/accessibility.md` — read them
when editing components. This skill adds the full WCAG checklist and the automated scan,
applied at three points in the workflow.

## During planning (frontend-task step 3)

Read `references/wcag-2.2-checklist.md` and select the items this UI triggers (forms →
labels/errors; overlays → focus trapping; async → live regions; media → alternatives).
Put the selected items in the plan so they're approved as requirements, not retrofitted.

## During implementation (step 4)

The selected checklist items become code + tests: every interactive component gets an axe
test and a keyboard test (see `testing-standards`). Contrast was already verified from
design variables in `figma-to-code` — if implementation deviates from those tokens, re-check.

## During verification (step 5)

The ui-verifier subagent runs three layers; you can also run them directly:

1. **Automated scan** — with the dev server running:
   `node ${CLAUDE_SKILL_DIR}/scripts/run-axe.mjs http://localhost:5173/<route>`
   Prints violations as JSON (rule, impact, nodes). Requires dev deps `playwright` and
   `@axe-core/playwright`; the script tells you what's missing if not installed.
2. **Keyboard walkthrough** — Tab order, visible focus, Enter/Space/Esc/arrows, no traps.
3. **Accessibility tree** — roles, names, states on every interactive element
   (Playwright MCP `browser_snapshot`).

Automated scans catch roughly a third of WCAG issues — the checklist and keyboard pass
are not optional extras; they are where the real failures hide.
