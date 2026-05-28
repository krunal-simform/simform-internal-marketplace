# Deep-Dive Security Audit Checklist

Use this file for deep-dive audits, threat modeling requests, or compliance-oriented reviews.

---

## Extended Category Checklists

### A. Secrets & Credentials
- [ ] No credentials in source files, comments, or git history
- [ ] No credentials in Dockerfiles, CI configs, or build scripts
- [ ] Secrets referenced via environment variables or a vault (AWS Secrets Manager, HashiCorp Vault, etc.)
- [ ] `.env` files excluded from version control (`.gitignore`)
- [ ] Service account tokens / API keys scoped to minimum permissions
- [ ] Key rotation policy documented

### B. Injection
- [ ] All DB queries use parameterized statements / ORM
- [ ] No shell=True or equivalent with user input
- [ ] Template engines configured to auto-escape
- [ ] XML parsers disable external entity resolution (XXE)
- [ ] LDAP queries use parameterized or escaping libraries
- [ ] GraphQL input types validated; query depth/cost limited

### C. Authentication
- [ ] Passwords hashed with bcrypt / Argon2 / scrypt (cost factor appropriate)
- [ ] Multi-factor authentication available for sensitive operations
- [ ] Account lockout / rate limiting on login endpoints
- [ ] Password reset uses time-limited, single-use tokens
- [ ] "Remember me" tokens stored securely (httpOnly, Secure cookie)
- [ ] OAuth2 / OIDC: state parameter validated, redirect_uri allowlisted

### D. Authorization
- [ ] Every endpoint/action enforces authorization (not just authentication)
- [ ] Role checks server-side, never client-side only
- [ ] Object-level authorization: user can only access their own resources (IDOR check)
- [ ] Horizontal privilege escalation tested
- [ ] Admin functions behind separate auth layer

### E. Cryptography
- [ ] TLS 1.2+ enforced; TLS 1.0/1.1 disabled
- [ ] Cipher suite restricted to AEAD (AES-GCM, ChaCha20-Poly1305)
- [ ] HSTS header set with long max-age
- [ ] Certificate pinning where appropriate (mobile clients)
- [ ] Encryption at rest for sensitive data stores
- [ ] IV/nonces never reused with the same key
- [ ] Key storage separate from encrypted data

### F. Input Validation
- [ ] All user input validated server-side (client-side validation is UX, not security)
- [ ] File uploads: type validated by content (magic bytes), not just extension
- [ ] File uploads stored outside webroot or served via object store
- [ ] URL / path parameters checked for traversal sequences
- [ ] Redirect destinations validated against allowlist
- [ ] Input length limits enforced

### G. Dependencies
- [ ] Dependency versions pinned (lock files committed)
- [ ] Automated vulnerability scanning (Dependabot, Snyk, npm audit, pip-audit)
- [ ] No unmaintained packages (last release >2 years, 0 maintainers)
- [ ] Minimal dependency surface — no unused packages
- [ ] Sub-resource integrity (SRI) for CDN-loaded scripts

### H. Error Handling & Logging
- [ ] Stack traces not exposed to end users in production
- [ ] Error messages don't leak file paths, DB schema, or internal IPs
- [ ] Sensitive data (passwords, tokens, PII) never logged
- [ ] Structured logging with enough context to reconstruct incidents
- [ ] Log integrity: logs shipped to immutable store
- [ ] Audit trail for all privileged actions (who did what, when)

### I. Configuration & Headers
- [ ] Security headers present: CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy
- [ ] CORS policy: not `*` on credentialed endpoints
- [ ] Debug mode / verbose errors disabled in production
- [ ] Unnecessary HTTP methods disabled (TRACE, PUT on static servers)
- [ ] Rate limiting / WAF in front of public endpoints
- [ ] Default credentials changed on all services

### J. Infrastructure
- [ ] Network segmentation: DB not publicly accessible
- [ ] Firewall / security group rules follow least-privilege
- [ ] Cloud storage (S3, GCS, Blob) not publicly readable unless intentional
- [ ] IAM roles use least-privilege; no wildcard actions
- [ ] Encryption at rest enabled on all storage (DB, object store, disks)
- [ ] VPC flow logs and CloudTrail / audit logs enabled
- [ ] Automated patching or update cadence for base images

### K. Supply Chain
- [ ] Base Docker images pinned to digest (not just tag)
- [ ] Build pipeline has no untrusted third-party actions/orbs
- [ ] Signed commits / releases (if high-value target)
- [ ] SBOM generated and reviewed

---

## Threat Modeling (STRIDE) Quick Reference

| Threat | Applies to | Example |
|--------|-----------|---------|
| **S**poofing | Auth | Forged session cookie |
| **T**ampering | Data integrity | Unsigned JWT, CSRF |
| **R**epudiation | Audit logs | No audit trail for admin actions |
| **I**nformation disclosure | Data | Verbose errors, unencrypted traffic |
| **D**enial of service | Availability | No rate limit, ReDoS |
| **E**levation of privilege | AuthZ | IDOR, missing role check |

For each major component, run through STRIDE and note which threats apply and what mitigations are in place.

---

## Compliance Quick Map

| Framework | Key areas to highlight |
|-----------|----------------------|
| OWASP Top 10 (2021) | A01 Broken Access Control, A02 Cryptographic Failures, A03 Injection, A07 Auth failures |
| SOC 2 | Logging, access control, encryption, incident response |
| PCI-DSS | Cardholder data isolation, encryption, network segmentation |
| HIPAA | PHI encryption, access control, audit logs, breach notification |
| GDPR | Data minimization, right to deletion, breach notification |

Note any relevant compliance requirements in the audit report's Summary section.
