# Figma variable → code token mapping

How to translate values from `get_variable_defs` into `src/theme/tokens.ts` tokens.
Update this table when the token set changes — it is the contract between design and code.

## Naming convention

| Figma variable | Code token | Tailwind class |
| -------------- | ---------- | -------------- |
| `color/brand/primary` | `colors.brand.primary` | `text-brand-primary` / `bg-brand-primary` |
| `color/surface/*` | `colors.surface.*` | `bg-surface-*` |
| `color/on-surface/*` | `colors.onSurface.*` | `text-on-surface-*` |
| `space/N` (4px scale) | `spacing[N]` | `p-N`, `gap-N`, `m-N` |
| `radius/{sm,md,lg,full}` | `radii.*` | `rounded-*` |
| `type/{size,weight,line-height}/*` | `typography.*` | `text-*`, `font-*`, `leading-*` |
| `shadow/{1..4}` | `shadows.*` | `shadow-*` |

## Resolution rules

1. **Exact name match wins.** A Figma variable named `color/brand/primary` maps to the token of the same path — even if the hex looks slightly different on screen (rendering/color-profile artifacts).
2. **Raw hex with no variable**: find the token with that value. Multiple matches → pick by semantic role (text color → `on-surface` family, not a palette literal).
3. **Pixel values**: snap to the 4px scale. 13px ≈ `space-3` (12px) — confirm with the spacing between *other* elements in the frame; designers rarely mix off-scale values intentionally.
4. **Genuinely unmapped value**: do not invent a token, do not hardcode. Flag it: `UNMAPPED: <figma-var> = <value> (used by <element>)` in the design spec and stop for a decision.

## Semantic before literal

Components reference semantic tokens (`surface`, `on-surface`, `brand`) rather than palette
literals (`gray-100`, `blue-600`) so dark mode and rebrands stay one-file changes.
