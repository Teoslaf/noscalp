# 🎨 Figma Design System - Event Discovery App

**Dark-themed mobile app with WorldID integration**  
*Based on events_prototype_no_imgs.json data structure*

---

## 📋 Quick Setup Guide for Figma

### 1. Color Styles Setup
Copy these exact HEX values into Figma Color Styles:

### 2. Typography Setup
- Import **Roboto** font family (Google Fonts)
- Create text styles with exact specifications below

### 3. Component Setup
- Create master components for buttons, cards, inputs
- Use Auto Layout for responsive design
- Apply proper constraints for mobile layouts

---

## 🎨 Color Palette

### Primary Colors
```
Primary Green      #10B981    ■ (Main brand color, WorldID buttons)
Primary Green Hover #059669   ■ (Button hover states)
Primary Green Press #0F9F74   ■ (Button pressed/active states)
Primary Green Light #34D399   ■ (Accent highlights)
Primary Green Dark  #047857   ■ (Deep accent)
```

### Secondary Colors
```
Secondary Lime      #A7F3D0   ■ (Small buttons, highlights)
Secondary Lime Hover #86EFAC  ■ (Lime button hover)
Secondary Lime Press #6EE7B7  ■ (Lime button pressed)
Secondary Lime Dark  #6EE7B7  ■ (Lime dark variant)
```

### Background Colors
```
Background Primary   #0B0F0E   ■ (Main app background)
Background Secondary #111827   ■ (Card backgrounds, nav)
Background Tertiary  #1F2937   ■ (Input backgrounds)
Background Modal     #1F2937   ■ (Modal backgrounds)
Background Card      #111827   ■ (Event card backgrounds)
Background Overlay   rgba(0, 0, 0, 0.8) (Modal overlays)
Background Splash    #000000   ■ (Splash screen)
```

### Text Colors
```
Text Primary        #FFFFFF    ■ (Main text, app title)
Text Secondary      #F3F4F6    ■ (Secondary text, placeholders)
Text Tertiary       #D1D5DB    ■ (Muted text)
Text Muted          #9CA3AF    ■ (Very muted text)
Text Disabled       #6B7280    ■ (Disabled states)
Text On Primary     #0B0F0E    ■ (Text on green buttons)
```

### Status Colors
```
Status Error        #EF4444    ■ (Error states)
Status Error Hover  #DC2626    ■ (Error hover)
Status Warning      #FBBF24    ■ (Warnings, alerts)
Status Warning Hover #F59E0B   ■ (Warning hover)
Status Success      #10B981    ■ (Success states)
Status Info         #3B82F6    ■ (Info states)
```

### Border Colors
```
Border Primary      #374151    ■ (Main borders, input lines)
Border Secondary    #4B5563    ■ (Secondary borders)
Border Focus        #10B981    ■ (Focus states)
Border Error        #EF4444    ■ (Error borders)
Border Disabled     #374151    ■ (Disabled borders)
```

### Interactive States
```
Interactive Hover   rgba(16, 185, 129, 0.1) (Hover overlays)
Interactive Pressed rgba(16, 185, 129, 0.2) (Press overlays)
Interactive Focus   rgba(16, 185, 129, 0.3) (Focus outlines)
Interactive Disabled rgba(107, 114, 128, 0.5) (Disabled overlays)
```

---

## 🔤 Typography System

### Font Family
- **Primary**: Roboto (Google Fonts)
- **Fallback**: System fonts (-apple-system, BlinkMacSystemFont)

### Text Styles (Figma Setup)

#### App Title
- **Font**: Roboto Bold
- **Size**: 24pt (32px for web)
- **Line Height**: 1.4 (33.6pt / 45px)
- **Color**: Text Primary (#FFFFFF)
- **Usage**: Main app title, screen headers

#### Section Header
- **Font**: Roboto Medium
- **Size**: 20pt (27px for web)
- **Line Height**: 1.4 (28pt / 38px)
- **Color**: Text Primary (#FFFFFF)
- **Usage**: Section titles, category headers

#### Body Text
- **Font**: Roboto Regular
- **Size**: 16pt (21px for web)
- **Line Height**: 1.4 (22.4pt / 29px)
- **Color**: Text Primary (#FFFFFF)
- **Usage**: Event descriptions, main content

#### Caption Text
- **Font**: Roboto Regular
- **Size**: 14pt (19px for web)
- **Line Height**: 1.4 (19.6pt / 27px)
- **Color**: Text Secondary (#F3F4F6)
- **Usage**: Hints, captions, metadata

#### Button Text
- **Font**: Roboto Medium
- **Size**: 16pt (21px for web)
- **Line Height**: 1.4 (22.4pt / 29px)
- **Color**: Text On Primary (#0B0F0E) or Primary Green (#10B981)
- **Usage**: All button labels

#### Small Text
- **Font**: Roboto Regular
- **Size**: 12pt (16px for web)
- **Line Height**: 1.4 (16.8pt / 22px)
- **Color**: Text Muted (#9CA3AF)
- **Usage**: Fine print, tags, timestamps

---

## 🔘 Button Components

### Primary Button (WorldID)
```
Dimensions: 334×52pt (445×69px)
Padding: 16pt horizontal (21px)
Corner Radius: 12pt (16px)
Background: Primary Green (#10B981)
Text: Roboto Medium, 16pt, Text On Primary (#0B0F0E)
Shadow: 0 2pt 4pt rgba(0, 0, 0, 0.3)

States:
- Default: #10B981
- Hover: #059669
- Pressed: #0F9F74 + scale(0.95)
- Disabled: rgba(107, 114, 128, 0.5)
```

### Secondary Button
```
Dimensions: 334×52pt (445×69px)
Padding: 16pt horizontal (21px)
Corner Radius: 12pt (16px)
Background: Transparent
Border: 1pt solid Primary Green (#10B981)
Text: Roboto Medium, 16pt, Primary Green (#10B981)

States:
- Default: Transparent with green border
- Hover: rgba(16, 185, 129, 0.1) background
- Pressed: rgba(16, 185, 129, 0.2) + scale(0.95)
```

### Small Button
```
Dimensions: 213×40pt (284×53px)
Padding: 12pt horizontal (16px)
Corner Radius: 12pt (16px)
Background: Secondary Lime (#A7F3D0)
Text: Roboto Medium, 14pt, Text On Primary (#0B0F0E)

States:
- Default: #A7F3D0
- Hover: #86EFAC
- Pressed: #6EE7B7 + scale(0.95)
```

---

## 📱 Input Components

### Primary Input
```
Dimensions: 334×48pt (445×64px)
Padding: 16pt horizontal (21px)
Corner Radius: 12pt (16px)
Background: Background Tertiary (#1F2937)
Border: 1pt solid Border Primary (#374151)
Text: Roboto Regular, 16pt, Text Primary (#FFFFFF)
Placeholder: Text Secondary (#F3F4F6)

Focus State:
- Border: Border Focus (#10B981)
- Outline: 2pt solid rgba(16, 185, 129, 0.3)
```

---

## 🃏 Card Components

### Event Card
```
Padding: 16pt all sides (21px)
Corner Radius: 12pt (16px)
Background: Background Card (#111827)
Border: 1pt solid Border Primary (#374151)
Shadow: 0 4pt 6pt rgba(0, 0, 0, 0.5)

Hover State:
- Transform: translateY(-2px)
- Shadow: 0 8pt 12pt rgba(0, 0, 0, 0.6)

Layout Structure:
┌─────────────────────────────┐
│     Event Image (2:1)       │
├─────────────────────────────┤
│ Event Name (Body Text)      │
│ Location (Caption)          │
│ Date & Time (Caption)       │
│ Author Name (Caption)       │
│ [Category Badge] [Price]    │
└─────────────────────────────┘
```

---

## 🧭 Navigation Components

### Bottom Navigation
```
Height: 52pt (69px)
Background: Background Secondary (#111827)
Border Top: 1pt solid Border Primary (#374151)
Padding: 8pt vertical, 20pt horizontal

Tab Structure:
- Icon: 20pt (27px), Lime Green (#A7F3D0) active, Text Muted inactive
- Label: Caption text, active/inactive states
- Active indicator: Lime Green background pill
```

### Top Bar
```
Height: 52pt (69px)
Background: Background Primary (#0B0F0E)
Border Bottom: 1pt solid Border Primary (#374151)
Padding: 20pt horizontal

Layout:
[Settings Icon] ← → [App Name] ← → [Profile Icon]
```

### Filter Bar
```
Height: 40pt (53px)
Background: Background Secondary (#111827)
Border Bottom: 1pt solid Border Primary (#374151)
Padding: 20pt horizontal

Filter Chips:
- Background: Background Tertiary (#1F2937)
- Border: Border Primary (#374151)
- Corner Radius: 20pt (full pill)
- Active: Primary Green background
```

---

## 🎯 Icon Specifications

### Size System
- **Small**: 16pt (21px) - UI elements
- **Medium**: 20pt (27px) - Navigation, actions
- **Large**: 24pt (32px) - Feature icons
- **Extra Large**: 32pt (43px) - WorldID, main actions

### Style Guidelines
- **Type**: Line icons (outlined style)
- **Stroke Width**: 2px consistent
- **Colors**: 
  - Primary: Lime Green (#A7F3D0)
  - Secondary: White (#FFFFFF)
  - Muted: Text Muted (#9CA3AF)

### Category Icons (from events_prototype_no_imgs.json)
Based on your event data, you'll need icons for:

---

## 📐 Layout & Spacing

### Screen Layout
```
Screen Padding: 20pt (27px) from edges
Section Gaps: 16pt (21px) between components
Safe Area: Respect iOS/Android safe areas
```

### Grid System
```
Columns: 2-column grid for event cards
Gutter: 16pt (21px) between grid items
Margins: 20pt (27px) from screen edges
```

### Component Spacing
```
Card Padding: 16pt (21px) internal
Button Spacing: 12pt (16px) between buttons
Text Spacing: 8pt (11px) between text elements
```

---

## 🎬 Animation Specifications

### Timing Functions
```
Ease Out: cubic-bezier(0, 0, 0.2, 1) - Default transitions
Ease In: cubic-bezier(0.4, 0, 1, 1) - Modal exits
Ease In Out: cubic-bezier(0.4, 0, 0.2, 1) - Complex animations
Bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55) - Playful interactions
```

### Duration Standards
```
Fast: 150ms - Micro-interactions
Normal: 300ms - Standard transitions
Slow: 500ms - Complex animations
Modal: 400ms - Modal enter/exit
```

### Interactive Animations
```
Button Press: scale(0.95) + color change
Card Hover: translateY(-2px) + shadow increase
Modal Enter: scale(0.95) → scale(1) + opacity 0 → 1
Page Transition: Slide left/right + fade
```

---

## 🌍 WorldID Integration

### WorldID Button
```
Height: 52pt (69px)
Icon: 32pt (43px) WorldID logo
Gap: 12pt (16px) between icon and text
Animation: 300ms ease-out transitions
```

### WorldID Colors
```
Primary: Primary Green (#10B981)
Success: Status Success (#10B981)
Error: Status Error (#EF4444)
Loading: Animated green pulse
```

---

## 📊 Component Library Structure

### Figma Organization
```
📁 Design System
├── 🎨 Color Styles
├── 🔤 Text Styles
├── 📐 Layout Grids
├── 🔘 Button Components
│   ├── Primary Button
│   ├── Secondary Button
│   └── Small Button
├── 📱 Input Components
├── 🃏 Card Components
├── 🧭 Navigation Components
├── 🎯 Icon Library
└── 📱 Screen Templates
    ├── Authorization Screen
    ├── Home Screen
    ├── Event Detail
    ├── Search Screen
    └── Create Event Flow
```

---

## 📱 Responsive Behavior

### Mobile Breakpoints
```
Mobile: 375px - 414px (iPhone range)
Tablet: 768px+ (iPad range)
Desktop: 1024px+ (Web version)
```

### Auto Layout Settings
```
Cards: Hug content vertically, fill horizontally
Buttons: Fixed height, hug content horizontally
Navigation: Fixed height, fill container width
Text: Hug content, max width constraints
```

---

## 🎨 Figma Setup Checklist

### 1. Color Setup
- [ ] Create all color styles with exact HEX values
- [ ] Organize colors into folders (Primary, Secondary, Background, etc.)
- [ ] Set up dark mode as default

### 2. Typography Setup
- [ ] Install Roboto font family
- [ ] Create text styles for all 6 type scales
- [ ] Set line heights to 1.4x font size
- [ ] Configure proper fallback fonts

### 3. Component Creation
- [ ] Build button components with all states
- [ ] Create input components with focus states
- [ ] Design card components with hover animations
- [ ] Set up navigation components
- [ ] Create icon library with consistent sizing

### 4. Layout Templates
- [ ] Create screen templates for all 6 main screens
- [ ] Set up auto layout for responsive behavior
- [ ] Apply consistent spacing using 4pt grid
- [ ] Test components across different screen sizes

### 5. Animation Prototypes
- [ ] Set up button press animations (scale down)
- [ ] Create modal enter/exit transitions
- [ ] Design page transition flows
- [ ] Add micro-interactions for better UX

---

## 🔗 Design System Resources

### Design Tokens
- All values are available in `design-tokens.js`
- Use helper functions for consistency
- Mobile pt values converted to web px values

### Tailwind Integration
- Design system is fully integrated with Tailwind CSS
- Custom component classes available (`.btn-primary`, `.card-primary`)
- All colors and spacing match exactly

### Implementation Notes
- All measurements include both pt (mobile) and px (web) values
- Color values use exact HEX codes for consistency
- Animation curves are optimized for mobile performance
- Typography scales are accessible and legible on mobile devices

---

*This design system ensures pixel-perfect consistency between Figma designs and final implementation using Next.js with Tailwind CSS.* 