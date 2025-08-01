# AI Video Prompt Generator

> Professional AI-powered tool for creating structured JSON prompts for video generation

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18.2.0-blue)](https://reactjs.org/)

## 🚀 Features

- **AI-Powered Generation**: Create professional video prompts using advanced AI
- **Multiple Input Methods**: Text-to-JSON, Image-to-JSON, and manual configuration
- **Character Engine**: Generate detailed characters with backstories and traits
- **Scene Builder**: Comprehensive scene creation with environmental details
- **World Builder**: Create immersive environments with consistent lore
- **5-Option Scene Extensions**: AI generates multiple creative scene continuations
- **Template System**: Pre-built templates for quick prompt generation
- **Pro Subscription**: Advanced features with Stripe integration
- **Dark/Light Mode**: Beautiful UI with theme switching
- **Export Options**: Copy to clipboard, save projects, template library
- **Responsive Design**: Works on desktop, tablet, and mobile

## 🎯 Live Demo

Visit the live application: [Your Domain Here]

## 📋 Prerequisites

- Node.js >= 18.0.0
- npm or yarn
- Modern web browser with JavaScript enabled

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ai-video-prompt-generator.git
   cd ai-video-prompt-generator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your actual values
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   - Navigate to `http://localhost:5173`

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Required for production
VITE_APP_URL=https://your-domain.com
VITE_GA4_ID=G-XXXXXXXXXX
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...

# Optional
VITE_OPENAI_API_KEY=sk-...
VITE_SEARCH_CONSOLE_ID=your-verification-id
```

### Domain Setup

Replace all instances of `{{YOUR_DOMAIN_HERE}}` in the following files:
- `index.html`
- `public/sitemap.xml`
- `public/robots.txt`

### Required Assets

Create these image files in the `/public` folder:
- `favicon.ico`
- `favicon-16x16.png`
- `favicon-32x32.png`
- `apple-touch-icon.png`
- `og-image.jpg`
- `twitter-image.jpg`

See `public/FAVICON-INSTRUCTIONS.md` for detailed guidance.

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Static Hosting

The built files in `/dist` can be deployed to:
- Vercel
- Netlify  
- GitHub Pages
- AWS S3 + CloudFront
- Any static hosting service

### Server Configuration

For SPA routing, configure your server to serve `index.html` for all routes.

**Apache (.htaccess)**:
```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

**Nginx**:
```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

## 📚 Usage

### Basic Usage

1. **Create a Scene**: Use the form to configure scene parameters
2. **AI Generation**: Try Text-to-JSON or Image-to-JSON features
3. **Templates**: Browse and use pre-built templates
4. **Export**: Copy JSON to clipboard or save to library

### Pro Features

- **Character Engine**: Advanced character generation
- **World Builder**: Environmental world creation
- **Scene Extender**: 5-option scene continuations
- **Storyboard Generator**: Full storyboard sequences

### API Integration

Users can provide their own OpenAI API key for AI features, or you can provide a global key via environment variables.

## 🎨 Customization

### Themes
- Dark/Light mode toggle
- Cinema-inspired dark theme
- Responsive design with Tailwind CSS

### Schema Configuration
- Modify `schema.js` to add new field types
- Update templates in template files
- Customize field validation and options

## 🔒 Privacy & Security

- User data stored locally in browser
- Optional analytics with user consent
- API keys handled securely
- No server-side data storage by default

## 🐛 Troubleshooting

### Common Issues

**Build Errors**:
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Vite Issues**:
```bash
# Clear Vite cache
rm -rf .vite
npm run dev
```

**Environment Variables Not Loading**:
- Ensure variables start with `VITE_`
- Restart development server after changes
- Check `.env` file is in root directory

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

- **Documentation**: Check this README and inline code comments
- **Issues**: Report bugs via GitHub Issues
- **Discussions**: Use GitHub Discussions for questions

## 🎯 Roadmap

- [ ] Public API endpoints
- [ ] Template marketplace
- [ ] User accounts and cloud sync
- [ ] Mobile app versions
- [ ] Integration with video generation platforms

## 🙏 Acknowledgments

- Built with React, Vite, and Tailwind CSS
- AI integration with OpenAI GPT models
- Icons and design inspiration from modern UI libraries
- Community feedback and contributions

---

**Made with ❤️ for the AI video generation community**