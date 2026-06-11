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

  // No cleanUrl filter: we now embrace trailing slashes everywhere to match GitHub Pages
  // default behavior for directory-style permalinks (dir/index.html). All generated links,
  // canonicals, sitemaps, and schema now use the slashed form that page.url provides.

  // Configure the dev server (BrowserSync) to use trailing-slash URLs, matching production
  // (GitHub Pages forces /dir/ for any directory containing index.html).
  //
  // Strategy:
  // - Permalinks for pages end with / so Eleventy outputs dir/index.html and page.url includes the trailing slash.
  // - All links, canonicals, sitemap, schema etc. emit the slashed form directly via page.url | url.
  // - This middleware:
  //   1. 301s any incoming non-slashed pretty URL (no trailing /, no extension) to the slashed version.
  //      This makes local dev match production and ensures bookmarks/external links converge on the canonical slashed URLs.
  //   2. For slashed directory-style paths, if a matching dist/.../index.html exists, we internally
  //      rewrite the request so the static server delivers the content while the browser URL bar keeps the trailing slash.
  // - serveStaticOptions.redirect: false prevents BrowserSync from adding its own slash behavior on top of ours.
  eleventyConfig.setServerOptions({
    serveStaticOptions: {
      redirect: false
    },
    middleware: [
      function (req, res, next) {
        // Split path and query so we can manipulate the path cleanly
        const [pathname, queryPart] = req.url.split('?');
        const q = queryPart ? '?' + queryPart : '';

        // Enforce trailing slash for pretty (extensionless, non-root) paths.
        // If no trailing slash and it looks like a page path, 301 to the slashed form.
        const needsSlash = pathname.length > 1 &&
                           !pathname.endsWith('/') &&
                           !pathname.includes('.');

        if (needsSlash) {
          const slashed = pathname + '/' + q;
          res.writeHead(301, { Location: slashed });
          return res.end();
        }

        // For slashed pretty paths (e.g. /handyman-services/foo/), internally rewrite
        // to serve the index.html so the static file server delivers content while
        // the visible URL retains the trailing slash.
        if (pathname.length > 1 && pathname.endsWith('/') && !pathname.includes('.')) {
          const distDir = path.join(__dirname, 'dist');
          // Remove trailing slash for the directory part when building the candidate path
          const dirPart = pathname.replace(/\/$/, '');
          const indexCandidate = path.join(distDir, dirPart, 'index.html');

          if (fs.existsSync(indexCandidate)) {
            req.url = pathname + 'index.html' + q;
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
