/** @type {import('tailwindcss').Config} */
const { designTokens } = require('./src/styles/design-tokens.js');

module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class', // Enable dark mode support
  theme: {
    extend: {
      // 🎨 Colors - Custom color palette for dark theme
      colors: {
        // Primary colors
        'primary-green': designTokens.colors.primary.green,
        'primary-green-hover': designTokens.colors.primary.greenHover,
        'primary-green-pressed': designTokens.colors.primary.greenPressed,
        'primary-green-light': designTokens.colors.primary.greenLight,
        'primary-green-dark': designTokens.colors.primary.greenDark,
        
        // Secondary colors
        'secondary-lime': designTokens.colors.secondary.lime,
        'secondary-lime-hover': designTokens.colors.secondary.limeHover,
        'secondary-lime-pressed': designTokens.colors.secondary.limePressed,
        'secondary-lime-dark': designTokens.colors.secondary.limeDark,
        
        // Background colors
        'bg-primary': designTokens.colors.background.primary,
        'bg-secondary': designTokens.colors.background.secondary,
        'bg-tertiary': designTokens.colors.background.tertiary,
        'bg-modal': designTokens.colors.background.modal,
        'bg-card': designTokens.colors.background.card,
        'bg-overlay': designTokens.colors.background.overlay,
        'bg-splash': designTokens.colors.background.splash,
        
        // Text colors
        'text-primary': designTokens.colors.text.primary,
        'text-secondary': designTokens.colors.text.secondary,
        'text-tertiary': designTokens.colors.text.tertiary,
        'text-muted': designTokens.colors.text.muted,
        'text-disabled': designTokens.colors.text.disabled,
        'text-on-primary': designTokens.colors.text.onPrimary,
        
        // Status colors
        'status-error': designTokens.colors.status.error,
        'status-error-hover': designTokens.colors.status.errorHover,
        'status-warning': designTokens.colors.status.warning,
        'status-warning-hover': designTokens.colors.status.warningHover,
        'status-success': designTokens.colors.status.success,
        'status-success-hover': designTokens.colors.status.successHover,
        'status-info': designTokens.colors.status.info,
        'status-info-hover': designTokens.colors.status.infoHover,
        
        // Border colors
        'border-primary': designTokens.colors.border.primary,
        'border-secondary': designTokens.colors.border.secondary,
        'border-focus': designTokens.colors.border.focus,
        'border-error': designTokens.colors.border.error,
        'border-disabled': designTokens.colors.border.disabled,
        
        // Interactive states
        'interactive-hover': designTokens.colors.interactive.hover,
        'interactive-pressed': designTokens.colors.interactive.pressed,
        'interactive-focus': designTokens.colors.interactive.focus,
        'interactive-disabled': designTokens.colors.interactive.disabled,
        
        // Event category colors
        'category-festival': designTokens.categories.Festival.color,
        'category-networking': designTokens.categories.Networking.color,
        'category-hackathon': designTokens.categories.Hackathon.color,
        'category-seminar': designTokens.categories.Seminar.color,
        'category-concert': designTokens.categories.Concert.color,
        'category-workshop': designTokens.categories.Workshop.color,
        'category-meetup': designTokens.categories.Meetup.color,
        'category-conference': designTokens.categories.Conference.color,
        'category-exhibition': designTokens.categories.Exhibition.color,
      },

      // 🔠 Font Family - Roboto-inspired typography
      fontFamily: {
        'primary': designTokens.typography.fontFamily.primary,
        'fallback': designTokens.typography.fontFamily.fallback,
        'roboto': ['Roboto', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },

      // 📏 Font Sizes - Mobile-optimized sizes (pt converted to px)
      fontSize: {
        'app-title': [designTokens.typography.fontSize.appTitle, { lineHeight: designTokens.typography.lineHeight.appTitle }],
        'section-header': [designTokens.typography.fontSize.sectionHeader, { lineHeight: designTokens.typography.lineHeight.sectionHeader }],
        'body': [designTokens.typography.fontSize.body, { lineHeight: designTokens.typography.lineHeight.body }],
        'caption': [designTokens.typography.fontSize.caption, { lineHeight: designTokens.typography.lineHeight.caption }],
        'button': [designTokens.typography.fontSize.button, { lineHeight: designTokens.typography.lineHeight.button }],
        'small': [designTokens.typography.fontSize.small, { lineHeight: designTokens.typography.lineHeight.caption }],
        'large': [designTokens.typography.fontSize.large, { lineHeight: designTokens.typography.lineHeight.body }],
      },

      // 🔤 Font Weights
      fontWeight: {
        'regular': designTokens.typography.fontWeight.regular,
        'medium': designTokens.typography.fontWeight.medium,
        'bold': designTokens.typography.fontWeight.bold,
      },

      // 📐 Spacing - Mobile-optimized spacing system
      spacing: {
        'xs': designTokens.spacing.xs,
        'sm': designTokens.spacing.sm,
        'md': designTokens.spacing.md,
        'lg': designTokens.spacing.lg,
        'xl': designTokens.spacing.xl,
        'xxl': designTokens.spacing.xxl,
        'xxxl': designTokens.spacing.xxxl,
        
        // Layout specific
        'screen-padding': designTokens.spacing.screenPadding,
        'section-gap': designTokens.spacing.sectionGap,
        'card-padding': designTokens.spacing.cardPadding,
        'button-padding': designTokens.spacing.buttonPadding,
        'small-button-padding': designTokens.spacing.smallButtonPadding,
        
        // Component heights
        'bottom-nav-height': '89px',           // Increased from 69px for phone interface clearance
        'top-bar-height': designTokens.spacing.topBarHeight,
        'filter-bar-height': designTokens.spacing.filterBarHeight,
        
        // Button specific heights
        'button-height': designTokens.components.button.primary.height,
        'button-small-height': designTokens.components.button.small.height,
        'input-height': designTokens.components.input.height,
      },

      // 🔲 Border Radius - Consistent corner radii
      borderRadius: {
        'none': designTokens.borderRadius.none,
        'sm': designTokens.borderRadius.sm,
        'md': designTokens.borderRadius.md,
        'lg': designTokens.borderRadius.lg,
        'xl': designTokens.borderRadius.xl,
        'full': designTokens.borderRadius.full,
        
        // Component specific
        'button': designTokens.borderRadius.button,
        'card': designTokens.borderRadius.card,
        'modal': designTokens.borderRadius.modal,
        'input': designTokens.borderRadius.input,
      },

      // 🎭 Box Shadow - Enhanced for dark theme
      boxShadow: {
        'sm': designTokens.shadows.sm,
        'md': designTokens.shadows.md,
        'lg': designTokens.shadows.lg,
        'xl': designTokens.shadows.xl,
        'card': designTokens.shadows.card,
        'modal': designTokens.shadows.modal,
        'button': designTokens.shadows.button,
        'none': designTokens.shadows.none,
      },

      // 🎬 Animation & Transitions
      transitionDuration: {
        'fast': designTokens.animation.duration.fast,
        'normal': designTokens.animation.duration.normal,
        'slow': designTokens.animation.duration.slow,
        'modal': designTokens.animation.duration.modal,
      },

      transitionTimingFunction: {
        'ease-out': designTokens.animation.easing.easeOut,
        'ease-in': designTokens.animation.easing.easeIn,
        'ease-in-out': designTokens.animation.easing.easeInOut,
        'bounce': designTokens.animation.easing.bounce,
      },

      // 📱 Transform scales for button interactions
      scale: {
        'down': designTokens.animation.scale.down,
        'up': designTokens.animation.scale.up,
        'normal': designTokens.animation.scale.normal,
      },

      // 🔢 Z-index layering
      zIndex: {
        'dropdown': '1000',
        'sticky': '1020',
        'fixed': '1030',
        'modal-backdrop': '1040',
        'modal': '1050',
        'popover': '1060',
        'tooltip': '1070',
        'toast': '1080',
      },

      // 📏 Line Heights
      lineHeight: {
        'tight': designTokens.typography.lineHeight.tight,
        'normal': designTokens.typography.lineHeight.normal,
        'relaxed': designTokens.typography.lineHeight.relaxed,
      },

      // 📐 Letter Spacing
      letterSpacing: {
        'tight': designTokens.typography.letterSpacing.tight,
        'normal': designTokens.typography.letterSpacing.normal,
        'wide': designTokens.typography.letterSpacing.wide,
      },

      // 📱 Screen breakpoints (mobile-first)
      screens: {
        'mobile': designTokens.grid.breakpoints.mobile,
        'tablet': designTokens.grid.breakpoints.tablet,
        'desktop': designTokens.grid.breakpoints.desktop,
      },

      // 🖼️ Aspect ratios for event images
      aspectRatio: {
        'event-banner': '3 / 2',    // 1200x800 event banners (increased height)
        'event-thumb': '1 / 1',     // 400x400 thumbnails
        'card': '4 / 3',            // Standard card ratio
      },
    },
  },
  plugins: [
    // Custom component classes
    function({ addComponents, theme }) {
      addComponents({
        // 🔘 Button Components
        '.btn-primary': {
          height: theme('spacing.button-height'),
          padding: `0 ${theme('spacing.button-padding')}`,
          borderRadius: theme('borderRadius.button'),
          fontSize: theme('fontSize.button[0]'),
          lineHeight: theme('fontSize.button[1].lineHeight'),
          fontWeight: theme('fontWeight.medium'),
          backgroundColor: theme('colors.primary-green'),
          color: theme('colors.text-on-primary'),
          border: 'none',
          minWidth: '160px',
          transition: `all ${theme('transitionDuration.normal')} ${theme('transitionTimingFunction.ease-out')}`,
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          '&:hover': {
            backgroundColor: theme('colors.primary-green-hover'),
          },
          '&:active': {
            backgroundColor: theme('colors.primary-green-pressed'),
            transform: `scale(${theme('scale.down')})`,
          },
          '&:disabled': {
            backgroundColor: theme('colors.interactive-disabled'),
            cursor: 'not-allowed',
          },
        },

        '.btn-secondary': {
          height: theme('spacing.button-height'),
          padding: `0 ${theme('spacing.button-padding')}`,
          borderRadius: theme('borderRadius.button'),
          fontSize: theme('fontSize.button[0]'),
          lineHeight: theme('fontSize.button[1].lineHeight'),
          fontWeight: theme('fontWeight.medium'),
          backgroundColor: 'transparent',
          color: theme('colors.primary-green'),
          border: `1px solid ${theme('colors.primary-green')}`,
          minWidth: '160px',
          transition: `all ${theme('transitionDuration.normal')} ${theme('transitionTimingFunction.ease-out')}`,
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          '&:hover': {
            backgroundColor: theme('colors.interactive-hover'),
          },
          '&:active': {
            backgroundColor: theme('colors.interactive-pressed'),
            transform: `scale(${theme('scale.down')})`,
          },
        },

        '.btn-small': {
          height: theme('spacing.button-small-height'),
          padding: `0 ${theme('spacing.small-button-padding')}`,
          borderRadius: theme('borderRadius.button'),
          fontSize: theme('fontSize.caption[0]'),
          lineHeight: theme('fontSize.caption[1].lineHeight'),
          fontWeight: theme('fontWeight.medium'),
          backgroundColor: theme('colors.secondary-lime'),
          color: theme('colors.text-on-primary'),
          border: 'none',
          minWidth: '107px',
          transition: `all ${theme('transitionDuration.normal')} ${theme('transitionTimingFunction.ease-out')}`,
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          '&:hover': {
            backgroundColor: theme('colors.secondary-lime-hover'),
          },
          '&:active': {
            backgroundColor: theme('colors.secondary-lime-pressed'),
            transform: `scale(${theme('scale.down')})`,
          },
        },

        // 📱 Input Components
        '.input-primary': {
          height: theme('spacing.input-height'),
          padding: `0 ${theme('spacing.button-padding')}`,
          borderRadius: theme('borderRadius.input'),
          fontSize: theme('fontSize.button[0]'),
          backgroundColor: theme('colors.bg-tertiary'),
          border: `1px solid ${theme('colors.border-primary')}`,
          color: theme('colors.text-primary'),
          transition: `all ${theme('transitionDuration.normal')} ${theme('transitionTimingFunction.ease-out')}`,
          '&::placeholder': {
            color: theme('colors.text-secondary'),
          },
          '&:focus': {
            outline: 'none',
            borderColor: theme('colors.border-focus'),
            boxShadow: `0 0 0 2px ${theme('colors.interactive-focus')}`,
          },
        },

        // 🃏 Card Components
        '.card-primary': {
          padding: theme('spacing.card-padding'),
          borderRadius: theme('borderRadius.card'),
          backgroundColor: theme('colors.bg-card'),
          border: `1px solid ${theme('colors.border-primary')}`,
          boxShadow: theme('boxShadow.card'),
          transition: `all ${theme('transitionDuration.normal')} ${theme('transitionTimingFunction.ease-out')}`,
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: theme('boxShadow.lg'),
          },
        },

        // 🧭 Navigation Components
        '.nav-bottom': {
          height: theme('spacing.bottom-nav-height'),
          backgroundColor: theme('colors.bg-secondary'),
          borderTop: `1px solid ${theme('colors.border-primary')}`,
          paddingTop: theme('spacing.sm'),
          paddingBottom: theme('spacing.xl'),     // Increased from sm to xl for phone interface clearance
          paddingLeft: theme('spacing.screen-padding'),
          paddingRight: theme('spacing.screen-padding'),
        },

        '.nav-top': {
          height: theme('spacing.top-bar-height'),
          backgroundColor: theme('colors.bg-primary'),
          borderBottom: `1px solid ${theme('colors.border-primary')}`,
          padding: `0 ${theme('spacing.screen-padding')}`,
        },

        '.filter-bar': {
          height: theme('spacing.filter-bar-height'),
          backgroundColor: theme('colors.bg-secondary'),
          borderBottom: `1px solid ${theme('colors.border-primary')}`,
          padding: `0 ${theme('spacing.screen-padding')}`,
        },

        // 📱 Layout Utilities
        '.screen-container': {
          backgroundColor: theme('colors.bg-primary'),
          minHeight: '100vh',
        },

        '.section-gap': {
          marginBottom: theme('spacing.section-gap'),
        },

        // 🎯 WorldID Specific
        '.worldid-button': {
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: theme('spacing.md'),
          '& .worldid-icon': {
            width: theme('spacing.xxxl'),
            height: theme('spacing.xxxl'),
          },
        },
      });
    },
    
    // Custom utilities
    function({ addUtilities, theme }) {
      addUtilities({
        // Animation utilities
        '.animate-button-press': {
          transform: `scale(${theme('scale.down')})`,
          transition: `transform ${theme('transitionDuration.fast')} ${theme('transitionTimingFunction.ease-out')}`,
        },
        
        '.animate-modal-enter': {
          animation: 'modal-enter 400ms cubic-bezier(0, 0, 0.2, 1)',
        },
        
        '.animate-modal-exit': {
          animation: 'modal-exit 300ms cubic-bezier(0.4, 0, 1, 1)',
        },
        
        // Category color utilities
        '.category-festival': { color: theme('colors.category-festival') },
        '.category-networking': { color: theme('colors.category-networking') },
        '.category-hackathon': { color: theme('colors.category-hackathon') },
        '.category-seminar': { color: theme('colors.category-seminar') },
        '.category-concert': { color: theme('colors.category-concert') },
        '.category-workshop': { color: theme('colors.category-workshop') },
        '.category-meetup': { color: theme('colors.category-meetup') },
        '.category-conference': { color: theme('colors.category-conference') },
        '.category-exhibition': { color: theme('colors.category-exhibition') },
      });
    },
  ],
}; 