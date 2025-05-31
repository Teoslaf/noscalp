/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)'],
      },
      colors: {
        background: {
          DEFAULT: '#0B0F0E',
          light: '#1A1F1E',
        },
        primary: {
          DEFAULT: '#10B981',
          hover: '#059669',
          light: '#A7F3D0',
        },
        text: {
          primary: '#F3F4F6',
          secondary: '#9CA3AF',
        },
        status: {
          warning: '#FBBF24',
          error: '#EF4444',
          success: '#34D399',
        },
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}; 