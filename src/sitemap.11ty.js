const fs = require('fs');
const { execSync } = require('child_process');

module.exports = {
  data: {
    permalink: '/sitemap.xml',
    eleventyExcludeFromCollections: true,
  },

  render(data) {
    const siteUrl = data.site.url.replace(/\/$/, '');

    // Filter pages we want in the sitemap
    const pages = data.collections.all.filter((page) => {
      return page.url &&
        !page.data.eleventyExcludeFromCollections &&
        !page.url.match(/404(\.html)?\/?$/) &&
        !page.url.endsWith('/sitemap.xml') &&
        !page.url.endsWith('/robots.txt');
    });

    let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
    sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    // Git-based lastmod helper (moved outside loop for efficiency)
    function getGitLastmod(filePath) {
      try {
        const out = execSync(`git log -1 --format=%cd --date=short -- "${filePath}" 2>/dev/null`, {
          encoding: 'utf8',
          stdio: ['pipe', 'pipe', 'ignore']
        }).trim();
        if (out) return out;
      } catch (e) {}
      try {
        const stats = fs.statSync(filePath);
        return stats.mtime.toISOString().split('T')[0];
      } catch (e) {}
      return new Date().toISOString().split('T')[0];
    }

    pages.forEach((page) => {
      // Use page.url directly. With trailing-slash permalinks, these are now the canonical
      // slashed forms (e.g. /handyman/, /warehouse-services/exterior-warehouse-maintenance/)
      // that GitHub Pages serves natively (and redirects the non-slashed variant toward).
      let pagePath = page.url
        .replace(/\.html$/, '');
      if (!pagePath || pagePath === '') pagePath = '/';
      const fullUrl = `${siteUrl}${pagePath}`;

      // Get last modified date using git history (preferred for SEO sitemaps as it reflects actual content commits,
      // not build-time filesystem mtimes which can be reset on checkout/clone).
      // Falls back to fs mtime then current date.
      let lastmod = getGitLastmod(page.inputPath);

      // For data-driven service pages, also consider the last git date of the associated data file
      // (where the real FAQ/offers/content lives) and use the most recent.
      const inputPath = page.inputPath || '';
      let dataCandidates = [];
      if (inputPath.includes('handyman-services/')) {
        const base = inputPath.split('/').pop().replace('.njk', '');
        const camel = base.replace(/-([a-z])/g, (m, c) => c.toUpperCase());
        dataCandidates.push(`src/_data/handyman/${camel}.js`);
      } else if (inputPath.includes('plumbing-services/')) {
        const base = inputPath.split('/').pop().replace('.njk', '');
        const camel = base.replace(/-([a-z])/g, (m, c) => c.toUpperCase());
        dataCandidates.push(`src/_data/plumbing/${camel}.js`);
      } else if (inputPath.includes('property-maintenance-services/')) {
        const base = inputPath.split('/').pop().replace('.njk', '');
        const camel = base.replace(/-([a-z])/g, (m, c) => c.toUpperCase());
        dataCandidates.push(`src/_data/propertyMaintenance/${camel}.js`);
      } else if (inputPath.includes('warehouse-services/')) {
        const base = inputPath.split('/').pop().replace('.njk', '');
        const camel = base.replace(/-([a-z])/g, (m, c) => c.toUpperCase());
        dataCandidates.push(`src/_data/warehouse/${camel}.js`);
      }

      dataCandidates.forEach((dp) => {
        if (fs.existsSync(dp)) {
          const dDate = getGitLastmod(dp);
          if (dDate > lastmod) lastmod = dDate;
        }
      });

      // Basic priority for local SEO focus: homepage and main category pages highest
      let priority = '0.6';
      if (pagePath === '/') priority = '1.0';
      else if (['/handyman/', '/plumbing/', '/property-maintenance/', '/warehouse/', '/about/', '/contact/'].includes(pagePath)) priority = '0.8';

      sitemap += '  <url>\n';
      sitemap += `    <loc>${fullUrl}</loc>\n`;
      sitemap += `    <lastmod>${lastmod}</lastmod>\n`;
      // Differentiated changefreq for better crawl signals
      let changefreq = 'monthly';
      if (pagePath === '/') changefreq = 'weekly';
      else if (['/handyman/', '/plumbing/', '/property-maintenance/', '/warehouse/', '/about/', '/contact/'].includes(pagePath)) changefreq = 'weekly';
      sitemap += `    <changefreq>${changefreq}</changefreq>\n`;
      sitemap += `    <priority>${priority}</priority>\n`;
      sitemap += '  </url>\n';
    });

    sitemap += '</urlset>';

    return sitemap;
  },
};
