// Ayak izi parçaları: z14 karo hesabı (pipeline/ayak_izi.py ile aynı), gzip açma ve önbellek.
import { veriYolu, type BinaDizini } from './bolge'

/** Bir bina: halkalar, her halka [boylam, enlem] listesi (ilk halka dış sınır). */
export type BinaCokgeni = [number, number][][]

export function karo(boylam: number, enlem: number, z: number): [number, number] {
  const n = 2 ** z
  const x = Math.floor(((boylam + 180) / 360) * n)
  const e = (enlem * Math.PI) / 180
  const y = Math.floor(((1 - Math.asinh(Math.tan(e)) / Math.PI) / 2) * n)
  return [Math.min(Math.max(x, 0), n - 1), Math.min(Math.max(y, 0), n - 1)]
}

/** Görünür kutuyu kaplayan karolardan dizinde olanlar. */
export function gorunenParcalar(
  dizin: BinaDizini,
  kutu: { bati: number; guney: number; dogu: number; kuzey: number },
): [number, number][] {
  const [x0, y0] = karo(kutu.bati, kutu.kuzey, dizin.z)
  const [x1, y1] = karo(kutu.dogu, kutu.guney, dizin.z)
  const var_ = new Set(dizin.parcalar.map(([x, y]) => `${x}/${y}`))
  const sonuc: [number, number][] = []
  for (let x = x0; x <= x1; x++) for (let y = y0; y <= y1; y++) if (var_.has(`${x}/${y}`)) sonuc.push([x, y])
  return sonuc
}

export class ParcaOnbellegi {
  private readonly bellek = new Map<string, Promise<BinaCokgeni[]>>()
  private readonly bolge: string
  private readonly sinir: number

  constructor(bolge: string, sinir = 96) {
    this.bolge = bolge
    this.sinir = sinir
  }

  al(x: number, y: number): Promise<BinaCokgeni[]> {
    const anahtar = `${x}/${y}`
    let parca = this.bellek.get(anahtar)
    if (parca) {
      // En son kullanılanı sona taşı (LRU).
      this.bellek.delete(anahtar)
    } else {
      parca = this.indir(anahtar)
      parca.catch(() => this.bellek.delete(anahtar))
    }
    this.bellek.set(anahtar, parca)
    while (this.bellek.size > this.sinir) this.bellek.delete(this.bellek.keys().next().value!)
    return parca
  }

  private async indir(anahtar: string): Promise<BinaCokgeni[]> {
    const yanit = await fetch(veriYolu(`${this.bolge}/bina/${anahtar}.json.gz`))
    if (!yanit.ok || !yanit.body) throw new Error(`Bina parçası ${anahtar} yüklenemedi (${yanit.status})`)
    // Sunucu gzip'i Content-Encoding ile açıp göndermiş olabilir; ilk iki bayta bakılır.
    const bayt = new Uint8Array(await yanit.arrayBuffer())
    const gzip = bayt[0] === 0x1f && bayt[1] === 0x8b
    const metin = gzip
      ? await new Response(new Blob([bayt]).stream().pipeThrough(new DecompressionStream('gzip'))).text()
      : new TextDecoder().decode(bayt)
    return (JSON.parse(metin) as { binalar: BinaCokgeni[] }).binalar
  }
}
