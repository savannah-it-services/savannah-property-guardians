#!/usr/bin/env node
/**
 * Test: Scan all URLs in the generated HTML files in /docs
 * and ensure that page URLs end with a trailing slash.
 *
 * This test expects `npm run build:gh-pages` to have been run
 * so that ./docs exists with the built site.
 */

const fs = require('fs');
const path = require('path');
const { walkHtmlFiles, isInternalPageUrl, shouldEndWithSlash } = require('./utils');

const DOCS_DIR = path.resolve(__dirname, '../docs');

function extractUrlsFromHtml(content) {
  const urls = new Set();

  // href attributes (most links)
  const hrefMatches = content.matchAll(/href=["']([^"']+)["']/gi);
  for (const match of hrefMatches) {
    urls.add(match[1]);
  }

  // src attributes (less common for pages, but for completeness)
  const srcMatches = content.matchAll(/src=["']([^"']+)["']/gi);
  for (const match of srcMatches) {
    urls.add(match[1]);
  }

  // Canonical and og:url in meta
  const metaMatches = content.matchAll(/<meta[^>]+content=["']([^"']+)["'][^>]*>/gi);
  for (const match of metaMatches) {
    const contentVal = match[1];
    // Only consider likely page urls
    if (contentVal.includes('savannahpropertyguardians.com') || contentVal.startsWith('/')) {
      urls.add(contentVal);
    }
  }

  // Also link rel=canonical
  const linkMatches = content.matchAll(/<link[^>]+rel=["'][^"']*canonical[^"']*["'][^>]*href=["']([^"']+)["'][^>]*>/gi);
  for (const match of linkMatches) {
    urls.add(match[1]);
  }

  return Array.from(urls);
}

function main() {
  console.log('🔍 Running HTML URL trailing slash test...');

  if (!fs.existsSync(DOCS_DIR)) {
    console.error('❌ docs/ directory not found. Run "npm run build:gh-pages" first.');
    process.exit(1);
  }

  const htmlFiles = walkHtmlFiles(DOCS_DIR);
  let failures = 0;

  for (const file of htmlFiles) {
    const relativeFile = path.relative(DOCS_DIR, file);
    const content = fs.readFileSync(file, 'utf8');
    const urls = extractUrlsFromHtml(content);

    for (const url of urls) {
      if (!isInternalPageUrl(url)) continue;

      if (!shouldEndWithSlash(url)) {
        console.error(`❌ [${relativeFile}] URL does not end with slash: ${url}`);
        failures++;
      }
    }
  }

  if (failures > 0) {
    console.error(`\n❌ HTML URL test failed with ${failures} issue(s).`);
    process.exit(1);
  }

  console.log(`✅ HTML URL trailing slash test passed. Scanned ${htmlFiles.length} HTML files.`);
}

main();
