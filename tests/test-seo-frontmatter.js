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
  const fmMatch = content.match(/---\s*([\s\S]*?)\s*---/);
  if (!fmMatch) continue;
  const front = fmMatch[1];

  // Description check (only if present)
  const descMatch = front.match(/description:\s*["']?(.+?)["']?\s*$/m);
  if (descMatch) {
    const desc = descMatch[1].trim().replace(/^["']|["']$/g, '');
    const len = desc.length;
    if (len < 140 || len > 160) {
      failures.push({ type: 'description', file: path.relative(srcDir, file), len });
    }
  }

  // Title check (only if present)
  const titleMatch = front.match(/title:\s*["']?(.+?)["']?\s*$/m);
  if (titleMatch) {
    const title = titleMatch[1].trim().replace(/^["']|["']$/g, '').replace(/&amp;/g, '&');
    const len = title.length;
    if (len < 50 || len > 60) {
      failures.push({ type: 'title', file: path.relative(srcDir, file), len });
    }
  }

  // H2 count (only for pages that have a description, i.e. content pages)
  if (descMatch) {
    const h2Count = (content.match(/<h2/g) || []).length;
    if (h2Count < 2) {
      failures.push({ type: 'h2', file: path.relative(srcDir, file), count: h2Count });
    }
  }
}

if (failures.length > 0) {
  console.error('SEO frontmatter test failures:');
  for (const f of failures) {
    if (f.type === 'h2') {
      console.error(`  H2 FAIL: ${f.file} (count=${f.count})`);
    } else if (f.type === 'description') {
      console.error(`  DESCRIPTION FAIL: ${f.file} (len=${f.len}, should be 140-160)`);
    } else if (f.type === 'title') {
      console.error(`  TITLE FAIL: ${f.file} (len=${f.len}, should be 50-60)`);
    } else {
      console.error(`  ${f.type.toUpperCase()} FAIL: ${f.file} (len=${f.len})`);
    }
  }
  process.exit(1);
} else {
  console.log('All SEO frontmatter checks passed.');
  process.exit(0);
}
