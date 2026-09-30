// Adres çubuğundaki # parçası: `#konum=enlem,boylam` bir noktayı seçer, `#harita=yakınlık/enlem/boylam`
// yalnız haritayı oraya götürür. Uygulama bunları yalnız okur, yazmaz: konum kullanıcı paylaşmadıkça
// adrese girmez. # parçası sunucuya gönderilmez.

export type Baglanti =
  { tip: 'konum'; merkez: [number, number] } | { tip: 'harita'; merkez: [number, number]; yakinlik: number }

const sayi = (s: string | undefined) => (s !== undefined && s.trim() !== '' ? Number(s) : Number.NaN)
const gecerli = (enlem: number, boylam: number) =>
  Number.isFinite(enlem) && Number.isFinite(boylam) && Math.abs(enlem) <= 90 && Math.abs(boylam) <= 180

export function baglantiOku(hash: string): Baglanti | null {
  const parametre = new URLSearchParams(hash.replace(/^#/, ''))
  const konum = parametre.get('konum')
  if (konum) {
    const [e, b] = konum.split(',').map(sayi)
    if (gecerli(e, b)) return { tip: 'konum', merkez: [b, e] }
  }
  const harita = parametre.get('harita')
  if (harita) {
    const [z, e, b] = harita.split('/').map(sayi)
    if (gecerli(e, b) && Number.isFinite(z) && z >= 0 && z <= 22)
      return { tip: 'harita', merkez: [b, e], yakinlik: z }
  }
  return null
}
