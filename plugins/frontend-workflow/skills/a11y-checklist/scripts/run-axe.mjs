#!/usr/bin/env node
/**
 * Automated axe-core scan of a running page.
 * Usage: node run-axe.mjs <url> [--tags wcag2a,wcag2aa,wcag22aa]
 * Exit codes: 0 = no violations, 1 = violations found, 2 = setup/usage error.
 * Requires dev deps: playwright, @axe-core/playwright.
 */

const url = process.argv[2];
const tagsArg = process.argv.find((a) => a.startsWith('--tags'));
const tags = tagsArg
  ? (tagsArg.split('=')[1] ?? process.argv[process.argv.indexOf(tagsArg) + 1]).split(',')
  : ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'];

if (!url) {
  console.error('Usage: node run-axe.mjs <url> [--tags wcag2a,wcag2aa]');
  process.exit(2);
}

let chromium, AxeBuilder;
try {
  ({ chromium } = await import('playwright'));
  ({ default: AxeBuilder } = await import('@axe-core/playwright'));
} catch {
  console.error(
    'Missing dependencies. Install with:\n  npm i -D playwright @axe-core/playwright && npx playwright install chromium',
  );
  process.exit(2);
}

const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle' });

  const results = await new AxeBuilder({ page }).withTags(tags).analyze();

  const summary = results.violations.map((v) => ({
    rule: v.id,
    impact: v.impact,
    help: v.help,
    helpUrl: v.helpUrl,
    nodes: v.nodes.map((n) => ({ target: n.target, failure: n.failureSummary })),
  }));

  console.log(
    JSON.stringify(
      { url, tags, violationCount: summary.length, violations: summary },
      null,
      2,
    ),
  );
  process.exit(summary.length === 0 ? 0 : 1);
} finally {
  await browser.close();
}
