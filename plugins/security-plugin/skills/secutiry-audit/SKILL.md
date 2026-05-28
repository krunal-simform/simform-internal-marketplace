---
name: security-audit
description: >
  Perform structured security audits on code, configurations, and infrastructure files.
  Use this skill whenever the user asks to audit, review, or scan for security issues,
  vulnerabilities, or risks — even if they phrase it casually like "check this for security
  problems", "is my code safe?", "look for vulnerabilities", "security review", or
  "harden my config". Triggers on: security audit, pen test review, vulnerability scan,
  OWASP check, CVE analysis, secrets detection, dependency audit, infrastructure review,
  config hardening, threat modeling, or any request to find security flaws in code/config.
---

# Security Audit Skill

Systematically review code, configuration files, or infrastructure for security vulnerabilities and produce a clear, actionable audit report.

---

## Workflow

### 1. Intake & Scope

Before diving in, identify:
- **What's being audited**: source code, config files, Dockerfile, IaC (Terraform/K8s), API spec, dependency list, etc.
- **Language / ecosystem**: Python, JS/TS, Go, Java, Ruby, shell, YAML, etc.
- **Audit depth** (infer from context or ask once):
  - *Quick scan* — flag obvious issues fast
  - *Standard audit* — thorough review with OWASP alignment
  - *Deep dive* — full threat-model + remediation advice

If the user uploads a file or pastes code, proceed immediately with a **standard audit** unless told otherwise.

---

### 2. Audit Categories

Check all categories that apply to the material. Skip categories clearly out of scope (e.g. no DB calls → skip SQL injection).

| # | Category | Key checks |
|---|----------|-----------|
| A | **Secrets & credentials** | Hardcoded passwords, API keys, tokens, private keys in source |
| B | **Injection** | SQL, command, LDAP, XPath, template injection |
| C | **Authentication & session** | Weak/missing auth, insecure session handling, JWT pitfalls |
| D | **Authorization** | Missing access controls, privilege escalation, IDOR |
| E | **Cryptography** | Weak algorithms (MD5/SHA1/DES/RC4), hardcoded salts, insecure RNG |
| F | **Input validation** | Unvalidated user input, XSS, path traversal, open redirect |
| G | **Dependency risks** | Known-vulnerable packages, pinning issues, supply-chain risks |
| H | **Secrets management** | Env var exposure, log leakage, verbose error messages |
| I | **Configuration** | Insecure defaults, unnecessary services/ports, missing TLS, permissive CORS |
| J | **Infrastructure / IaC** | Overly permissive IAM, public storage buckets, missing encryption at rest |
| K | **Logging & monitoring** | Missing audit logs, sensitive data in logs |

For a quick scan, focus on A–C + F.  
For deep dives, load `references/deep-dive.md` for extended checklists.

---

### 3. Severity Rating

Rate every finding:

| Severity | Criteria |
|----------|---------|
| 🔴 Critical | Immediate exploitation possible; data breach / RCE risk |
| 🟠 High | Significant risk; exploitable with low effort |
| 🟡 Medium | Exploitable under certain conditions |
| 🔵 Low | Minor risk; defense-in-depth improvement |
| ⚪ Info | Best-practice note; no direct exploitability |

---

### 4. Report Format

Always structure the output as:

```
## Security Audit Report
**Target:** <file/component name>
**Date:** <today>
**Scope:** <Quick / Standard / Deep>

### Summary
<2–3 sentence overview of overall security posture and highest-priority concern>

### Findings

#### [SEVERITY EMOJI] [CATEGORY] — <Short Title>
- **Location:** <file:line or component>
- **Description:** What the issue is and why it's a problem
- **Risk:** What an attacker could do
- **Recommendation:** Concrete fix with code example if helpful

(repeat for each finding)

### Findings Overview
| Severity | Count |
|----------|-------|
| 🔴 Critical | N |
| 🟠 High | N |
| 🟡 Medium | N |
| 🔵 Low | N |
| ⚪ Info | N |

### Remediation Priority
Ordered list of top 3–5 actions to take first.

### Positive Observations
<Brief note on things done well — 1–3 items. Always include this.>
```

---

## Rules & Tone

- **Be precise**: cite file names and line numbers when available.
- **Be constructive**: every finding must include a recommendation.
- **No false positives**: if unsure, mark as ⚪ Info and explain the concern.
- **Be concise**: avoid padding. Practitioners read these reports fast.
- **Don't shame**: frame issues as improvements, not failures.
- **No actual exploit code**: describe what's exploitable, don't write working exploits.

---

## Common Quick-Win Patterns to Always Check

```python
# Secrets in code
password = "hunter2"          # 🔴 hardcoded credential
api_key = os.environ["KEY"]   # ✅ env var

# Injection
query = f"SELECT * FROM users WHERE id = {user_id}"   # 🔴 SQLi
query = "SELECT * FROM users WHERE id = ?"            # ✅ parameterized

# Weak crypto
hashlib.md5(password)          # 🔴 broken for passwords
bcrypt.hashpw(password, salt)  # ✅

# Missing auth check
@app.route("/admin/delete")    # 🟠 no @login_required
def delete_user(): ...
```

For language-specific patterns (JS/TS, Go, Java, shell, IaC), see `references/language-patterns.md`.

---

## When to Load Reference Files

- **`references/deep-dive.md`** — load for deep-dive audits or when asked for threat modeling
- **`references/language-patterns.md`** — load when auditing a specific language and you need idiomatic patterns for that ecosystem
