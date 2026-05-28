# Changelog — simp-utils

All notable changes to this plugin follow [Keep a Changelog](https://keepachangelog.com/)
and [Semantic Versioning](https://semver.org/).

## [1.0.0] — 2026-05-27

### Added
- `check_file_size.py` PreToolUse hook: warns (stderr) when a file being
  written or edited exceeds 500 lines, suggesting a split into smaller modules.
- `lint_on_save.py` PostToolUse hook: runs `python3 -m py_compile` on `.py`
  files after Write/Edit and reports syntax status to stderr.
- `format-check` skill: instructs Claude to scan modified/staged files for
  formatting issues and present results as a markdown table.
- `pr-summary` skill: instructs Claude to generate a structured PR description
  (Summary, Files changed, Testing notes) from the current branch's commits and
  diff.
- `hooks.json` wiring: PreToolUse on Write/Edit → check_file_size; PostToolUse
  on Write/Edit → lint_on_save.
