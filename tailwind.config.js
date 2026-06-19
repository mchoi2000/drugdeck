/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        serif: ['Fraunces', 'serif'],
      },
      colors: {
        eleo: {
          ink: '#1A2332',
          muted: '#6B7B8D',
          soft: '#F7F9FC',
          card: '#FFFFFF',
          line: 'rgba(0,0,0,0.08)',
          green: '#0F9B72',
          sage: 'rgba(15,155,114,0.08)'
        }
      },
      boxShadow: {
        soft: '0 4px 20px rgba(0,0,0,0.06)'
      }
    },
  },
  plugins: [],
}
