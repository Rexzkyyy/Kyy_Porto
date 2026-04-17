import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  build: {
    target: 'es2018',
    sourcemap: false,
    chunkSizeWarningLimit: 1200,
    // Minify with esbuild (default) + drop debug code in production
    minify: 'esbuild',
    rollupOptions: {
      output: {
        // Split heavy libraries for optimal browser caching
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'gsap': ['gsap', '@gsap/react'],
          'framer-motion': ['framer-motion'],
          'particles': ['react-tsparticles', 'tsparticles-slim'],
          'lenis': ['lenis'],
          'pdf': ['react-pdf', 'pdfjs-dist'],
        },
        // Deterministic chunk filenames for caching
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      }
    }
  },
  // Drop console.* and debugger statements ONLY in production
  esbuild: mode === 'production' ? {
    drop: ['console', 'debugger'],
    legalComments: 'none',
  } : {},
  // Optimize deps for faster dev startup
  optimizeDeps: {
    include: ['react', 'react-dom', 'framer-motion', 'gsap', 'lenis'],
  },
}))
