/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        brand: {
          orange: '#C8742A',
          'orange-light': '#D4894A',
          gold: '#C9A500',
          'light-green': '#B8C99D',
          sand: '#E7D8C9',
          'off-white': '#FAF8F3',
          'dark-olive': '#4B4A3F',
          'olive-mid': '#7A7869',
          'olive-dark': '#2A2923',
        },
      },
    },
  },
  plugins: [],
};