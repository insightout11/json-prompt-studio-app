import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  root: '.',
  build: {
    rollupOptions: {
      input: 'react-app.html',
      output: {
        // Add timestamp to force cache invalidation
        entryFileNames: `assets/[name]-[hash]-v${Math.floor(Date.now()/1000)}.js`,
        chunkFileNames: `assets/[name]-[hash]-v${Math.floor(Date.now()/1000)}.js`,
        assetFileNames: `assets/[name]-[hash]-v${Math.floor(Date.now()/1000)}.[ext]`,
      }
    },
    // Enable source maps for debugging
    sourcemap: true,
    
    // Ensure public files are copied
    copyPublicDir: true,
    
    // Optimize for production (using default esbuild minifier)
    minify: 'esbuild',
  },
  
  // Server configuration for development
  server: {
    port: 5173,
    host: true, // Allow external connections
    proxy: {
      '/api': {
        target: 'http://localhost:3002',
        changeOrigin: true,
        secure: false
      }
    }
  },
  
  // Public base path configuration
  base: '/',
  
  // Asset handling
  assetsInclude: ['**/*.md'], // Include markdown files as assets
  
  // Define environment variables
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version || '1.0.0'),
  },
  
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'zustand'],
  },
})