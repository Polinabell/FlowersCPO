export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          100: '#f4e4f4',
          200: '#e9c9e9',
          300: '#deafdf',
          400: '#d394d4',
          500: '#c879c9',
          600: '#a061a1',
          700: '#784979',
          800: '#503050',
          900: '#281828',
        },
        secondary: {
          100: '#e6f5ea',
          200: '#ceebd5',
          300: '#b5e1c0',
          400: '#9dd7ab',
          500: '#84cd96',
          600: '#6aa478',
          700: '#4f7b5a',
          800: '#35523c',
          900: '#1a291e',
        },
      },
      fontFamily: {
        sans: ['Nunito', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
    },
  },
  plugins: [],
} 