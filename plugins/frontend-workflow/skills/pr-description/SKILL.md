---
name: pr-description
description: Write the pull request title and body for ticket work using the
  repository PR template. Use when creating a PR, when asked to write or improve
  a PR description, or at step 8 of the frontend-task workflow.
---

# PR description

The body follows `.github/pull_request_template.md` — fill every section; never delete
one (write "n/a — <why>" instead, so reviewers know it was considered, not skipped).
`references/example-pr.md` shows the target quality.

## Title

Same convention as commits: `feat(PROJ-123): add appointment date picker`.

## Section guidance

- **Summary**: what changed and *why*, from the reviewer's perspective. 2–4 sentences; link the decision to the ticket's goal, not a file-by-file replay.
- **Links**: Jira ticket + the exact Figma frames implemented.
- **Screenshots**: the implementation screenshots captured during UI verification (step 5), placed against the matching Figma refs at 375/768/1440 — plus any states a reviewer would question (error, empty). Upload images; don't reference local paths.
- **Test plan**: which AC each test covers, what's unit vs integration, anything verified manually and why it couldn't be automated.
- **Accessibility**: check the boxes only if the ui-verifier pass and axe scan actually confirmed them; link or paste the scan summary.
- **Risk & rollback**: blast radius (what shares this code), feature flag if any, revert plan.

## Before submitting

Scrub the body and screenshots for secrets, tokens, internal-only URLs, and customer PII —
PR bodies outlive branches and often have wider visibility than the repo's code. Keep the
body honest: if a nit from review was consciously skipped, say so.
