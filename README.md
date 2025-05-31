# 🎨 Event Discovery App - Design System

A comprehensive design system for a dark-themed mobile event discovery app with WorldID integration, built with Next.js and Tailwind CSS.

## 📋 Overview

This design system provides a complete visual identity and component library for building a modern event discovery mobile app. It includes:

- **Dark-themed UI** optimized for mobile devices
- **WorldID authentication** integration
- **Event data structure** based on real prototype data
- **Comprehensive design tokens** for colors, typography, spacing, and animations
- **Figma-compatible specifications** for design handoff
- **Tailwind CSS configuration** for rapid development

## 🚀 Quick Start

### 1. Installation

```bash
# Install dependencies
npm install tailwindcss@latest
npm install next@latest react@latest react-dom@latest

# Install optional dependencies for icons
npm install lucide-react
# or
npm install @heroicons/react
```

### 2. Setup

1. **Copy the design system files** to your project:
   ```
   src/styles/design-tokens.js
   tailwind.config.js
   ```

2. **Move events data**:
   ```bash
   mv events_prototype_no_imgs.json src/data/events_prototype_no_imgs.json
   ```

3. **Install fonts** - Add to your `_document.js` or layout:
   ```html
   <link rel="preconnect" href="https://fonts.googleapis.com">
   <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
   <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
   ```

4. **Add global styles** - In your `globals.css`:
   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;

   @layer base {
     body {
       font-family: 'Roboto', -apple-system, BlinkMacSystemFont, sans-serif;
       background-color: #0B0F0E;
       color: #FFFFFF;
     }
   }
   ```

### 3. Usage Examples

#### Using Design Tokens
```javascript
import { designTokens, getCategoryConfig, formatPrice } from '../styles/design-tokens';

// Get category colors
const categoryConfig = getCategoryConfig('Workshop');
console.log(categoryConfig.color); // #10B981

// Format prices
const price = formatPrice(99, 'USD'); // $99
```

#### Using Tailwind Classes
```jsx
// Primary Button
<button className="btn-primary">
  Authorize with WorldID
</button>

// Event Card
<div className="card-primary">
  <h3 className="text-body font-medium text-text-primary">Event Name</h3>
  <p className="text-caption text-text-secondary">Event description</p>
</div>

// Screen Layout
<div className="screen-container">
  <div className="nav-top">Top Navigation</div>
  <main className="pt-top-bar-height pb-bottom-nav-height">
    Content
  </main>
  <div className="nav-bottom">Bottom Navigation</div>
</div>
```

## 📂 Project Structure

```
your-project/
├── public/
│   └── images/
│       ├── logos/          # App logos, WorldID logo
│       ├── events/         # Event images (banners, thumbnails)
│       ├── icons/          # Category and UI icons
│       └── backgrounds/    # Splash and background images
├── src/
│   ├── styles/
│   │   ├── design-tokens.js    # Main design system
│   │   ├── globals.css         # Global styles
│   │   └── components.css      # Component styles
│   ├── components/
│   │   ├── ui/                 # Reusable UI components
│   │   ├── layout/             # Layout components
│   │   └── screens/            # Screen components
│   ├── data/
│   │   └── events_prototype_no_imgs.json   # Event data
│   └── pages/                  # Next.js pages
├── tailwind.config.js          # Tailwind configuration
├── figma-design-system.md      # Figma specifications
└── README.md
```

## 🎨 Design System Components

### Colors
- **Primary Green**: `#10B981` - Main brand color, buttons, accents
- **Secondary Lime**: `#A7F3D0` - Highlights, small buttons
- **Background Dark**: `#0B0F0E` - Main app background
- **Text White**: `#FFFFFF` - Primary text color

### Typography
- **Font**: Roboto (Google Fonts)
- **Scales**: App Title (24pt), Section Header (20pt), Body (16pt), Caption (14pt)
- **Line Height**: 1.4x font size for optimal readability

### Buttons
```jsx
// Primary Button (WorldID)
<button className="btn-primary">Authorize with WorldID</button>

// Secondary Button
<button className="btn-secondary">Alternative Action</button>

// Small Button
<button className="btn-small">Skip</button>
```

### Cards
```jsx
// Event Card
<div className="card-primary">
  <img className="aspect-event-banner rounded-md" src="banner.jpg" />
  <div className="space-y-sm">
    <h3 className="text-body font-medium">Event Name</h3>
    <p className="text-caption text-text-secondary">Event details</p>
  </div>
</div>
```

### Navigation
```jsx
// Top Bar
<div className="nav-top">
  <button>Settings</button>
  <h1 className="text-app-title font-bold">EventHub</h1>
  <button>Profile</button>
</div>

// Bottom Navigation
<div className="nav-bottom">
  <button className="flex flex-col items-center">
    <HomeIcon />
    <span className="text-small">Home</span>
  </button>
  {/* Other nav items */}
</div>
```

## 📱 Mobile Optimization

### Responsive Design
- **Mobile-first approach** with proper breakpoints
- **Touch-friendly** button sizes (minimum 52pt height)
- **Proper spacing** using 4pt grid system
- **Safe area support** for iOS/Android

### Performance
- **Optimized images** with Next.js Image component
- **Minimal bundle size** with tree-shaking
- **CSS-in-JS alternative** available via design tokens

## 🌍 WorldID Integration

### Button Component
```jsx
import { designTokens } from '../styles/design-tokens';

const WorldIDButton = ({ onSuccess, onError }) => (
  <button 
    className="btn-primary worldid-button"
    style={{ height: designTokens.worldid.buttonHeight }}
  >
    <img 
      src="/images/logos/worldid-logo.svg" 
      alt="WorldID"
      style={{ width: designTokens.worldid.iconSize }}
    />
    Authorize with WorldID
  </button>
);
```

## 📊 Using Events Data

The `events_prototype_no_imgs.json` file contains 30 sample events with complete data structure:

```javascript
import eventsData from '../data/events_prototype_no_imgs.json';

// Filter events by category
const workshops = eventsData.filter(event => event.category === 'Workshop');

// Get unique categories
const categories = [...new Set(eventsData.map(event => event.category))];
// ['Festival', 'Networking', 'Hackathon', 'Seminar', 'Concert', 'Workshop', 'Meetup', 'Conference', 'Exhibition']

// Format event data
const formatEvent = (event) => ({
  id: event.event_name,
  title: event.event_name,
  date: new Date(event.start_datetime),
  location: event.venue_or_online,
  organizer: event.organizer.name,
  price: formatPrice(Math.min(...event.ticket_types.map(t => t.price)), event.currency),
  category: event.category,
  isOnline: event.venue_or_online.startsWith('http')
});
```

### Event Data Structure
Each event includes:
- **Basic Info**: Name, description, category, dates
- **Location**: Venue address or online URL
- **Tickets**: Multiple types with prices and quantities
- **Organizer**: Name, email, phone
- **Advanced**: Capacity, tags, language, registration settings

## 🎯 Figma Integration

Use the `figma-design-system.md` file for:
- **Exact color values** for Figma color styles
- **Typography specifications** with proper line heights
- **Component dimensions** and spacing
- **Animation specifications** for prototyping
- **Icon guidelines** and style requirements

### Figma Setup Checklist
1. Import Roboto font family
2. Create color styles from design tokens
3. Set up text styles for all 6 scales
4. Build component library with auto layout
5. Create screen templates with proper constraints

## ⚡ Advanced Usage

### Custom Animations
```jsx
// Button with press animation
<button className="btn-primary hover:animate-button-press">
  Click me
</button>

// Modal with entrance animation
<div className="animate-modal-enter">
  Modal content
</div>
```

### Category-based Styling
```jsx
import { getCategoryConfig } from '../styles/design-tokens';

const CategoryBadge = ({ category }) => {
  const config = getCategoryConfig(category);
  
  return (
    <span 
      className="px-md py-xs rounded-button text-small font-medium"
      style={{
        backgroundColor: config.bgColor,
        color: config.color
      }}
    >
      {category}
    </span>
  );
};
```

### Responsive Layouts
```jsx
// Event grid with responsive columns
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-section-gap">
  {events.map(event => (
    <EventCard key={event.id} event={event} />
  ))}
</div>
```

## 🛠️ Development Tools

### Design Token Helpers
```javascript
import { 
  getColor, 
  getSpacing, 
  getFontSize, 
  formatPrice,
  convertPtToPx 
} from '../styles/design-tokens';

// Get design values programmatically
const primaryGreen = getColor('primary.green');
const cardPadding = getSpacing('cardPadding');
const titleSize = getFontSize('appTitle');
```

### Component Development
All components use design tokens for consistency:
- Colors reference token values
- Spacing uses the 4pt grid system
- Typography follows the 6-scale system
- Animations use consistent timing functions

## 📝 Contributing

When contributing to the design system:

1. **Follow naming conventions** from design tokens
2. **Use mobile-first responsive design**
3. **Test on actual mobile devices**
4. **Maintain accessibility standards** (WCAG 2.1 AA)
5. **Update Figma designs** alongside code changes

## 🔗 Resources

- **Design Tokens**: Complete token system in `src/styles/design-tokens.js`
- **Tailwind Config**: Pre-configured setup in `tailwind.config.js`
- **Figma Specs**: Detailed specifications in `figma-design-system.md`
- **Sample Components**: `EventCard.jsx` and `HomeScreen.jsx`
- **Events Data**: 30 sample events in `events_prototype_no_imgs.json`

---

## 🎯 Next Steps

1. **Add your app logo** to `/public/images/logos/`
2. **Implement WorldID authentication** using the button components
3. **Create remaining screens** using the design system components
4. **Add real event data** or connect to your API
5. **Deploy to mobile platforms** using React Native or PWA

This design system provides everything needed to build a professional, accessible, and beautiful event discovery app. All components are mobile-optimized and ready for production use.

---

*Built with ❤️ for modern mobile app development* 