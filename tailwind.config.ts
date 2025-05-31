import type { Config } from 'tailwindcss';
import { tokens } from './src/styles/tokens';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: tokens.colors.primary,
        background: tokens.colors.background,
        text: tokens.colors.text,
        border: tokens.colors.border,
        status: tokens.colors.status,
      },
      fontFamily: {
        display: tokens.typography.fontFamily.display,
        body: tokens.typography.fontFamily.body,
      },
      fontSize: {
        'display-lg': tokens.typography.fontSize['display-lg'],
        'display-md': tokens.typography.fontSize['display-md'],
        'display-sm': tokens.typography.fontSize['display-sm'],
        'body-lg': tokens.typography.fontSize['body-lg'],
        'body-md': tokens.typography.fontSize['body-md'],
        'body-sm': tokens.typography.fontSize['body-sm'],
        'caption': tokens.typography.fontSize.caption,
      },
      borderRadius: tokens.radii,
      spacing: tokens.spacing,
      boxShadow: tokens.shadows,
      animation: {
        'scale-down': 'scale-down 0.15s ease-out forwards',
        'slide-up': 'slide-up 0.2s ease-out forwards',
        'fade-in': 'fade-in 0.2s ease-out forwards',
      },
      keyframes: {
        'scale-down': {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(0.98)' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};

export default config; 