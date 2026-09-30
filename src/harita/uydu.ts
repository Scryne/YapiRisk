// İsteğe bağlı uydu katmanı (MapTiler, ücretsiz plan: ticari olmayan kullanım, logo + © MapTiler zorunlu).
// Varsayılan kapalı: kullanıcı açmadıkça MapTiler'a istek gitmez (K-1).
import type { RasterSourceSpecification } from 'maplibre-gl'

export const UYDU_ANAHTARI = import.meta.env.VITE_MAPTILER_ANAHTARI?.trim() || undefined
export const UYDU_KOKENI = 'https://api.maptiler.com/'

/** 256 px karo: ücretsiz planda 1 istek sayılır (512 px 4 sayılır). */
export function uyduKaynagi(anahtar: string): RasterSourceSpecification {
  return {
    type: 'raster',
    tiles: [`${UYDU_KOKENI}maps/satellite/256/{z}/{x}/{y}.jpg?key=${encodeURIComponent(anahtar)}`],
    tileSize: 256,
    // Manisa'da görüntü 18'de doyuyor (19'da pikselleşme ölçüldü); üstü büyütülür, kota harcanmaz.
    maxzoom: 18,
    attribution:
      '<a href="https://www.maptiler.com/copyright/" target="_blank" rel="noopener">© MapTiler</a> ' +
      '<a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">© OpenStreetMap katkıcıları</a>',
  }
}
