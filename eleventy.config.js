const fs = require('fs');
const path = require('path');

module.exports = function (eleventyConfig) {
  // Copy static assets
  eleventyConfig.addPassthroughCopy('src/assets');
  eleventyConfig.addPassthroughCopy('src/images');
  // Copy favicon assets to output root (for /favicon-*.png etc.)
  eleventyConfig.addPassthroughCopy({ 'src/apple-touch-icon.png': '.' });
  eleventyConfig.addPassthroughCopy({ 'src/favicon-*.png': '.' });
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
