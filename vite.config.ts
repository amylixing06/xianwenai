import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { splitVendorChunkPlugin } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    splitVendorChunkPlugin()
  ],
  base: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
              return 'react-vendor'
            }
            if (id.includes('@chakra-ui') || id.includes('@emotion') || id.includes('framer-motion')) {
              return 'chakra-ui'
            }
            if (id.includes('react-markdown')) {
              return 'markdown'
            }
            if (id.includes('react-icons')) {
              return 'icons'
            }
            if (id.includes('date-fns')) {
              return 'date-fns'
            }
            return 'vendor'
          }
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },
    chunkSizeWarningLimit: 1000,
    sourcemap: false
  },
  server: {
    historyApiFallback: true
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
    exclude: ['react-markdown']
  }
})
 