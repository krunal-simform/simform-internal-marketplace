# simp-utils

**Version:** 1.0.0  
**Author:** Simform Solutions  
**License:** MIT

Developer utilities for Claude Code — code formatting checks and PR summary
generation.

## What it does

### Hooks

| Event | Matcher | Behaviour |
|-------|---------|-----------|
| `PreToolUse` | `Write \| Edit` | Warns when a file exceeds 500 lines before writing |
| `PostToolUse` | `Write \| Edit` | Runs a syntax check on Python files after saving |

### Skills

| Skill | Trigger | Description |
|-------|---------|-------------|
| `format-check` | `/format-check` | Scans modified/staged files for formatting issues |
| `pr-summary` | `/pr-summary` | Generates a structured PR description from the current branch |

## Files

```
simp-utils/
├── plugin.json
├── README.md
├── CHANGELOG.md
├── hooks/
│   ├── hooks.json            # Hook wiring
│   ├── check_file_size.py    # PreToolUse — warns on large file writes
│   └── lint_on_save.py       # PostToolUse — syntax check after save
└── skills/
    ├── format-check/
    │   └── SKILL.md
    └── pr-summary/
        └── SKILL.md
```

## Hook details

### `check_file_size.py`

Fires before `Write` or `Edit`. Counts lines in the content being written. If
the file exceeds **500 lines**, it prints a warning to stderr suggesting the
file be split. Does not block the write.

### `lint_on_save.py`

Fires after `Write` or `Edit`. For Python files (`.py`), runs
`python3 -m py_compile` and reports either "syntax OK" or the error to stderr.
Non-Python files are silently skipped.

## Skill details

### `/format-check`

Asks Claude to inspect all modified or staged files and report formatting status
in a markdown table — one row per file, with the detected language, formatter
used, and pass/fail.

### `/pr-summary`

Asks Claude to read the current branch's commits and diff against main/master
and produce a ready-to-paste PR description with Summary, Files changed, and
Testing notes sections.

## Installation

Add to your project's `.claude/settings.json`:

```json
{
  "plugins": [
    "/path/to/simform-internal/plugins/simp-utils"
  ]
}
```
