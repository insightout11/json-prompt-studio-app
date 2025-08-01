import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    // Enable source maps for debugging
    sourcemap: true,
    
    // Optimize chunks for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          utils: ['zustand'],
        },
      },
    },
    
    // Ensure public files are copied
    copyPublicDir: true,
    
    // Optimize for production (using default esbuild minifier)
    minify: 'esbuild',
  },
  
  // Server configuration for development
  server: {
    port: 5173,
    host: true, // Allow external connections
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