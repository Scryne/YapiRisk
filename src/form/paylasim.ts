// Değerlendirmeyi apartmandaki diğer maliklerle paylaşmak: konum ve cevaplar adresin # parçasında taşınır. Bu parça
// sunucuya hiç gönderilmez (K-1); bağlantı yalnız kullanıcının gönderdiği kişide açılır. Bina çizimi taşınmaz,
// yalnız konum (nokta): sonuç aynıdır, bağlantı kısa kalır. Okunan bağlantı kayıt gibi güvenilmez sayılır.
import type { Secim } from '@/harita/tipler'
import { taslakDogrula } from './kayit'
import type { Taslak } from './taslak'

export interface Paylasim {
  secim: Secim
  taslak: Taslak
  tdthSs: number | null
}

const SURUM = 1

function base64url(metin: string): string {
  const bayt = new TextEncoder().encode(metin)
  let ikili = ''
  for (const b of bayt) ikili += String.fromCharCode(b)
  return btoa(ikili).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function base64urlCoz(kod: string): string {
  const ikili = atob(kod.replace(/-/g, '+').replace(/_/g, '/'))
  return new TextDecoder().decode(Uint8Array.from(ikili, (c) => c.charCodeAt(0)))
}

/** `#paylas=…` parçası; adres kökü çağıran tarafta eklenir. */
export function paylasimParcasi({ secim, taslak, tdthSs }: Paylasim): string {
  const [boylam, enlem] = secim.merkez
  const yuvarla = (x: number) => Math.round(x * 1e6) / 1e6
  return `#paylas=${base64url(JSON.stringify({ v: SURUM, k: [yuvarla(enlem), yuvarla(boylam)], t: taslak, s: tdthSs }))}`
}

export function paylasimOku(hash: string): Paylasim | null {
  const kod = new URLSearchParams(hash.replace(/^#/, '')).get('paylas')
  if (!kod) return null
  try {
    const ham = JSON.parse(base64urlCoz(kod)) as Record<string, unknown>
    const k = ham.k
    if (ham.v !== SURUM || !Array.isArray(k) || k.length !== 2) return null
    const [enlem, boylam] = k as unknown[]
    if (typeof enlem !== 'number' || typeof boylam !== 'number') return null
    if (Math.abs(enlem) > 90 || Math.abs(boylam) > 180) return null
    const s = ham.s
    return {
      secim: { tip: 'nokta', merkez: [boylam, enlem] },
      taslak: taslakDogrula(ham.t),
      tdthSs: typeof s === 'number' && s > 0 && s <= 4 ? s : null,
    }
  } catch {
    return null
  }
}
