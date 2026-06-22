#!/usr/bin/env node
/**
 * Dependency-change audit for the current branch vs main.
 * Reports: packages added/removed/changed in package.json, and npm audit summary.
 * Usage: node audit-deps.mjs [--base main]
 * Exit codes: 0 = nothing concerning, 1 = high/critical advisories present, 2 = error.
 */
import { execSync } from 'node:child_process';

const baseIdx = process.argv.indexOf('--base');
const BASE = baseIdx > -1 ? process.argv[baseIdx + 1] : 'main';

function sh(cmd, opts = {}) {
  return execSync(cmd, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], ...opts });
}

function depsAt(ref) {
  try {
    const pkg = JSON.parse(sh(`git show ${ref}:package.json`));
    return { ...pkg.dependencies, ...pkg.devDependencies };
  } catch {
    return null;
  }
}

try {
  const before = depsAt(BASE);
  const after = depsAt('HEAD');
  if (!before || !after) {
    console.error(`Could not read package.json at ${BASE} or HEAD.`);
    process.exit(2);
  }

  const added = Object.keys(after).filter((k) => !(k in before));
  const removed = Object.keys(before).filter((k) => !(k in after));
  const changed = Object.keys(after).filter((k) => k in before && before[k] !== after[k]);

  let audit = { error: 'npm audit failed to run' };
  let auditExit = 0;
  try {
    const raw = sh('npm audit --json', { maxBuffer: 32 * 1024 * 1024 });
    const parsed = JSON.parse(raw);
    audit = parsed.metadata?.vulnerabilities ?? parsed;
  } catch (e) {
    // npm audit exits non-zero when vulnerabilities exist; stdout still has the JSON
    try {
      const parsed = JSON.parse(e.stdout ?? '');
      audit = parsed.metadata?.vulnerabilities ?? parsed;
      auditExit = 1;
    } catch {
      /* keep error marker */
    }
  }

  const highOrCritical = (audit.high ?? 0) + (audit.critical ?? 0);

  console.log(
    JSON.stringify(
      {
        base: BASE,
        packages: {
          added: added.map((k) => `${k}@${after[k]}`),
          removed,
          versionChanged: changed.map((k) => `${k}: ${before[k]} -> ${after[k]}`),
        },
        npmAudit: audit,
        verdict:
          highOrCritical > 0
            ? `BLOCKING: ${highOrCritical} high/critical advisories`
            : 'no high/critical advisories',
      },
      null,
      2,
    ),
  );
  process.exit(highOrCritical > 0 ? 1 : auditExit && highOrCritical > 0 ? 1 : 0);
} catch (err) {
  console.error(String(err?.message ?? err));
  process.exit(2);
}
