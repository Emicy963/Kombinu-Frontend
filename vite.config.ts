import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  optimizeDeps: { 
    exclude: ['lucide-react'], 
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://kombinu.onrender.com',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api/, '/api')
      }
    }
    // hmr: false // Reabilitado
  }
})