import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    port: 0,
    open: true,
    host: true,
    cors: true,
    strictPort: false,
    hmr: {
      protocol: 'ws',
      host: 'localhost'
    }
  },
  optimizeDeps: {
    force: true
  },
  build: {
    sourcemap: true
  }
})
 