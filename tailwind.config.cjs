/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./index.html', './assets/**/*.js'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          'PingFang SC',
          'Microsoft YaHei',
          'Segoe UI',
          'Roboto',
          'Helvetica',
          'Arial',
          'sans-serif'
        ],
        display: ['Space Grotesk', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif']
      },
      colors: {
        ace: {
          emerald: '#06eca3',
          blue: '#2aa9ff'
        }
      },
      boxShadow: {
        glass: '0 20px 60px rgba(2, 6, 23, 0.55)',
        ring: '0 0 0 1px rgba(148, 163, 184, 0.12) inset'
      }
    }
  },
  plugins: []
};

