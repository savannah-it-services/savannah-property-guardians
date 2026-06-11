#!/usr/bin/env node
/**
 * Test: Scan docs/sitemap.xml and ensure every <loc> URL ends with a trailing slash.
 *
 * Expects ./docs to exist from a prior `npm run build:gh-pages`.
 */

const fs = require('fs');
const path = require('path');

const DOCS_DIR = path.resolve(__dirname, '../docs');
const SITEMAP_PATH = path.join(DOCS_DIR, 'sitemap.xml');

function main() {
  console.log('🔍 Running sitemap.xml trailing slash test...');

  if (!fs.existsSync(SITEMAP_PATH)) {
    console.error('❌ docs/sitemap.xml not found. Run "npm run build:gh-pages" first.');
    process.exit(1);
  }

  const content = fs.readFileSync(SITEMAP_PATH, 'utf8');
  const locRegex = /<loc>([^<]+)<\/loc>/gi;
  const locs = [];
  let match;
  while ((match = locRegex.exec(content)) !== null) {
    locs.push(match[1].trim());
  }

  if (locs.length === 0) {
    console.error('❌ No <loc> entries found in sitemap.xml');
    process.exit(1);
  }

  let failures = 0;

  for (const loc of locs) {
    if (!loc.endsWith('/')) {
      console.error(`❌ sitemap.xml URL does not end with slash: ${loc}`);
      failures++;
    }
  }

  if (failures > 0) {
    console.error(`\n❌ sitemap.xml test failed with ${failures} issue(s).`);
    process.exit(1);
  }

  console.log(`✅ sitemap.xml trailing slash test passed. Checked ${locs.length} <loc> entries.`);
}

main();
