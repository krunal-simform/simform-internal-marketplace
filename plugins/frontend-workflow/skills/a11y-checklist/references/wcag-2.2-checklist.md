# WCAG 2.2 AA checklist (frontend-relevant)

Select the applicable items per screen during planning; verify them in step 5.

## Perceivable

- **1.1.1 Non-text content**: meaningful images have descriptive `alt`; decorative `alt=""`; icon-only buttons have accessible names.
- **1.3.1 Info & relationships**: structure is programmatic — headings in order, lists as lists, tables with headers, inputs with labels.
- **1.3.4 Orientation**: works in portrait and landscape.
- **1.3.5 Input purpose**: autocomplete attributes on common fields (email, name, tel).
- **1.4.1 Use of color**: color is never the only signal (errors also have text/icon).
- **1.4.3 Contrast (minimum)**: text 4.5:1; large text 3:1.
- **1.4.4 Resize text**: usable at 200% zoom.
- **1.4.10 Reflow**: no horizontal scroll at 320px width.
- **1.4.11 Non-text contrast**: UI component boundaries and states 3:1.
- **1.4.13 Content on hover/focus**: tooltips/popovers are dismissible (Esc), hoverable, persistent.

## Operable

- **2.1.1 Keyboard**: all functionality keyboard-reachable and operable.
- **2.1.2 No keyboard trap**: focus can always leave; overlays trap *intentionally* and release on close.
- **2.4.2 Page titled**: route changes update `document.title`.
- **2.4.3 Focus order**: tab order matches visual/logical order.
- **2.4.6 Headings & labels**: descriptive; one `h1` per screen.
- **2.4.7 Focus visible**: every interactive element has a visible focus state.
- **2.4.11 Focus not obscured (minimum)**: focused element not hidden behind sticky headers/footers.
- **2.5.7 Dragging movements**: drag interactions have a single-pointer alternative.
- **2.5.8 Target size (minimum)**: targets ≥ 24×24 CSS px (or sufficient spacing).

## Understandable

- **3.1.1 Language of page**: `lang` attribute correct.
- **3.2.1/3.2.2 On focus/input**: no surprise context changes from focusing or typing.
- **3.3.1 Error identification**: errors described in text, associated via `aria-describedby`.
- **3.3.2 Labels or instructions**: every input has a visible label (placeholder is not a label).
- **3.3.3 Error suggestion**: tell the user how to fix it.
- **3.3.7 Redundant entry**: don't make users re-enter info within a flow.
- **3.3.8 Accessible authentication (minimum)**: no cognitive test for login (allow paste, autofill).

## Robust

- **4.1.2 Name, role, value**: custom widgets expose correct role, accessible name, and state (expanded, selected, checked) — follow the matching ARIA Authoring Practices pattern fully, including its keyboard model.
- **4.1.3 Status messages**: async results/errors announced via `aria-live`/`role="status"`/`role="alert"` without moving focus.

## Quick severity guide

Blockers in review: keyboard inoperable, missing accessible names, contrast below ratio,
focus lost/trapped, errors not announced. Everything else: fix before merge, but negotiable
in sequencing.
