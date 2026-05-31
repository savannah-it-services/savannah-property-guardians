const fs = require('fs');
const path = require('path');

module.exports = function (eleventyConfig) {
  // Copy static assets
  eleventyConfig.addPassthroughCopy('src/assets');
  eleventyConfig.addPassthroughCopy('src/images');
  // robots.txt is now handled as a template in src/robots.txt

  // Sitemap is now generated via src/sitemap.11ty.js (with proper file modification dates)

  return {
    dir: {
      input: 'src',
      output: 'dist',
      includes: '_includes',
    },
    templateFormats: ['njk', 'md', 'html'],
    htmlTemplateEngine: 'njk',
    markdownTemplateEngine: 'njk',
  };
};
