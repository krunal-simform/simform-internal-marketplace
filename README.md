# simform-internal — Claude Code Plugin Marketplace

Internal marketplace of Claude Code plugins maintained by **Simform Solutions**.

## What is this?

This repository hosts versioned Claude Code plugins that extend Claude's behaviour
with project-specific hooks and skills. Plugins are installed per-project by
pointing Claude Code at the plugin directory.

## Plugins

| Plugin | Version | Description |
|--------|---------|-------------|
| [security-plugin](plugins/security-plugin/) | 1.0.0 | Security guards & bash command logging |
| [simp-utils](plugins/simp-utils/) | 1.0.0 | Developer utilities — code formatting checks and PR summary generation |

## Repository layout

```
simform-internal-marketplace/
├── README.md                 # This file
├── .claude-plugin/           # Plugin registry configuration
└── plugins/
    ├── security-plugin/      # Security guards and bash command logging
    │   ├── .claude-plugin/
    │   ├── plugin.json
    │   ├── hooks/
    │   │   ├── hooks.json
    │   │   └── scripts/
    │   └── skills/
    │       └── secutiry-audit/
    │           ├── SKILL.md
    │           └── references/
    └── simp-utils/           # Developer utilities
        ├── .claude-plugin/
        ├── README.md
        ├── CHANGELOG.md
        ├── plugin.json
        └── skills/
            └── pr-summary/
                └── SKILL.md
```

## Installing a plugin

1. Clone this repository (or keep it as a submodule inside your project).
2. In your project's `.claude/settings.json`, add the plugin path:

```json
{
  "plugins": [
    "/path/to/simform-internal-marketplace/plugins/security-plugin",
    "/path/to/simform-internal-marketplace/plugins/simp-utils"
  ]
}
```

3. Restart Claude Code. The plugin's skills and hooks become active automatically.

## Versioning policy

Plugins follow [Semantic Versioning](https://semver.org/):

- **Patch** (1.0.x) — bug fixes, documentation updates, non-breaking hook tweaks.
- **Minor** (1.x.0) — new skills or hooks added; existing behaviour unchanged.
- **Major** (x.0.0) — breaking changes to hook contracts or skill interfaces.

Each plugin's `plugin.json` carries its own version.

## Contributing

1. Create a branch: `feat/plugin-name-description`.
2. Add or update files under `plugins/<plugin-name>/`.
3. Bump the version in `plugin.json` and add an entry to `CHANGELOG.md`.
4. Open a PR against `main`.

## Maintainer

Krunal Patel — krunal.patel@simformsolutions.com
