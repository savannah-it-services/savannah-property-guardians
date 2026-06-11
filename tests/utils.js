const fs = require('fs');
const path = require('path');

const SITE_ORIGIN = 'https://www.savannahpropertyguardians.com';
const ASSET_EXTENSIONS = /\.(css|js|webp|png|ico|svg|jpg|jpeg|gif|map|txt|xml)$/i;

function walkHtmlFiles(dir) {
  const results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results.push(...walkHtmlFiles(filePath));
    } else if (file.endsWith('.html')) {
      results.push(filePath);
    }
  });
  return results;
}

function isInternalPageUrl(url) {
  let normalized = url;

  // Strip query and hash
  normalized = normalized.split('#')[0].split('?')[0];

  // Convert full URL to path if same origin
  if (normalized.startsWith('http')) {
    if (!normalized.startsWith(SITE_ORIGIN)) {
      return false; // external
    }
    normalized = normalized.slice(SITE_ORIGIN.length);
  }

  if (!normalized.startsWith('/')) {
    return false;
  }

  // Skip assets and files with extensions we don't want slashed
  if (normalized.startsWith('/assets/')) return false;
  if (ASSET_EXTENSIONS.test(normalized)) return false;

  // Skip non-page things like mailto, tel, javascript, data
  if (/^(mailto|tel|javascript|data):/i.test(url)) return false;

  return true;
}

function shouldEndWithSlash(url) {
  const normalized = url.split('#')[0].split('?')[0];
  let path = normalized;

  if (path.startsWith('http')) {
    if (!path.startsWith(SITE_ORIGIN)) return false;
    path = path.slice(SITE_ORIGIN.length);
  }

  if (path === '/' || path === '') return true;

  // If it has a file extension in the last segment, it doesn't need trailing slash (e.g. 404.html)
  const lastSegment = path.split('/').pop();
  if (lastSegment && lastSegment.includes('.')) {
    return true; // allow files like 404.html
  }

  // Pretty page URLs must end with /
  return path.endsWith('/');
}

module.exports = {
  walkHtmlFiles,
  isInternalPageUrl,
  shouldEndWithSlash,
  SITE_ORIGIN,
};
