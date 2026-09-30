// Formun son adımı: cevapların listesi (her biri düzenlenebilir) ve ön sonuç (bant + PP aralığı).
// Sonuç kartının tamamı (katkı tablosu, belirsizlik, rapor) Faz 6'da.
import { Map as HaritaIkonu } from 'lucide-react'
import type { Ref } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { Bant } from '@/yontem/bant'
import { degerlendir } from '@/yontem/degerlendir'
import { cevapEtiketi, KAT_SEVIYESI, SORULAR } from './sorular'
import { ADIMLAR, ilkEksik, istegeBagli, tamCevaplar, type Taslak } from './taslak'

const BANT_ADI: Record<Bant, string> = {
  yuksek: 'Yüksek öncelik',
  orta: 'Orta öncelik',
  dusuk: 'Düşük öncelik',
}
const BANT_RENGI: Record<Bant, string> = {
  yuksek: 'bg-priority-high',
  orta: 'bg-priority-medium',
  dusuk: 'bg-priority-low',
}

const tamsayi = new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 0 })

interface Props {
  taslak: Taslak
  ss: number | null
  baslikRef: Ref<HTMLHeadingElement>
  onGit: (adim: number) => void
  onHaritaya: () => void
}

export function Ozet({ taslak, ss, baslikRef, onGit, onHaritaya }: Props) {
  const tam = tamCevaplar(taslak)
  const eksik = ilkEksik(taslak)
  const sonuc =
    tam && ss !== null ? degerlendir(tam.cevaplar, { kaynak: 'eshm20', ss, zemin: tam.zemin }) : null

  const satirlar = ADIMLAR.flatMap((ad, i) => {
    const soru = SORULAR[ad]
    const satir = { soru, adim: i, deger: soru.oku(taslak) }
    return ad === 'nizam' && (taslak.nizam === 'bitisik' || taslak.nizam === 'kosede')
      ? [satir, { soru: KAT_SEVIYESI, adim: i, deger: KAT_SEVIYESI.oku(taslak) }]
      : [satir]
  })

  return (
    <section aria-labelledby="ozet-baslik" className="flex flex-col gap-4">
      <h2 id="ozet-baslik" ref={baslikRef} tabIndex={-1} className="text-headline text-balance outline-none">
        Cevaplarınız
      </h2>

      {sonuc && tam ? (
        <div className="rounded-md border border-border bg-background/40 p-3" data-testid="on-sonuc">
          <h3 className="text-label text-muted-foreground">Profesyonel inceleme önceliği</h3>
          <p
            className={cn(
              'mt-2 inline-block rounded-sm px-2 py-1 text-headline text-on-priority',
              BANT_RENGI[sonuc.bant.bant],
            )}
          >
            {BANT_ADI[sonuc.bant.bant]}
          </p>
          <dl className="mt-3 grid grid-cols-[1fr_auto] items-baseline gap-x-3 gap-y-1">
            <dt className="text-body-sm text-muted-foreground">Performans puanı (PP) aralığı</dt>
            <dd className="text-right font-mono text-mono-md tabular-nums" data-testid="pp-araligi">
              {sonuc.kotu.pp === sonuc.iyi.pp
                ? tamsayi.format(sonuc.kotu.pp)
                : `${tamsayi.format(sonuc.kotu.pp)} – ${tamsayi.format(sonuc.iyi.pp)}`}
            </dd>
          </dl>
          {sonuc.bant.yayilim.length > 1 && (
            <p className="mt-2 text-body-sm text-pretty text-muted-foreground">
              Aralık {sonuc.bant.yayilim.length} önceliğe yayılıyor; öncelik aralığın elverişsiz ucundan
              seçildi.
            </p>
          )}
          {tam.malzemeVarsayildi && (
            <p className="mt-2 text-body-sm text-pretty text-muted-foreground">
              Taşıyıcı malzeme bilinmediği için bina betonarme varsayıldı.
            </p>
          )}
        </div>
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
  )
}
