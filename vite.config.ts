import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages proje sitesi alt yolda yayınlanır (.github/workflows/pages.yml); yerelde kök.
  base: process.env.YAPIRISK_TABAN ?? '/',
  plugins: [react(), tailwindcss()],
  // MapLibre worker'ı ES modülü olarak yüklenir ({ type: 'module' }).
  worker: { format: 'es' },
  // MapLibre GL tek başına ~1 MB; tembel yüklenen Harita parçasında kalır, bölünemez.
  // Bilgi sayfaları ayrı HTML: GitHub Pages'te yönlendirici gerekmez, her sayfa kendi adresinde.
  build: {
    chunkSizeWarningLimit: 1100,
    rollupOptions: {
      input: {
        index: 'index.html',
        yontem: 'yontem.html',
        veri: 'veri.html',
        hakkinda: 'hakkinda.html',
      },
    },
  },
  resolve: {
    alias: { '@': path.resolve(import.meta.dirname, './src') },
  },
})
