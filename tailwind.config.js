/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        gray: {
          100: '#e1e1e6',
          300: '#a8a8b3',
          700: '#323238',
          800: '#29292e',
          850: '#1f2729',
          900: '#121214',
        },
        cyan: {
          500: '#61dafb',
        },
        yellow: {
          500: '#eba417',
        },
      },
    },
  },
  plugins: [],
};
