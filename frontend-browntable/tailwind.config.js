/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Coffee-inspired brown palette
        coffee: {
          50: '#fdf8f6',
          100: '#f2e8e5',
          200: '#eaddd7',
          300: '#e0cec7',
          400: '#d2bab0',
          500: '#bfa094',
          600: '#a18072',
          700: '#8b6f47',
          800: '#6f4e37',
          900: '#4a2c2a',
          950: '#2d1b1b',
        },
        // Primary brown (matching the reference design)
        primary: {
          50: '#fdf8f6',
          100: '#f2e8e5',
          200: '#eaddd7',
          300: '#d4a574',
          400: '#c49461',
          500: '#a67c52',
          600: '#8b6f47',
          700: '#6f4e37',
          800: '#5d4037',
          900: '#3e2723',
          950: '#2d1b1b',
        },
        // Accent colors
        cream: '#f5f5dc',
        latte: '#d2b48c',
        espresso: '#3c2414',
        mocha: '#4a2c2a',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Georgia', 'serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      boxShadow: {
        'warm': '0 4px 14px 0 rgba(74, 44, 42, 0.15)',
        'warm-lg': '0 10px 25px -3px rgba(74, 44, 42, 0.2), 0 4px 6px -2px rgba(74, 44, 42, 0.1)',
        'coffee': '0 8px 32px rgba(74, 44, 42, 0.12)',
      },
      backgroundImage: {
        'coffee-gradient': 'linear-gradient(135deg, #6f4e37 0%, #8b6f47 100%)',
        'warm-gradient': 'linear-gradient(135deg, #a67c52 0%, #d4a574 100%)',
        'hero-pattern': "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%236f4e37\" fill-opacity=\"0.05\"%3E%3Ccircle cx=\"30\" cy=\"30\" r=\"2\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')",
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
};
