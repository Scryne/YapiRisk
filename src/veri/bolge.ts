// Bölge paketi (public/data/<bölge>/): pipeline çıktılarının tipleri ve yükleyicisi.
// Kod hiçbir yerde il adı bilmez (K-3); bölge bolgeler.json kaydından seçilir.
import type { Izgara } from '@/yontem/tehlike'

export interface BolgeKaydi {
  kimlik: string
  ad: string
  /** [boylam, enlem] */
  merkez: [number, number]
  yakinlik: number
  /** [boylam_min, enlem_min, boylam_max, enlem_max] */
  sinirKutusu: [number, number, number, number]
}

export interface TehlikePaketi {
  model: string
  yillikAsilmaOlasiligi: number
  donusPeriyodu: number
  cekim: string
  izgaralar: Record<'PGA' | 'SS' | 'S1', Izgara>
}

export interface MahalleKaydi {
  ad: string
  ilce: string
  tur: 'mahalle' | 'koy'
  /** [boylam, enlem] */
  konum: [number, number]
}

export interface SinirPaketi {
  type: 'Feature'
  properties: { ad: string }
  geometry:
    { type: 'Polygon'; coordinates: number[][][] } | { type: 'MultiPolygon'; coordinates: number[][][][] }
}

export interface BinaDizini {
  z: number
  /** [x, y, bina sayısı] */
  parcalar: [number, number, number][]
}

export interface BolgePaketi {
  kayit: BolgeKaydi
  tehlike: TehlikePaketi
  mahalleler: MahalleKaydi[]
  sinir: SinirPaketi
  binaDizini: BinaDizini
}

/** Statik dosya yolu; GitHub Pages alt yolunda da çalışsın diye Vite BASE_URL'ine göre. */
export const veriYolu = (yol: string) => `${import.meta.env.BASE_URL}data/${yol}`

async function jsonAl<T>(yol: string): Promise<T> {
  const yanit = await fetch(veriYolu(yol))
  if (!yanit.ok) throw new Error(`${yol} yüklenemedi (${yanit.status})`)
  return (await yanit.json()) as T
}

export async function bolgeleriYukle(): Promise<BolgeKaydi[]> {
  return (await jsonAl<{ bolgeler: BolgeKaydi[] }>('bolgeler.json')).bolgeler
}

export async function bolgePaketiYukle(kayit: BolgeKaydi): Promise<BolgePaketi> {
  const k = kayit.kimlik
  const [tehlike, mahalle, sinir, binaDizini] = await Promise.all([
    jsonAl<TehlikePaketi>(`${k}/tehlike-eshm20.json`),
    jsonAl<{ kayitlar: MahalleKaydi[] }>(`${k}/mahalleler.json`),
    jsonAl<SinirPaketi>(`${k}/sinir.json`),
    jsonAl<BinaDizini>(`${k}/bina/dizin.json`),
  ])
  return { kayit, tehlike, mahalleler: mahalle.kayitlar, sinir, binaDizini }
}
