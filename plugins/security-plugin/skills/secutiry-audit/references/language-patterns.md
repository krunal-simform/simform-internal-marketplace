# Language-Specific Security Patterns

## JavaScript / TypeScript (Node.js)

```js
// XSS — DOM
element.innerHTML = userInput        // 🔴 XSS
element.textContent = userInput      // ✅

// Prototype pollution
obj[userKey] = value                 // 🟠 check if key is __proto__ etc.

// Path traversal
path.join(__dirname, req.params.file)  // 🟠 must sanitize
path.resolve + allowlist check         // ✅

// eval / dynamic code
eval(userInput)                      // 🔴 RCE
new Function(userInput)              // 🔴 RCE

// Regex DoS
new RegExp(userInput)                // 🟠 ReDoS risk

// Insecure deserialization
JSON.parse(userInput)                // ✅ (JSON is safe)
serialize-javascript unserialize()   // 🔴 RCE

// jwt
jwt.verify(token, secret)            // ✅
jwt.decode(token)                    // 🔴 no signature check

// express
app.use(helmet())                    // ✅ security headers
res.setHeader("X-Frame-Options",…)   // ✅ manual
```

---

## Python

```python
# Command injection
subprocess.call(f"ls {user_dir}", shell=True)   # 🔴
subprocess.run(["ls", user_dir])                # ✅

# Template injection
render_template_string(user_input)              # 🔴 SSTI
render_template("template.html", var=user_input)# ✅

# Pickle deserialization
pickle.loads(untrusted_data)                    # 🔴 RCE

# XML / XXE
lxml.etree.parse(untrusted_xml)                 # 🟠 check resolve_entities
defusedxml.etree.parse(…)                       # ✅

# SQL (Django ORM)
Model.objects.raw(f"… {user_id}")               # 🔴
Model.objects.filter(id=user_id)                # ✅

# Open redirect
return redirect(request.args.get("next"))       # 🟠 validate domain
```

---

## Go

```go
// SQL injection
db.Query("SELECT * FROM users WHERE id=" + id)   // 🔴
db.Query("SELECT * FROM users WHERE id=?", id)   // ✅

// Command injection
exec.Command("sh", "-c", userInput)              // 🔴
exec.Command("ls", userInput)                    // ✅ (args not shell)

// Path traversal
filepath.Join(base, userPath)                    // 🟠 check stays within base
filepath.Clean + strings.HasPrefix check         // ✅

// TLS
tls.Config{InsecureSkipVerify: true}             // 🔴
tls.Config{}                                     // ✅ (default verifies)

// Weak random
math/rand                                        // 🔴 for security use
crypto/rand                                      // ✅
```

---

## Java

```java
// SQL injection
Statement.execute("… " + userId)                 // 🔴
PreparedStatement with ?                         // ✅

// Deserialization
ObjectInputStream.readObject(untrusted)          // 🔴 RCE

// XXE
DocumentBuilderFactory.newInstance()             // 🟠 disable external entities
factory.setFeature(DISALLOW_DOCTYPE, true)       // ✅

// Weak crypto
MessageDigest.getInstance("MD5")                 // 🔴 for passwords
BCrypt / Argon2                                  // ✅

// Open redirect
response.sendRedirect(request.getParameter("url"))  // 🟠 validate
```

---

## Shell Scripts

```bash
# Command injection
eval "$user_input"                    # 🔴
"$user_input"                         # 🟠 quote; prefer array args

# Insecure temp files
TMPFILE=/tmp/myapp-$$                 # 🟠 predictable
TMPFILE=$(mktemp)                     # ✅

# World-writable paths
chmod 777 /var/app/data               # 🔴
chmod 750 /var/app/data               # ✅

# Curl piping
curl http://… | bash                  # 🔴 supply chain
# verify signature instead
```

---

## Infrastructure as Code (Terraform / K8s YAML)

```hcl
# Terraform — overly permissive S3
resource "aws_s3_bucket_acl" { acl = "public-read" }  # 🟠
resource "aws_s3_bucket_public_access_block" {
  block_public_acls = true …                           # ✅
}

# Terraform — IAM wildcard
actions   = ["*"]    # 🔴 least privilege violation
resources = ["*"]    # 🔴

# Terraform — unencrypted storage
encrypted = false    # 🔴
encrypted = true     # ✅
```

```yaml
# Kubernetes — privileged pod
securityContext:
  privileged: true                # 🔴
  runAsNonRoot: false             # 🔴

# Kubernetes — default service account
automountServiceAccountToken: true  # 🟠 disable if not needed

# Kubernetes — exposed secrets as env vars
env:
  - name: DB_PASS
    value: "hunter2"              # 🔴 use secretKeyRef
```
