import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'

/**
 * Çevrimdışı kullanım: sw/sw.js'i derleme çıktısının listesiyle doldurup dist/sw.js yazar. Sürüm, önceden önbelleğe
 * alınan her dosyanın içerik özetidir; bir dosya değişince tarayıcıdaki eski kabuk önbelleği silinir.
 */
function servisCalisani(): Plugin {
  return {
    name: 'yapirisk-servis-calisani',
    apply: 'build',
    // Vite'ın HTML eklentisi boş giriş parçalarını kendi generateBundle'ında siler; liste ondan sonra çıkarılır.
    generateBundle: {
      order: 'post',
      handler(_, paket) {
        const { bolgeler } = JSON.parse(readFileSync('public/data/bolgeler.json', 'utf8')) as {
          bolgeler: { kimlik: string }[]
        }
        const ilDosyalari = [
          'tehlike-eshm20.json',
          'mahalleler.json',
          'sinir.json',
          'bina/dizin.json',
          'kaynak.json',
        ]
        const statik = [
          'favicon.svg',
          'apple-touch-icon.png',
          'manifest.webmanifest',
          'ikon-192.png',
          'ikon-512.png',
          'ikon-maskeli-512.png',
          'maptiler-logo.svg',
          'data/bolgeler.json',
          'data/dogrulama.json',
          'data/LISANSLAR.md',
          ...bolgeler.flatMap((b) => ilDosyalari.map((d) => `data/${b.kimlik}/${d}`)),
        ]
        const ozet = createHash('sha256')
        const parcaOzeti = createHash('sha256')
        const derlenen = Object.values(paket)
          .filter((p) => !p.fileName.endsWith('.map'))
          .sort((a, b) => a.fileName.localeCompare(b.fileName))
        for (const p of derlenen) ozet.update(p.fileName).update(p.type === 'chunk' ? p.code : p.source)
        for (const d of statik) {
          const icerik = readFileSync(path.join('public', d))
          ozet.update(d).update(icerik)
          if (d.endsWith('/kaynak.json')) parcaOzeti.update(icerik)
        }
        // .woff yedekleri önceden alınmaz: her güncel tarayıcı .woff2 kullanır, gerekirse ilk istekte önbelleğe girer.
        const onceden = [
          './',
          ...derlenen.map((p) => p.fileName).filter((f) => !f.endsWith('.woff')),
          ...statik,
        ]
        const kaynak = readFileSync('sw/sw.js', 'utf8')
          .replace("'__SURUM__'", JSON.stringify(ozet.digest('hex').slice(0, 12)))
          .replace("'__PARCA_SURUMU__'", JSON.stringify(parcaOzeti.digest('hex').slice(0, 12)))
          .replace('const ONCEDEN = __ONCEDEN__', `const ONCEDEN = ${JSON.stringify(onceden)}`)
        this.emitFile({ type: 'asset', fileName: 'sw.js', source: kaynak })
      },
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages proje sitesi alt yolda yayınlanır (.github/workflows/pages.yml); yerelde kök.
  base: process.env.YAPIRISK_TABAN ?? '/',
  plugins: [react(), tailwindcss(), servisCalisani()],
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
