#!/usr/bin/env node
/**
 * Test: Scan all ld+json (JSON-LD) data in the generated HTML files in /docs
 * and ensure that all URLs/links inside them end with a trailing slash
 * (for page URLs).
 *
 * Expects ./docs to exist from a prior `npm run build:gh-pages`.
 */

const fs = require('fs');
const path = require('path');
const { walkHtmlFiles, isInternalPageUrl, shouldEndWithSlash } = require('./utils');

const DOCS_DIR = path.resolve(__dirname, '../docs');

function extractJsonLdBlocks(content) {
  const blocks = [];
  // Capture content between <script type="application/ld+json"> and </script>
  const regex = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let match;
  while ((match = regex.exec(content)) !== null) {
    let jsonText = match[1].trim();
    // Remove HTML comments if any
    jsonText = jsonText.replace(/<!--[\s\S]*?-->/g, '');
    if (jsonText) {
      blocks.push(jsonText);
    }
  }
  return blocks;
}

function collectUrlsFromValue(value, urls = []) {
  if (typeof value === 'string') {
    if (value.startsWith('http') || value.startsWith('/')) {
      urls.push(value);
    }
  } else if (Array.isArray(value)) {
    value.forEach(v => collectUrlsFromValue(v, urls));
  } else if (value && typeof value === 'object') {
    Object.values(value).forEach(v => collectUrlsFromValue(v, urls));
  }
  return urls;
}

function main() {
  console.log('🔍 Running ld+json URL trailing slash test...');

  if (!fs.existsSync(DOCS_DIR)) {
    console.error('❌ docs/ directory not found. Run "npm run build:gh-pages" first.');
    process.exit(1);
  }

  const htmlFiles = walkHtmlFiles(DOCS_DIR);
  let failures = 0;

  for (const file of htmlFiles) {
    const relativeFile = path.relative(DOCS_DIR, file);
    const content = fs.readFileSync(file, 'utf8');
    const jsonBlocks = extractJsonLdBlocks(content);

    for (const jsonText of jsonBlocks) {
      let data;
      try {
        data = JSON.parse(jsonText);
      } catch (e) {
        console.warn(`⚠️  [${relativeFile}] Failed to parse JSON-LD block (skipping): ${e.message}`);
        continue;
      }

      const allUrls = collectUrlsFromValue(data);

      for (const url of allUrls) {
        if (!isInternalPageUrl(url)) continue;

        if (!shouldEndWithSlash(url)) {
          console.error(`❌ [${relativeFile}] ld+json URL does not end with slash: ${url}`);
          failures++;
        }
      }
    }
  }

  if (failures > 0) {
    console.error(`\n❌ ld+json URL test failed with ${failures} issue(s).`);
    process.exit(1);
  }

  console.log(`✅ ld+json URL trailing slash test passed. Scanned ${htmlFiles.length} HTML files.`);
}

main();
