/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        sea: { 50: '#E0F7FA', 100: '#B2EBF2', 400: '#26C6DA', 600: '#0E7490', 800: '#164E63', 900: '#0B3040' },
        sand: { 50: '#FFF8E7', 200: '#FDE9B0', 400: '#F6C453' },
        coral: { 400: '#FF7A59', 600: '#E0502F' },
        leaf: { 400: '#4CC38A', 600: '#1F9D63', 700: '#17814F' },
      },
      fontFamily: { display: ['ui-rounded', '"Nunito"', '"Comic Sans MS"', 'system-ui', 'sans-serif'] },
      boxShadow: { chunky: '0 6px 0 rgba(11,48,64,0.35)' },
    },
  },
};
