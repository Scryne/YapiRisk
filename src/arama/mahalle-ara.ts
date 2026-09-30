// Yerel mahalle araması (K-13): Türkçe katlama + belirteç bazlı bulanık eşleşme. Ağa çıkmaz.
import type { MahalleKaydi } from '@/veri/bolge'

const KATLAMA: Record<string, string> = {
  ç: 'c',
  ğ: 'g',
  ı: 'i',
  i̇: 'i',
  ö: 'o',
  ş: 's',
  ü: 'u',
  â: 'a',
  î: 'i',
  û: 'u',
}

/** Türkçe küçük harf, aksan katlama, harf-rakam dışı → boşluk. "Şehzadeler" ve "sehzadeler" aynı. */
export function katla(metin: string): string {
  return metin
    .toLocaleLowerCase('tr')
    .replace(/i̇/g, 'i')
    .replace(/[çğıöşüâîû]/g, (h) => KATLAMA[h])
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

/** Kullanıcının yazdığı ama kayıt adında olmayan tür sözcükleri ("Zafer Mahallesi", "İçhisar Köyü"). */
const TUR_SOZCUKLERI = new Set(['mahallesi', 'mahalle', 'mah', 'mh', 'koyu', 'koy', 'mevkii', 'mevki'])

/** Damerau–Levenshtein (bitişik yer değiştirme dahil), üst sınırı aşınca erken biter. */
export function duzeltmeUzakligi(a: string, b: string, sinir: number): number {
  if (Math.abs(a.length - b.length) > sinir) return sinir + 1
  const d: number[][] = Array.from({ length: a.length + 1 }, (_, i) => [
    i,
    ...Array<number>(b.length).fill(0),
  ])
  for (let j = 1; j <= b.length; j++) d[0][j] = j
  for (let i = 1; i <= a.length; i++) {
    let satirEnAz = Infinity
    for (let j = 1; j <= b.length; j++) {
      const maliyet = a[i - 1] === b[j - 1] ? 0 : 1
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + maliyet)
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1])
        d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1)
      satirEnAz = Math.min(satirEnAz, d[i][j])
    }
    if (satirEnAz > sinir) return sinir + 1
  }
  return d[a.length][b.length]
}

/** Bir sorgu belirtecinin bir aday belirtece uyumu: 0 = uymuyor. */
function belirtecPuani(s: string, aday: string): number {
  if (aday === s) return 4
  if (aday.startsWith(s)) return 3
  if (s.length >= 3 && aday.includes(s)) return 2
  if (s.length >= 4) {
    const sinir = s.length >= 7 ? 2 : 1
    // Yazılan kısım adayın başıyla bulanık eşleşiyorsa (yazmaya devam ediyor olabilir) ya da tamamıyla.
    const bas = aday.slice(0, s.length)
    if (duzeltmeUzakligi(s, bas, sinir) <= sinir || duzeltmeUzakligi(s, aday, sinir) <= sinir) return 1
  }
  return 0
}

export interface AramaSonucu {
  kayit: MahalleKaydi
  puan: number
}

interface Dizinli {
  kayit: MahalleKaydi
  ad: string[]
  ilce: string[]
}

export function aramaDizini(kayitlar: MahalleKaydi[]): Dizinli[] {
  return kayitlar.map((kayit) => ({
    kayit,
    ad: katla(kayit.ad).split(' '),
    ilce: katla(kayit.ilce).split(' '),
  }))
}

/**
 * Her sorgu belirteci (tür sözcükleri ve bölge adı hariç) adda ya da ilçede bir karşılık bulmalı. Ad eşleşmesi ilçeden ağır basar;
 * eşitlikte mahalle köyden önce, sonra alfabetik.
 */
export function mahalleAra(
  dizin: Dizinli[],
  sorgu: string,
  { enFazla = 8, bolgeAdi }: { enFazla?: number; bolgeAdi?: string } = {},
): AramaSonucu[] {
  const yokSay = new Set([...TUR_SOZCUKLERI, ...(bolgeAdi ? katla(bolgeAdi).split(' ') : [])])
  const belirtecler = katla(sorgu)
    .split(' ')
    .filter((b) => b && !yokSay.has(b))
  if (belirtecler.length === 0) return []
  const sonuc: AramaSonucu[] = []
  for (const d of dizin) {
    let puan = 0
    let hepsi = true
    for (const s of belirtecler) {
      const adP = Math.max(...d.ad.map((a) => belirtecPuani(s, a)))
      const ilceP = Math.max(...d.ilce.map((a) => belirtecPuani(s, a)))
      if (adP === 0 && ilceP === 0) {
        hepsi = false
        break
      }
      puan += Math.max(adP * 2, ilceP)
    }
    if (hepsi) sonuc.push({ kayit: d.kayit, puan })
  }
  return sonuc
    .sort(
      (a, b) =>
        b.puan - a.puan ||
        (a.kayit.tur === b.kayit.tur ? 0 : a.kayit.tur === 'mahalle' ? -1 : 1) ||
        a.kayit.ad.localeCompare(b.kayit.ad, 'tr') ||
        a.kayit.ilce.localeCompare(b.kayit.ilce, 'tr'),
    )
    .slice(0, enFazla)
}
