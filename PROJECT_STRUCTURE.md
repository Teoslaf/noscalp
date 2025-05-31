# 📁 Event Discovery App - Project Structure

## Recommended Folder Organization

```
/your-app-root/
├── 📁 public/
│   ├── 📁 images/
│   │   ├── 📁 logos/
│   │   │   ├── app-logo.svg          # Main app logo
│   │   │   ├── app-logo-white.svg    # White version for dark backgrounds
│   │   │   └── worldid-logo.svg      # WorldID logo for auth
│   │   ├── 📁 events/
│   │   │   ├── event-placeholder.jpg # Default event image
│   │   │   ├── banners/              # Event banner images
│   │   │   └── thumbnails/           # Event thumbnail images
│   │   ├── 📁 icons/
│   │   │   ├── categories/           # Category icons (music, workshop, etc.)
│   │   │   ├── navigation/           # Bottom nav icons
│   │   │   └── ui/                   # General UI icons
│   │   └── 📁 backgrounds/
│   │       ├── splash-bg.jpg         # Splash screen background
│   │       └── auth-bg.jpg           # Authorization screen background
│   └── favicon.ico
├── 📁 src/
│   ├── 📁 styles/
│   │   ├── design-tokens.js          # Main design system
│   │   ├── globals.css               # Global styles
│   │   └── components.css            # Component-specific styles
│   ├── 📁 components/
│   │   ├── 📁 ui/                    # Reusable UI components
│   │   ├── 📁 layout/                # Layout components
│   │   └── 📁 screens/               # Screen-specific components
│   └── 📁 data/
│       └── events_prototype_no_imgs.json     # Event data (move here from root)
├── tailwind.config.js                # Tailwind configuration
├── figma-design-system.md            # Figma design specifications
└── package.json
```

## 🖼️ Image Requirements & Specifications

### Logo Files
- **App Logo**: SVG format, minimum 200x200px
- **WorldID Logo**: SVG format, official WorldID branding
- **Formats**: SVG preferred, PNG fallback (2x resolution for Retina)

### Event Images
- **Banners**: 1200x600px (2:1 aspect ratio)
- **Thumbnails**: 400x400px (1:1 aspect ratio)
- **Format**: WebP preferred, JPEG fallback
- **Quality**: 80% compression for web optimization

### Icons
- **Size**: 24x24px base size (provide 2x and 3x for mobile)
- **Format**: SVG preferred for scalability
- **Style**: Line icons with 2px stroke weight
- **Colors**: White (#FFFFFF) and Lime Green (#A7F3D0) variants

### Category Icons (from events_prototype_no_imgs.json)
Based on your event data, you'll need icons for:
- 🎵 Festival & Concert
- 🤝 Networking
- 💻 Hackathon
- 🎤 Seminar & Conference
- 🛠️ Workshop
- ☕ Meetup
- 🎨 Exhibition

## 📱 Mobile Optimization
- All images should be optimized for mobile devices
- Use Next.js Image component for automatic optimization
- Provide multiple resolutions (@1x, @2x, @3x)
- Consider dark mode variants where applicable 