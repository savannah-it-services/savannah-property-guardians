const fs = require('fs');
const path = require('path');

function walk(dir, files = []) {
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      if (file === '_includes' || file === '_data') continue;
      walk(full, files);
    } else if (file.endsWith('.njk')) {
      files.push(full);
    }
  }
  return files;
}

const srcDir = path.join(__dirname, '..', 'src');
const files = walk(srcDir);

let failures = [];

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  // Find all <img> tags (case-insensitive, though source is lowercase)
  const imgRegex = /<img[^>]*>/gi;
  let match;
  while ((match = imgRegex.exec(content)) !== null) {
    const tag = match[0];
    // Check alt text (present and non-empty)
    const altMatch = tag.match(/alt\s*=\s*["']([^"']*)["']/i);
    const hasAlt = altMatch && altMatch[1].trim().length > 0;

    // Check width and height (numeric)
    const widthMatch = tag.match(/width\s*=\s*["'](\d+)["']/i);
    const heightMatch = tag.match(/height\s*=\s*["'](\d+)["']/i);
    const hasWidthHeight = !!widthMatch && !!heightMatch;

    // Check webp format in src
    const srcMatch = tag.match(/src\s*=\s*["']([^"']*)["']/i);
    const isWebp = srcMatch && srcMatch[1].toLowerCase().includes('.webp');

    if (!hasAlt || !hasWidthHeight || !isWebp) {
      let issues = [];
      if (!hasAlt) issues.push('missing or empty alt');
      if (!hasWidthHeight) issues.push('missing or invalid width/height');
      if (!isWebp) issues.push('not webp format');
      failures.push({
        file: path.relative(srcDir, file),
        tag: tag,
        issues: issues.join(', ')
      });
    }
  }
}

if (failures.length > 0) {
  console.error('SEO images test failures:');
  for (const f of failures) {
    console.error(`  IMG FAIL: ${f.file}`);
    console.error(`    Issues: ${f.issues}`);
    console.error(`    Tag: ${f.tag.substring(0, 120)}...`);
  }
  process.exit(1);
} else {
  console.log('All SEO images checks passed.');
  process.exit(0);
}
