// Formun son adımı: sonuç kartı ve cevapların listesi (her biri düzenlenebilir).
import { Map as HaritaIkonu } from 'lucide-react'
import type { Ref } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { SonucKarti } from '@/sonuc/SonucKarti'
import type { Sonuc } from '@/sonuc/sonuc'
import { cevapEtiketi, KAT_SEVIYESI, SORULAR } from './sorular'
import { adimlar, ilkEksik, istegeBagli, type Taslak } from './taslak'

interface Props {
  taslak: Taslak
  sonuc: Sonuc | null
  merkez: [number, number] | null
  baslikRef: Ref<HTMLHeadingElement>
  onGit: (adim: number) => void
  onHaritaya: () => void
  onTdth: (ss: number | null) => void
  onYazdir: () => void
  paylasimAdresi: string | null
}

export function Ozet({
  taslak,
  sonuc,
  merkez,
  baslikRef,
  onGit,
  onHaritaya,
  onTdth,
  onYazdir,
  paylasimAdresi,
}: Props) {
  const eksik = ilkEksik(taslak)

  const satirlar = adimlar(taslak).flatMap((ad, i) => {
    const soru = SORULAR[ad]
    const satir = { soru, adim: i, deger: soru.oku(taslak) }
    return ad === 'nizam' && (taslak.nizam === 'bitisik' || taslak.nizam === 'kosede')
      ? [satir, { soru: KAT_SEVIYESI, adim: i, deger: KAT_SEVIYESI.oku(taslak) }]
      : [satir]
  })

  return (
    <div className="flex flex-col gap-6">
      <section aria-labelledby="sonuc-baslik" className="flex flex-col gap-4">
        <h2
          id="sonuc-baslik"
          ref={baslikRef}
          tabIndex={-1}
          className="text-headline text-balance outline-none"
        >
          Sonuç
        </h2>
        {sonuc && merkez ? (
          <SonucKarti
            sonuc={sonuc}
            merkez={merkez}
            onTdth={onTdth}
            onYazdir={onYazdir}
            paylasimAdresi={paylasimAdresi}
          />
        ) : eksik !== null ? (
          <div className="flex flex-col gap-2">
            <p className="text-body-sm text-pretty">Sonuç için bazı sorular cevapsız.</p>
            <Button className="h-11" onClick={() => onGit(eksik)}>
              İlk cevapsız soruya git
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <p className="text-body-sm text-pretty">Sonuç için haritada bölge içinden bir bina seçin.</p>
            <Button className="h-11" onClick={onHaritaya}>
              <HaritaIkonu data-icon="inline-start" />
              Haritaya dön
            </Button>
          </div>
        )}
      </section>

      <section aria-labelledby="cevaplar-baslik" className="flex flex-col gap-2">
        <h2 id="cevaplar-baslik" className="text-label text-muted-foreground">
          Cevaplarınız
        </h2>
        <dl className="divide-y divide-border rounded-md border border-border">
          {satirlar.map(({ soru, adim, deger }) => (
            <div key={soru.kisa} className="px-3 py-1.5">
              <dt className="text-body-sm text-muted-foreground">{soru.kisa}</dt>
              <dd className="-my-1 flex items-center gap-3">
                <span
                  className={cn(
                    'min-w-0 flex-1 text-body-sm text-pretty',
                    deger === undefined && !istegeBagli(soru.adim) && 'text-error',
                  )}
                >
                  {cevapEtiketi(soru, deger)}
                </span>
                <Button variant="ghost" className="-mr-1 h-11" onClick={() => onGit(adim)}>
                  Değiştir<span className="sr-only">: {soru.kisa}</span>
                </Button>
              </dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  )
}
