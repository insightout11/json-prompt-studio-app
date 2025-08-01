# JSON PROMPT STUDIO Logo

A vectorized, customizable SVG logo for JSON PROMPT STUDIO with neon glow effects.

## Files

- `logo.svg` - Standalone SVG file (400x200px)
- `Logo.jsx` - React component with customization options
- `LogoDemo.jsx` - Interactive demo showing different variations
- `LOGO_README.md` - This documentation file

## Features

✨ **Fully Vectorized** - Scales perfectly at any size  
🎨 **Customizable Colors** - Change neon glow color  
💫 **Adjustable Glow** - Control glow intensity  
🎭 **Background Options** - Show/hide background  
📱 **Responsive** - Works on all devices  
⚡ **Lightweight** - Pure SVG, no external dependencies  

## Usage

### 1. Standalone SVG File

Use `logo.svg` directly in:
- HTML: `<img src="logo.svg" alt="JSON PROMPT STUDIO" />`
- CSS: `background-image: url('logo.svg')`
- Documents: Insert as image
- Print materials: Vector quality at any size

### 2. React Component

```jsx
import Logo from './Logo.jsx';

// Basic usage
<Logo />

// With customization
<Logo 
  width={400}
  height={200}
  neonColor="#ff00ff"
  glowIntensity={5}
  showBackground={false}
  className="my-logo"
/>
```

### 3. Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `width` | number | 400 | Logo width in pixels |
| `height` | number | 200 | Logo height in pixels |
| `neonColor` | string | "#00ffff" | Neon glow color (hex) |
| `glowIntensity` | number | 3 | Glow blur radius (1-8) |
| `showBackground` | boolean | true | Show/hide background |
| `className` | string | "" | Additional CSS classes |

### 4. Color Options

Predefined neon colors you can use:
- `#00ffff` - Cyan (default)
- `#ff00ff` - Purple
- `#00ff00` - Green
- `#ff8000` - Orange
- `#ff0080` - Pink
- `#ffff00` - Yellow

## Examples

### Header Logo
```jsx
<Logo width={200} height={100} showBackground={false} />
```

### Hero Section
```jsx
<Logo width={600} height={300} neonColor="#ff00ff" glowIntensity={5} />
```

### Footer Logo
```jsx
<Logo width={150} height={75} neonColor="#00ff00" />
```

### Dark Theme
```jsx
<Logo showBackground={false} className="dark-logo" />
```

## Integration

### In Your App.jsx
```jsx
import Logo from './Logo.jsx';

function App() {
  return (
    <div className="app">
      <header>
        <Logo width={200} height={100} showBackground={false} />
      </header>
      {/* rest of your app */}
    </div>
  );
}
```

### In Navigation
```jsx
import Logo from './Logo.jsx';

function Navigation() {
  return (
    <nav className="flex items-center justify-between p-4">
      <Logo width={150} height={75} showBackground={false} />
      {/* navigation items */}
    </nav>
  );
}
```

## Export Options

### For Web Use
- Use the React component directly
- Or use the SVG file as an image

### For Print
- Export SVG to PDF (vector quality)
- Use in Adobe Illustrator, InDesign, etc.

### For Social Media
- Export at high resolution (1200x600px recommended)
- Use PNG format for platforms that don't support SVG

### For Favicon
- Create a simplified version at 32x32px
- Convert to ICO format

## Customization Tips

### Matching Your Brand
1. Choose a neon color that matches your brand palette
2. Adjust glow intensity for subtle vs. dramatic effect
3. Use `showBackground={false}` to overlay on custom backgrounds

### Responsive Design
```jsx
// Responsive logo that scales with screen size
<Logo 
  width={Math.min(window.innerWidth * 0.8, 400)}
  height={Math.min(window.innerWidth * 0.4, 200)}
/>
```

### Animation
Add CSS animations to the logo:
```css
.logo-animated {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; }
}
```

## Browser Support

- ✅ Chrome/Edge (full support)
- ✅ Firefox (full support)
- ✅ Safari (full support)
- ✅ Mobile browsers (full support)

## Performance

- **File Size**: ~2KB (SVG)
- **Rendering**: Hardware accelerated
- **Memory**: Minimal footprint
- **Loading**: Instant (no external requests)

## Demo

Run the demo to see all variations:
```jsx
import LogoDemo from './LogoDemo.jsx';

// In your app
<LogoDemo />
```

## License

This logo is created for JSON PROMPT STUDIO. Feel free to modify and use as needed for your project.

---

**Need help?** Check out the `LogoDemo.jsx` file for interactive examples and customization options! 