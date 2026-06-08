require('dotenv').config();

const path = require('path');
const fs = require('fs');

module.exports = function (eleventyConfig) {
  // Copy static assets
  eleventyConfig.addPassthroughCopy('src/assets');
  // Copy favicon assets to output root (for /favicon-*.png etc.)
  eleventyConfig.addPassthroughCopy({
    'src/apple-touch-icon.png': 'apple-touch-icon.png',
    'src/favicon-16x16.png': 'favicon-16x16.png',
    'src/favicon-32x32.png': 'favicon-32x32.png',
    'src/favicon.ico': 'favicon.ico'
  });
  // robots.txt is now handled as a template in src/robots.txt

  // Sitemap is now generated via src/sitemap.11ty.js (with proper file modification dates)

  // Custom filter to produce URLs without trailing slashes (for uniform links/canonicals)
  eleventyConfig.addFilter("cleanUrl", (url) => {
    if (typeof url !== 'string') return url;
    let cleaned = url.replace(/\.html$/, '').replace(/\/$/, '');
    if (!cleaned || cleaned === '') return '/';
    return cleaned;
  });

  // Configure the dev server (BrowserSync) for clean URLs (no trailing slashes in the address bar).
  //
  // Strategy:
  // - permalinks use a trailing slash internally so Eleventy outputs proper dir/index.html structures.
  // - All links, canonicals, sitemap, schema etc. are emitted clean (via cleanUrl filter and stripping).
  // - This middleware:
  //   1. 301s any incoming slashed URL to the clean version (cleans the bar for bookmarks/external links).
  //   2. For clean extensionless paths (pretty URLs), if a matching dist/.../index.html exists,
  //      we internally rewrite the request so the static server delivers the page content while
  //      the browser URL stays clean (no redirect, no trailing slash added).
  // - serveStaticOptions.redirect: false disables BrowserSync's default "add slash for directories" behavior.
  eleventyConfig.setServerOptions({
    serveStaticOptions: {
      redirect: false
    },
    middleware: [
      function (req, res, next) {
        // Split path and query so we can manipulate the path cleanly
        const [pathname, queryPart] = req.url.split('?');
        const q = queryPart ? '?' + queryPart : '';

        let cleanPath = pathname;
        if (cleanPath.length > 1 && cleanPath.endsWith('/')) {
          cleanPath = cleanPath.slice(0, -1);
        }

        // If the original request had a trailing slash (and wasn't root), 301 to the clean form.
        // This updates the browser address bar and the client will follow up with a clean request.
        if (pathname !== cleanPath) {
          res.writeHead(301, { Location: cleanPath + q });
          return res.end();
        }

        // Now handle clean (no trailing slash) pretty URLs.
        // If it has no extension (typical for our pages) and isn't root,
        // check whether dist/<path>/index.html exists. If so, rewrite the request internally
        // to serve that index.html content for the clean URL (browser bar stays clean).
        if (!cleanPath.includes('.') && cleanPath !== '/') {
          const distDir = path.join(__dirname, 'dist');
          const indexCandidate = path.join(distDir, cleanPath, 'index.html');

          if (fs.existsSync(indexCandidate)) {
            req.url = cleanPath + '/index.html' + q;
          }
        }

        next();
      }
    ]
  });

  return {
    dir: {
      input: 'src',
      output: 'dist',
      includes: '_includes',
    },
    templateFormats: ['njk', 'md', 'html', '11ty.js'],
    htmlTemplateEngine: 'njk',
    markdownTemplateEngine: 'njk',
  };
};
