/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#ecfdf5',
          500: '#10b981',
          600: '#059669',
          900: '#064e3b',
          950: '#022c22',
        },
      },
    },
  },
  plugins: [],
};
