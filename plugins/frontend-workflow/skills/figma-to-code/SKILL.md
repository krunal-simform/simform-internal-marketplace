---
name: figma-to-code
description: Translate Figma designs into this project's React + TypeScript
  components via the Figma Dev Mode MCP. Use whenever implementing or updating UI
  from a Figma link or design handoff — fetching frames, extracting design tokens,
  matching designs to existing components, or capturing reference screenshots for
  visual verification. Use even if the user just pastes a Figma URL.
---

# Figma → code

The Figma Dev Mode MCP server (Figma desktop app must be open with the file) provides
screenshots, design variables, and generated-code hints. The cardinal rule: **Figma
output is a spec to interpret, never code to paste.**

## 1. Capture references

For every frame linked in the ticket:

- `get_screenshot` per breakpoint (375 / 768 / 1440 where designed) and per designed state (default, hover, focus, disabled, loading, empty, error).
- Save to `.claude/design-refs/<TICKET-KEY>/` named `<frame>--<state>--<width>.png`. These are the ground truth the ui-verifier subagent compares against later — capture them all *before* writing code.

## 2. Extract and map tokens

- `get_variable_defs` for the selection → raw values and variable names.
- Map every value to a token in `src/theme/tokens.ts` using `references/token-mapping.md` (read it now). Three outcomes per value:
  - exact token match → use the token
  - near miss (≤2px / shade off) → use the nearest token and note it
  - no plausible token → STOP and flag to the developer (design drift or missing token — a designer decision)
- While you have the variables: check text/background pairs against WCAG contrast (4.5:1 text, 3:1 UI). Report failures immediately — fixing contrast at design stage is cheap.

## 3. Match against existing components

Before planning anything new, inventory what the design actually shows: buttons, fields,
cards, tables, dialogs. Grep `src/components/` for candidates and compare their props/variants
to the design. Prefer, in order: existing component as-is → existing component with a new
variant (extend its API) → new component. A new component that overlaps an existing one
needs justification in the plan.

## 4. Use generated code as a hint only

`get_code` output tells you structure and content hierarchy. It does not know our tokens,
components, naming, or a11y standards — re-express the structure in project terms. Copying
it verbatim is the most common way design-system drift enters a codebase.

## Output of this skill

A design spec: frames captured (with paths), token mapping table, contrast findings,
reuse-vs-build decision per element, and open design questions. This feeds directly into
the plan (step 3 of `frontend-task`).
