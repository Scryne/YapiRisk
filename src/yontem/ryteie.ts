// RYTEİE 2019 Ek-A.2.1 betonarme performans puanı: PP = TP + Σ(Oᵢ · OPᵢ) + YSP (Denklem A2.1).
// Tablolar ryteie-2019.json'da; bu dosya yalnız formülü ve kalem kalem katkıyı uygular.
import tablo from './ryteie-2019.json'

export type Bolge = 'I' | 'II' | 'III' | 'IV'
export type KatGrubu = '1-2' | '3' | '4' | '5' | '6-7'
export type Sistem = 'BAC' | 'BACP'
export type Kalite = 'iyi' | 'orta' | 'kotu'
export type KatSeviyesi = 'ayni' | 'farkli'
export type Konum = 'orta' | 'kenar'
export type Nizam = { tip: 'ayrik' } | { tip: 'bitisik'; katSeviyesi: KatSeviyesi; konum: Konum }

/** Var/Yok olarak sorulan olumsuzluklar (Tablo A.3, 2–6 ve 8). */
export const KUSURLAR = [
  'yumusakKat',
  'duseydeDuzensizlik',
  'agirCikma',
  'plandaDuzensizlik',
  'kisaKolon',
  'zeminEgimi',
] as const
export type Kusur = (typeof KUSURLAR)[number]

/** "Bilmiyorum" içermeyen, puanlanabilir bina tanımı. */
export interface KesinGirdi {
  /** Serbest kat adedi (n_sk, Şekil A.1). */
  kat: number
  sistem: Sistem
  kalite: Kalite
  kusurlar: Record<Kusur, boolean>
  nizam: Nizam
}

export type Parametre = 'tabanPuani' | 'yapisalSistem' | 'gorunenKalite' | Kusur | 'yapiNizami'

export interface Kalem {
  parametre: Parametre
  /** Oᵢ (Tablo A.3); TP ve YSP için 1. */
  deger: number
  /** OPᵢ (Tablo A.4) ya da TP/YSP (Tablo A.1). */
  puan: number
  katki: number
}

export interface PuanSonucu {
  pp: number
  katGrubu: KatGrubu
  bolge: Bolge
  kalemler: Kalem[]
}

export class KapsamDisiHatasi extends Error {
  constructor(mesaj: string) {
    super(mesaj)
    this.name = 'KapsamDisiHatasi'
  }
}

export function katGrubu(kat: number): KatGrubu {
  const [enAz, enCok] = tablo.katAraligi
  if (!Number.isInteger(kat) || kat < enAz || kat > enCok) {
    throw new KapsamDisiHatasi(`RYTEİE Ek-A betonarme yöntemi 1–7 serbest kat içindir, gelen: ${kat}`)
  }
  if (kat <= 2) return '1-2'
  if (kat >= 6) return '6-7'
  return String(kat) as KatGrubu
}

export function nizamPuani(grup: KatGrubu, nizam: Nizam): { deger: number; puan: number } {
  if (nizam.tip === 'ayrik') return { deger: tablo.tabloA3.yapiNizami.ayrik, puan: 0 }
  const anahtar = `${nizam.katSeviyesi}-${nizam.konum}` as keyof (typeof tablo.tabloA4.yapiNizami)[KatGrubu]
  return { deger: tablo.tabloA3.yapiNizami.bitisik, puan: tablo.tabloA4.yapiNizami[grup][anahtar] }
}

export function puan(bolge: Bolge, girdi: KesinGirdi): PuanSonucu {
  const grup = katGrubu(girdi.kat)
  const kalem = (parametre: Parametre, deger: number, p: number): Kalem => ({
    parametre,
    deger,
    puan: p,
    katki: deger * p,
  })

  const kalemler: Kalem[] = [
    kalem('tabanPuani', 1, tablo.tabloA1.tabanPuani[grup][bolge]),
    kalem('yapisalSistem', 1, tablo.tabloA1.yapisalSistemPuani[grup][girdi.sistem]),
    kalem('gorunenKalite', tablo.tabloA3.gorunenKalite[girdi.kalite], tablo.tabloA4.gorunenKalite[grup]),
    ...KUSURLAR.map((k) =>
      kalem(
        k,
        girdi.kusurlar[k] ? tablo.tabloA3.varYok.var : tablo.tabloA3.varYok.yok,
        tablo.tabloA4[k][grup],
      ),
    ),
  ]
  const nizam = nizamPuani(grup, girdi.nizam)
  kalemler.push(kalem('yapiNizami', nizam.deger, nizam.puan))

  // -0 yerine 0: Oᵢ = 0 iken katkı gösterimde "−0" olmasın.
  for (const k of kalemler) k.katki = k.katki === 0 ? 0 : k.katki
  return { pp: kalemler.reduce((t, k) => t + k.katki, 0), katGrubu: grup, bolge, kalemler }
}
