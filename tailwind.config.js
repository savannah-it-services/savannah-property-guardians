/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{njk,html,js}',
  ],
  // Custom theme is defined in src/assets/css/input.css using @theme for Tailwind v4
  theme: {
    extend: {},
  },
  plugins: [],
}