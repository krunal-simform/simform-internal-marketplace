---
description: Generate a concise PR description from staged commits and diffs
---

Analyze the current git branch's commits and diff against the base branch (main
or master) and produce a pull request description in this format:

## Summary
- Bullet points describing what changed and why (max 5 bullets)

## Files changed
- List each modified file with a one-line reason

## Testing notes
- How to verify the change works correctly

Keep the tone professional and concise. Do not repeat commit messages verbatim —
synthesize them into coherent prose.
