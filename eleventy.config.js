require('dotenv').config();

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
