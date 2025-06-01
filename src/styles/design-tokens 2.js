// Design Tokens for Mobile Event Discovery App
// Dark-themed design with WorldID integration
// Based on events_prototype_no_imgs.json data structure

export const designTokens = {
  // 🎨 Color System
  colors: {
    // Primary Colors
    primary: {
      green: '#10B981',
      greenHover: '#059669',
      greenPressed: '#0F9F74',
      greenLight: '#34D399',
      greenDark: '#047857',
    },
    
    // Secondary Colors
    secondary: {
      lime: '#A7F3D0',
      limeHover: '#86EFAC',
      limePressed: '#6EE7B7',
      limeDark: '#6EE7B7',
    },
    
    // Background Colors
    background: {
      primary: '#0B0F0E',     // Main app background
      secondary: '#111827',    // Card backgrounds
      tertiary: '#1F2937',     // Input backgrounds
      modal: '#1F2937',        // Modal backgrounds
      card: '#111827',         // Event card backgrounds
      overlay: 'rgba(0, 0, 0, 0.8)',
      splash: '#000000',       // Splash screen
    },
    
    // Text Colors
    text: {
      primary: '#FFFFFF',      // Main text
      secondary: '#F3F4F6',    // Secondary text, placeholders
      tertiary: '#D1D5DB',     // Muted text
      muted: '#9CA3AF',        // Very muted text
      disabled: '#6B7280',     // Disabled state
      onPrimary: '#0B0F0E',    // Text on green buttons
    },
    
    // Status Colors
    status: {
      error: '#EF4444',        // Error states
      errorHover: '#DC2626',
      warning: '#FBBF24',      // Warnings, alerts
      warningHover: '#F59E0B',
      success: '#10B981',      // Success states
      successHover: '#059669',
      info: '#3B82F6',
      infoHover: '#2563EB',
    },
    
    // Border Colors
    border: {
      primary: '#374151',      // Main borders, input lines
      secondary: '#4B5563',
      focus: '#10B981',        // Focus states
      error: '#EF4444',
      disabled: '#374151',
    },
    
    // Interactive States
    interactive: {
      hover: 'rgba(16, 185, 129, 0.1)',
      pressed: 'rgba(16, 185, 129, 0.2)',
      focus: 'rgba(16, 185, 129, 0.3)',
      disabled: 'rgba(107, 114, 128, 0.5)',
    },
  },

  // 🔠 Typography System (Roboto-Inspired)
  typography: {
    // Font Families
    fontFamily: {
      primary: ['Roboto', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      fallback: ['-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
    },
    
    // Font Sizes (pt converted to px: pt * 1.33)
    fontSize: {
      appTitle: '32px',        // 24pt -> 32px (App Title)
      sectionHeader: '27px',   // 20pt -> 27px (Section Headers)
      body: '21px',           // 16pt -> 21px (Body Text)
      caption: '19px',        // 14pt -> 19px (Caption/Hint Text)
      button: '21px',         // 16pt -> 21px (Button Text)
      small: '16px',          // 12pt -> 16px (Small text)
      large: '24px',          // 18pt -> 24px (Large text)
    },
    
    // Font Weights
    fontWeight: {
      regular: '400',         // Body text
      medium: '500',          // Section headers, buttons
      bold: '700',            // App title
    },
    
    // Line Heights (1.4x as specified)
    lineHeight: {
      appTitle: '1.4',        // 32px * 1.4 = 45px
      sectionHeader: '1.4',   // 27px * 1.4 = 38px
      body: '1.4',           // 21px * 1.4 = 29px
      caption: '1.4',        // 19px * 1.4 = 27px
      button: '1.4',         // 21px * 1.4 = 29px
      tight: '1.2',
      normal: '1.4',
      relaxed: '1.6',
    },
    
    // Letter Spacing
    letterSpacing: {
      tight: '-0.025em',
      normal: '0',
      wide: '0.025em',
    },
  },

  // 📐 Spacing System (20pt screen padding converted to px)
  spacing: {
    // Base spacing units (pt * 1.33 = px)
    xs: '5px',              // 4pt
    sm: '11px',             // 8pt
    md: '16px',             // 12pt
    lg: '21px',             // 16pt (section gaps)
    xl: '27px',             // 20pt
    xxl: '32px',            // 24pt
    xxxl: '43px',           // 32pt
    
    // Layout Specific (converted from pt)
    screenPadding: '12px',   // 12px minimum screen padding for edge safety
    sectionGap: '21px',      // 16pt section gaps
    cardPadding: '21px',     // 16pt
    buttonPadding: '21px',   // 16pt horizontal padding
    smallButtonPadding: '16px', // 12pt horizontal padding
    
    // Component Heights (pt * 1.33 = px)
    bottomNavHeight: '69px', // 52pt
    topBarHeight: '69px',    // 52pt
    filterBarHeight: '53px', // 40pt
  },

  // 🔲 Border Radius System (pt converted to px)
  borderRadius: {
    none: '0px',
    sm: '4px',              // 3pt (reduced from 6pt)
    md: '8px',              // 6pt (reduced from 12pt) 
    lg: '12px',             // 9pt (reduced from 16pt)
    xl: '16px',             // 12pt (reduced from 20pt)
    full: '9999px',
    
    // Component Specific
    button: '8px',          // 6pt (reduced from 12pt)
    card: '8px',            // 6pt (reduced from 12pt)
    modal: '16px',          // 12pt (reduced from 20pt)
    input: '8px',           // 6pt (reduced from 12pt)
  },

  // 🎭 Shadow System (enhanced for dark theme)
  shadows: {
    none: 'none',
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.4)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.3)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.3)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.3)',
    card: '0 4px 6px -1px rgba(0, 0, 0, 0.5)',
    modal: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
    button: '0 2px 4px 0 rgba(0, 0, 0, 0.3)',
  },

  // 🎬 Animation System
  animation: {
    // Transition Duration
    duration: {
      fast: '150ms',
      normal: '300ms',
      slow: '500ms',
      modal: '400ms',
    },
    
    // Easing Functions (smooth ease-out as specified)
    easing: {
      easeOut: 'cubic-bezier(0, 0, 0.2, 1)',    // Smooth ease-out
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    },
    
    // Transform Values (scale-down effect for buttons)
    scale: {
      down: '0.95',           // Button press scale
      up: '1.05',
      normal: '1',
    },
  },

  // 🧩 Component Specifications
  components: {
    // Button Styles & Sizes (as specified)
    button: {
      // Primary Button (WorldID)
      primary: {
        height: '69px',          // 52pt
        padding: '0 21px',       // 16pt horizontal
        borderRadius: '8px',     // 6pt corner radius (reduced)
        fontSize: '21px',        // 16pt
        fontWeight: '500',       // Medium
        backgroundColor: '#10B981',
        color: '#0B0F0E',       // Text on primary
        border: 'none',
        minWidth: '160px',
        // Interactive states
        hover: {
          backgroundColor: '#059669',
        },
        pressed: {
          backgroundColor: '#0F9F74',  // Color darkens
          transform: 'scale(0.95)',    // Scale down
        },
      },
      
      // Secondary Button (Email Login/alternatives)
      secondary: {
        height: '69px',          // 52pt (same size as primary)
        padding: '0 21px',       // 16pt horizontal
        borderRadius: '8px',     // 6pt corner radius (reduced)
        fontSize: '21px',        // 16pt
        fontWeight: '500',       // Medium
        backgroundColor: 'transparent',
        color: '#10B981',
        border: '1px solid #10B981',
        minWidth: '160px',
        // Interactive states
        hover: {
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
        },
        pressed: {
          backgroundColor: 'rgba(16, 185, 129, 0.2)',
          transform: 'scale(0.95)',
        },
      },
      
      // Small Button (Skip, etc.)
      small: {
        height: '53px',          // 40pt
        padding: '0 16px',       // 12pt horizontal
        borderRadius: '8px',     // 6pt corner radius (reduced)
        fontSize: '19px',        // 14pt
        fontWeight: '500',       // Medium
        backgroundColor: '#A7F3D0',
        color: '#0B0F0E',
        border: 'none',
        minWidth: '107px',       // 80pt
        // Interactive states
        hover: {
          backgroundColor: '#86EFAC',
        },
        pressed: {
          backgroundColor: '#6EE7B7',
          transform: 'scale(0.95)',
        },
      },
    },
    
    // Input Specifications
    input: {
      height: '64px',          // 48pt
      padding: '0 21px',       // 16pt
      borderRadius: '8px',     // 6pt (reduced)
      fontSize: '21px',        // 16pt
      backgroundColor: '#1F2937',
      border: '1px solid #374151',
      color: '#FFFFFF',
      placeholderColor: '#F3F4F6',
      // Focus state
      focus: {
        borderColor: '#10B981',
        outline: '2px solid rgba(16, 185, 129, 0.3)',
      },
    },
    
    // Card Specifications (Event Cards)
    card: {
      padding: '21px',         // 16pt
      borderRadius: '8px',     // 6pt (reduced)
      backgroundColor: '#111827',
      border: '1px solid #374151',
      shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.5)',
      // Interactive states
      hover: {
        transform: 'translateY(-2px)',
        shadow: '0 8px 12px -2px rgba(0, 0, 0, 0.6)',
      },
    },
    
    // Navigation Specifications
    bottomNav: {
      height: '69px',          // 52pt
      backgroundColor: '#111827',
      borderTop: '1px solid #374151',
      paddingTop: '11px',      // 8pt
      paddingBottom: '11px',   // 8pt
      paddingHorizontal: '27px', // 20pt
    },
    
    topBar: {
      height: '69px',          // 52pt
      backgroundColor: '#0B0F0E',
      borderBottom: '1px solid #374151',
      padding: '0 27px',       // 20pt
    },
    
    // Filter Bar
    filterBar: {
      height: '53px',          // 40pt
      backgroundColor: '#111827',
      borderBottom: '1px solid #374151',
      padding: '0 27px',       // 20pt
    },
  },

  // 📱 Layout Grid System
  grid: {
    columns: 12,
    gutter: '21px',          // 16pt
    margin: '27px',          // 20pt
    breakpoints: {
      mobile: '0px',
      tablet: '768px',
      desktop: '1024px',
    },
  },

  // 🎯 Icon Specifications (line-style icons)
  icons: {
    size: {
      sm: '21px',            // 16pt
      md: '27px',            // 20pt
      lg: '32px',            // 24pt
      xl: '43px',            // 32pt
    },
    stroke: '2px',           // 2px stroke weight as specified
    style: 'line',           // Line-style icons
    colors: {
      primary: '#A7F3D0',    // Lime green
      secondary: '#FFFFFF',   // White
      muted: '#9CA3AF',
    },
  },

  // 🌍 WorldID Specific Tokens
  worldid: {
    primaryColor: '#10B981',
    iconSize: '43px',        // 32pt
    buttonHeight: '69px',    // 52pt
    animationDuration: '300ms',
    logoSize: '64px',        // 48pt
  },

  // 🏷️ Event Categories (from events_prototype_no_imgs.json)
  categories: {
    Festival: { 
      color: '#EF4444', 
      icon: 'music',
      bgColor: 'rgba(239, 68, 68, 0.1)',
    },
    Networking: { 
      color: '#3B82F6', 
      icon: 'users',
      bgColor: 'rgba(59, 130, 246, 0.1)',
    },
    Hackathon: { 
      color: '#8B5CF6', 
      icon: 'code',
      bgColor: 'rgba(139, 92, 246, 0.1)',
    },
    Seminar: { 
      color: '#F59E0B', 
      icon: 'presentation',
      bgColor: 'rgba(245, 158, 11, 0.1)',
    },
    Concert: { 
      color: '#EC4899', 
      icon: 'music-note',
      bgColor: 'rgba(236, 72, 153, 0.1)',
    },
    Workshop: { 
      color: '#10B981', 
      icon: 'tools',
      bgColor: 'rgba(16, 185, 129, 0.1)',
    },
    Meetup: { 
      color: '#06B6D4', 
      icon: 'coffee',
      bgColor: 'rgba(6, 182, 212, 0.1)',
    },
    Conference: { 
      color: '#84CC16', 
      icon: 'microphone',
      bgColor: 'rgba(132, 204, 22, 0.1)',
    },
    Exhibition: { 
      color: '#F97316', 
      icon: 'gallery',
      bgColor: 'rgba(249, 115, 22, 0.1)',
    },
  },

  // 💰 Currency Display (from events_prototype_no_imgs.json)
  currencies: {
    USD: { symbol: '$', position: 'before' },
    EUR: { symbol: '€', position: 'after' },
    GBP: { symbol: '£', position: 'before' },
    JPY: { symbol: '¥', position: 'before' },
    AUD: { symbol: 'A$', position: 'before' },
    CZK: { symbol: 'Kč', position: 'after' },
  },
};

// 🔧 Helper Functions
export const getColor = (path) => {
  return path.split('.').reduce((obj, key) => obj?.[key], designTokens.colors);
};

export const getSpacing = (key) => {
  return designTokens.spacing[key];
};

export const getAnimation = (type, property) => {
  return designTokens.animation[type]?.[property];
};

export const getFontSize = (key) => {
  return designTokens.typography.fontSize[key];
};

export const getCategoryConfig = (category) => {
  return designTokens.categories[category] || designTokens.categories.Conference;
};

export const formatPrice = (price, currency) => {
  const config = designTokens.currencies[currency] || designTokens.currencies.USD;
  return config.position === 'before' 
    ? `${config.symbol}${price}` 
    : `${price} ${config.symbol}`;
};

// 📱 Mobile-specific utilities
export const convertPtToPx = (pt) => Math.round(pt * 1.33);
export const convertPxToPt = (px) => Math.round(px / 1.33);

export default designTokens; 