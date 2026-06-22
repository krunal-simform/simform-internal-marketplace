# Security requirements

Always in effect.

- **No secrets in code, tests, screenshots, or PR bodies.** API keys, tokens, and credentials come from environment variables. The commit hook runs gitleaks, but don't rely on it — never type a secret into a file.
- **HTML injection**: `dangerouslySetInnerHTML` only with `DOMPurify.sanitize()` on the input, and only when rendering rich text is a genuine requirement. Prefer rendering structured data.
- **URLs**: external links get `rel="noopener noreferrer"`. Never build redirect targets or `href`s from unvalidated user/API input; allowlist schemes (`https:`, `mailto:`).
- **Token handling**: never store auth tokens in `localStorage`; follow the project's existing auth pattern (httpOnly cookies / in-memory). Don't log tokens or PII to the console.
- **Dependencies**: adding or upgrading a package requires explicit approval in the plan, plus `npm audit` on the change. Prefer the platform or existing deps over new ones.
- **eval and friends**: no `eval`, `new Function(string)`, or string-built `setTimeout`. No dynamic `import()` from non-literal user-derived paths.
