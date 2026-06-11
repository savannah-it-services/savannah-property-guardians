#!/usr/bin/env node
/**
 * Test: Validate that every <loc> in docs/sitemap.xml corresponds to an actual
 * file that will be served when the site is deployed (i.e. the URL resolves
 * to a built file in the output directory).
 *
 * This ensures the sitemap only contains URLs that the static site actually
 * produces (no stale entries, no URLs that would 404 on GitHub Pages).
 *
 * Expects ./docs to exist from a prior `npm run build:gh-pages`.
 */

const fs = require('fs');
const path = require('path');

const DOCS_DIR = path.resolve(__dirname, '../docs');
const SITEMAP_PATH = path.join(DOCS_DIR, 'sitemap.xml');
const SITE_ORIGIN = 'https://www.savannahpropertyguardians.com';

function main() {
  console.log('🔍 Running sitemap resolution test (do all sitemap URLs resolve?)...');

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
    // Derive the filesystem path that would serve this URL on GitHub Pages
    let relativePath = loc;

    if (relativePath.startsWith(SITE_ORIGIN)) {
      relativePath = relativePath.slice(SITE_ORIGIN.length);
    }

    // Normalize: remove leading slash for path joining
    if (relativePath.startsWith('/')) {
      relativePath = relativePath.slice(1);
    }

    let fsPath;
    if (!relativePath || relativePath === '') {
      // Root URL -> index.html
      fsPath = 'index.html';
    } else if (relativePath.endsWith('/')) {
      // Directory style URL -> append index.html
      fsPath = relativePath + 'index.html';
    } else {
      // Direct file (e.g. robots.txt or a .html if ever used)
      fsPath = relativePath;
    }

    const fullPath = path.join(DOCS_DIR, fsPath);

    if (!fs.existsSync(fullPath)) {
      console.error(`❌ Sitemap URL would not resolve: ${loc}`);
      console.error(`   Expected file not found: ${fsPath}`);
      failures++;
    }
  }

  if (failures > 0) {
    console.error(`\n❌ Sitemap resolution test failed with ${failures} issue(s).`);
    process.exit(1);
  }

  console.log(`✅ Sitemap resolution test passed. All ${locs.length} <loc> entries resolve to files in the build output.`);
}

main();
