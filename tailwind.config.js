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
  safelist: [
    // Homepage hero arbitrary values to ensure they are always included
    'text-[52px]',
    'sm:text-[64px]',
    'leading-[1.05]',
    'tracking-[-2.4px]',
    'min-h-[100dvh]',
  ],
}