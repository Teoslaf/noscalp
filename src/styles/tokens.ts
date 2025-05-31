export const tokens = {
  colors: {
    primary: {
      DEFAULT: '#10B981',
      hover: '#0F9F74',
      light: '#A7F3D0',
      lighter: '#ECFDF5',
    },
    background: {
      DEFAULT: '#0B0F0E',
      light: '#1A1F1E',
      lighter: '#2A2F2E',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#F3F4F6',
      tertiary: '#9CA3AF',
    },
    border: {
      DEFAULT: '#374151',
      light: '#4B5563',
    },
    status: {
      error: '#EF4444',
      warning: '#FBBF24',
      success: '#34D399',
    },
    overlay: {
      dark: 'rgba(0, 0, 0, 0.8)',
      light: 'rgba(255, 255, 255, 0.1)',
    },
  },

  typography: {
    fontFamily: {
      display: 'var(--font-geist-sans)',
      body: 'var(--font-geist-sans)',
    },
    fontSize: {
      'display-lg': '32px',
      'display-md': '24px',
      'display-sm': '20px',
      'body-lg': '18px',
      'body-md': '16px',
      'body-sm': '14px',
      'caption': '12px',
    },
    fontWeight: {
      regular: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
    lineHeight: {
      tight: '1.2',
      base: '1.4',
      relaxed: '1.6',
    },
  },

  spacing: {
    0: '0',
    1: '4px',
    2: '8px',
    3: '12px',
    4: '16px',
    5: '20px',
    6: '24px',
    8: '32px',
    10: '40px',
    12: '48px',
    16: '64px',
  },

  radii: {
    none: '0',
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    '2xl': '20px',
    '3xl': '24px',
    full: '9999px',
  },

  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
    primary: '0 8px 16px rgba(16, 185, 129, 0.2)',
  },

  animation: {
    durations: {
      fast: '150ms',
      normal: '200ms',
      slow: '300ms',
    },
    timingFunctions: {
      easeOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      spring: 'cubic-bezier(0.155, 1.105, 0.295, 1.12)',
    },
  },

  breakpoints: {
    mobile: '400px',
  },
} as const; 