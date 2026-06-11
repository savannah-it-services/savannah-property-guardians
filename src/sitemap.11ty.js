const fs = require('fs');

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

    pages.forEach((page) => {
      // Use page.url directly. With trailing-slash permalinks, these are now the canonical
      // slashed forms (e.g. /handyman/, /warehouse-services/exterior-warehouse-maintenance/)
      // that GitHub Pages serves natively (and redirects the non-slashed variant toward).
      let pagePath = page.url
        .replace(/\.html$/, '');
      if (!pagePath || pagePath === '') pagePath = '/';
      const fullUrl = `${siteUrl}${pagePath}`;

      // Get last modified date from the source file
      let lastmod = new Date().toISOString().split('T')[0]; // fallback
      try {
        const stats = fs.statSync(page.inputPath);
        lastmod = stats.mtime.toISOString().split('T')[0];
      } catch (e) {
        // If we can't read the file, use today's date
      }

      // Basic priority for local SEO focus: homepage and main category pages highest
      let priority = '0.6';
      if (pagePath === '/') priority = '1.0';
      else if (['/handyman/', '/plumbing/', '/property-maintenance/', '/warehouse/', '/about/', '/contact/'].includes(pagePath)) priority = '0.8';

      sitemap += '  <url>\n';
      sitemap += `    <loc>${fullUrl}</loc>\n`;
      sitemap += `    <lastmod>${lastmod}</lastmod>\n`;
      sitemap += `    <changefreq>weekly</changefreq>\n`;
      sitemap += `    <priority>${priority}</priority>\n`;
      sitemap += '  </url>\n';
    });

    sitemap += '</urlset>';

    return sitemap;
  },
};
