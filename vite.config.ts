import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // MapLibre worker'ı ES modülü olarak yüklenir ({ type: 'module' }).
  worker: { format: 'es' },
  // MapLibre GL tek başına ~1 MB; tembel yüklenen Harita parçasında kalır, bölünemez.
  build: { chunkSizeWarningLimit: 1100 },
  resolve: {
    alias: { '@': path.resolve(import.meta.dirname, './src') },
  },
})
