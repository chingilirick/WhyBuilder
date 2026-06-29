import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    watch: {
      ignored: ['**/node_modules/**', '**/*.pyc', '**/__pycache__/**', '**/*.py'],
    },
  },
  optimizeDeps: {
    exclude: ['whybuilder-backend'],
  },
  assetsInclude: ['**/*.svg', '**/*.csv'],
})
