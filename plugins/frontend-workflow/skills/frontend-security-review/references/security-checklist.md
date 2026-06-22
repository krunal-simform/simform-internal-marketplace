# Frontend security checklist

## Injection / XSS

- `dangerouslySetInnerHTML` — present anywhere in the diff? If yes: is the input passed through `DOMPurify.sanitize()` with a sane config, and is rich HTML truly required?
- String-built HTML, `insertAdjacentHTML`, `document.write` — should not appear.
- `eval`, `new Function(string)`, string-form `setTimeout`/`setInterval` — should not appear.
- User/API-derived values placed into `href`, `src`, `srcdoc`, `style`, or `target`: scheme allowlisted (`https:`, `mailto:`)? `javascript:` impossible?
- Dynamic `import()` or route paths built from user input.

## Secrets & data exposure

- Hardcoded API keys, tokens, credentials, internal URLs — including in tests, fixtures, stories, and screenshots referenced by the PR.
- New logging: no tokens, no PII, no full API payload dumps in `console.*` shipping to production.
- Error UI: messages don't leak stack traces or internal identifiers to end users.

## Auth & session

- Tokens stored in `localStorage`/`sessionStorage` (should follow project auth pattern — httpOnly cookie or in-memory).
- Auth state checks: UI hiding is fine UX but never the only gate — data fetching must rely on server enforcement; flag client-only "authorization".
- Logout/expiry paths still clear what they should.

## Network & URLs

- External links: `rel="noopener noreferrer"` with `target="_blank"`.
- Redirect targets from query params validated against an allowlist.
- New endpoints called over HTTPS; no mixed content.
- `postMessage` usage: origin checked on receive, explicit target origin on send.

## Dependencies (when lockfile changed)

- Each new package: was it in the approved plan? Maintained? Reasonable install size? Typosquatting check (name looks right)?
- `npm audit` findings at high/critical — must be resolved or explicitly accepted by the developer.
- No new postinstall scripts from obscure packages.

## Frontend-adjacent

- File uploads: client-side type/size validation present (UX) but not treated as the security boundary.
- Forms posting to third-party origins.
- New iframes: `sandbox` attributes appropriate.
- CSP-relevant changes (inline scripts/styles introduced where the app forbids them).
