/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.html",
    "./blog-posts/**/*.html",
    "./layouts/**/*.html",
    "./_layouts/**/*.html",
    "./js/**/*.js"
  ],
  darkMode: 'class', // Using class strategy with [data-theme="dark"]
  theme: {
    extend: {
      colors: {
        // Glacier-themed color palette
        iceberg: {
          DEFAULT: '#87CEEB',
          light: '#B0E0F6',
          dark: '#6EB8D9'
        },
        sea: {
          DEFAULT: '#006994',
          light: '#4DA8CF',
          dark: '#004D6B'
        },
        navy: {
          DEFAULT: '#1e3a8a',
          light: '#3b5bbd',
          dark: '#0f2557'
        },
        ocean: {
          DEFAULT: '#0369a1',
          light: '#0ea5e9',
          dark: '#075985'
        },
        frost: '#dbeafe',
        arctic: '#bfdbfe',
        polar: '#3b82f6',
        glacier: '#60a5fa',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        serif: ['Crimson Text', 'Georgia', 'serif'],
        mono: ['Space Grotesk', 'Courier New', 'monospace'],
        // Legacy support
        inter: ['Inter', 'sans-serif'],
        crimson: ['Crimson Text', 'serif'],
        space: ['Space Grotesk', 'monospace'],
        montserrat: ['Inter', 'sans-serif'], // Redirected to Inter
        playfair: ['Crimson Text', 'serif'], // Redirected to Crimson Text
      },
      fontSize: {
        // Fluid typography
        'xs': 'clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem)',
        'sm': 'clamp(0.875rem, 0.8rem + 0.375vw, 1rem)',
        'base': 'clamp(1rem, 0.95rem + 0.25vw, 1.125rem)',
        'lg': 'clamp(1.125rem, 1rem + 0.625vw, 1.25rem)',
        'xl': 'clamp(1.25rem, 1.1rem + 0.75vw, 1.5rem)',
        '2xl': 'clamp(1.5rem, 1.3rem + 1vw, 1.875rem)',
        '3xl': 'clamp(1.875rem, 1.6rem + 1.375vw, 2.25rem)',
        '4xl': 'clamp(2.25rem, 1.9rem + 1.75vw, 3rem)',
        '5xl': 'clamp(3rem, 2.5rem + 2.5vw, 3.75rem)',
        '6xl': 'clamp(3.75rem, 3rem + 3.75vw, 4.5rem)',
        '7xl': 'clamp(4.5rem, 3.5rem + 5vw, 6rem)',
      },
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '3rem',
      },
      boxShadow: {
        'glacier': '0 8px 32px rgba(0, 105, 148, 0.1)',
        'glacier-lg': '0 15px 35px rgba(0, 105, 148, 0.2)',
        'glacier-xl': '0 20px 40px rgba(0, 105, 148, 0.3)',
        'dark': '0 8px 32px rgba(0, 0, 0, 0.3)',
        'dark-lg': '0 15px 35px rgba(0, 0, 0, 0.5)',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'fade-in': 'fadeIn 1s ease-out',
        'float-slow': 'float 6s ease-in-out infinite',
        'float-medium': 'float 4s ease-in-out infinite',
        'float-fast': 'float 3s ease-in-out infinite',
        'slide-in-left': 'slideInLeft 0.5s ease-out',
        'slide-in-right': 'slideInRight 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-50px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(50px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-glacier': 'linear-gradient(135deg, #006994 0%, #0ea5e9 100%)',
        'gradient-ocean': 'linear-gradient(135deg, #0369a1 0%, #87CEEB 100%)',
        'gradient-arctic': 'linear-gradient(135deg, #3b82f6 0%, #bfdbfe 100%)',
      },
      transitionTimingFunction: {
        'bounce-in': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
}
