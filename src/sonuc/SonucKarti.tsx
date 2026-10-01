// Sonuç kartı (DESIGN.md): önce bant, altında ne demek olduğu, sonra PP aralığı, sonra kalem kalem katkı.
// Sayısal puan başlığa çıkmaz; sonuç animasyonsuz, sakin görünür.
import { ArrowRight, Printer } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { BantRozeti } from './BantRozeti'
import {
  aralik,
  BANT_ANLAMI,
  BANT_SINIRI,
  DONEM_NOTU,
  DONEM_UYARISI,
  ISABET_OZETI,
  ondalik,
  PARAMETRE_ADI,
  PROFESYONEL_YOL,
  SISTEM_KABULU,
  TABLO_KAYNAGI,
  tamsayi,
  TEKIL_BINA_KAYDI,
  tehlikeFarkiNotu,
  ZEMIN_ADI,
} from './metinler'
import { katkiSatirlari, type Sonuc } from './sonuc'
import { TdthGirisi } from './TdthGirisi'

const g3 = ondalik(3)

interface Props {
  sonuc: Sonuc
  /** TDTH rehberindeki koordinat: [boylam, enlem]. */
  merkez: [number, number]
  onTdth: (ss: number | null) => void
  onYazdir: () => void
}

export function SonucKarti({ sonuc, merkez, onTdth, onYazdir }: Props) {
  const { d, tam } = sonuc
  const { bant, yayilim } = d.bant
  const satirlar = katkiSatirlari(d)
  const ikiUc = d.kotu.pp !== d.iyi.pp
  const bolge =
    d.tehlike.bolgeKotu === d.tehlike.bolgeIyi
      ? d.tehlike.bolgeKotu
      : `${d.tehlike.bolgeKotu}–${d.tehlike.bolgeIyi}`

  return (
    <div className="flex flex-col gap-5" data-testid="sonuc-karti">
      <section aria-labelledby="bant-baslik" className="flex flex-col gap-2">
        <h3 id="bant-baslik" className="text-label text-muted-foreground">
          Profesyonel inceleme önceliği
        </h3>
        <p data-testid="bant">
          <BantRozeti bant={bant} />
        </p>
        <p className="text-body-sm text-pretty">{BANT_ANLAMI[bant]}</p>
        <dl className="grid grid-cols-[1fr_auto] items-baseline gap-x-3 gap-y-1 border-t border-border pt-2">
          <dt className="text-body-sm text-muted-foreground">Performans puanı (PP)</dt>
          <dd className="text-right font-mono text-mono-md tabular-nums" data-testid="pp-araligi">
            {aralik(d.kotu.pp, d.iyi.pp)}
          </dd>
          <dd className="col-span-2 font-mono text-mono-sm text-muted-foreground">
            Bant sınırı: {BANT_SINIRI[bant]} · RYTEİE Ek-A, Denklem A2.1
          </dd>
        </dl>
        {yayilim.length > 1 && (
          <p className="text-body-sm text-pretty text-uncertainty">
            Puan aralığı {yayilim.length} önceliğe yayılıyor; öncelik aralığın elverişsiz ucundan seçildi.
          </p>
        )}
      </section>

      <section aria-labelledby="katki-baslik">
        <h3 id="katki-baslik" className="text-label text-muted-foreground">
          Puan nasıl oluştu
        </h3>
        <table className="mt-2 w-full text-body-sm">
          <caption className="sr-only">
            Kalem kalem puan katkısı{ikiUc ? '; elverişsiz ve elverişli uç ayrı sütunda' : ''}
          </caption>
          <thead className="text-label text-muted-foreground">
            <tr className="border-b border-border">
              <th scope="col" className="py-1 text-left font-medium">
                Kalem
              </th>
              <th scope="col" className="py-1 text-right font-medium">
                {ikiUc ? 'Elverişsiz' : 'Katkı'}
              </th>
              {ikiUc && (
                <th scope="col" className="py-1 pl-2 text-right font-medium">
                  Elverişli
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {satirlar.map((s) => {
              const farkli = s.kotu !== s.iyi
              return (
                <tr key={s.parametre} className="border-b border-border/60">
                  <th scope="row" className="py-1 pr-2 text-left font-normal">
                    {PARAMETRE_ADI[s.parametre]}
                    {s.parametre === 'tabanPuani' && (
                      <span className="text-muted-foreground">
                        {' '}
                        ({tam.cevaplar.kat} kat, bölge {bolge})
                      </span>
                    )}
                  </th>
                  <td
                    className={cn(
                      'py-1 text-right font-mono text-mono-sm tabular-nums',
                      farkli && 'text-uncertainty',
                    )}
                  >
                    {tamsayi.format(s.kotu)}
                  </td>
                  {ikiUc && (
                    <td
                      className={cn(
                        'py-1 pl-2 text-right font-mono text-mono-sm tabular-nums',
                        farkli && 'text-uncertainty',
                      )}
                    >
                      {tamsayi.format(s.iyi)}
                    </td>
                  )}
                </tr>
              )
            })}
          </tbody>
          <tfoot>
            <tr>
              <th scope="row" className="pt-1.5 text-left font-medium">
                Toplam (PP)
              </th>
              <td className="pt-1.5 text-right font-mono text-mono-md tabular-nums">
                {tamsayi.format(d.kotu.pp)}
              </td>
              {ikiUc && (
                <td className="pt-1.5 pl-2 text-right font-mono text-mono-md tabular-nums">
                  {tamsayi.format(d.iyi.pp)}
                </td>
              )}
            </tr>
          </tfoot>
        </table>
        <p className="mt-1.5 font-mono text-mono-sm text-muted-foreground">{TABLO_KAYNAGI[d.yontem]}</p>
      </section>

      <section aria-labelledby="belirsizlik-baslik" className="flex flex-col gap-2">
        <h3 id="belirsizlik-baslik" className="text-label text-muted-foreground">
          Belirsizlik
        </h3>
        <dl className="grid grid-cols-[1fr_auto] items-baseline gap-x-3 gap-y-1">
          <dt className="text-body-sm text-muted-foreground">
            Kısa periyot ivmesi S<sub>S</sub>
          </dt>
          <dd className="text-right font-mono text-mono-sm tabular-nums" data-testid="ss-kullanilan">
            {aralik(d.tehlike.ssAraligi![0], d.tehlike.ssAraligi![1], g3)} g
          </dd>
          <dt className="text-body-sm text-muted-foreground">
            Tasarım ivmesi S<sub>DS</sub>
          </dt>
          <dd className="text-right font-mono text-mono-sm tabular-nums">
            {aralik(d.tehlike.sdsAraligi[0], d.tehlike.sdsAraligi[1], g3)} g
          </dd>
          <dd className="col-span-2 text-body-sm text-pretty text-muted-foreground">
            {d.tehlike.kaynak === 'tdth'
              ? 'Kaynak: AFAD Türkiye Deprem Tehlike Haritası, girdiğiniz değer (DD-2).'
              : `Kaynak: ESHM20 Avrupa modeli. ${tehlikeFarkiNotu(sonuc)}; resmî değeri girerseniz aralık kalkar.`}{' '}
            Zemin: {ZEMIN_ADI(tam.zemin)}.
          </dd>
        </dl>
        {d.belirsiz.length > 0 && (
          <p className="text-body-sm text-pretty">
            “Bilmiyorum” dediğiniz {d.belirsiz.length} soru puanı iki uca açıyor:{' '}
            {d.belirsiz.map((p) => PARAMETRE_ADI[p]).join(', ')}.
          </p>
        )}
        {(tam.yontem === 'betonarme' ? tam.cevaplar.sistem : tam.cevaplar.tur) === 'bilmiyorum' && (
          <p className="text-body-sm text-pretty text-muted-foreground">{SISTEM_KABULU[tam.yontem]}</p>
        )}
        {tam.malzemeVarsayildi && (
          <p className="text-body-sm text-pretty text-muted-foreground">
            Taşıyıcı malzeme bilinmediği için bina betonarme varsayıldı. Bina yığmaysa bu sonuç geçerli
            değildir.
          </p>
        )}
        <TdthGirisi merkez={merkez} ssEshm20={sonuc.ssEshm20} tdthSs={sonuc.tdthSs} onTdth={onTdth} />
      </section>

      <section aria-labelledby="okuma-baslik" className="flex flex-col gap-2">
        <h3 id="okuma-baslik" className="text-label text-muted-foreground">
          Bu sonucu nasıl okumalı
        </h3>
        <p className="text-body-sm text-pretty">{ISABET_OZETI[d.yontem]}</p>
        <p className="text-body-sm text-pretty text-muted-foreground">{TEKIL_BINA_KAYDI}</p>
        <a
          href={`${import.meta.env.BASE_URL}yontem.html`}
          className="inline-flex items-center gap-1 self-start text-body-sm text-primary underline-offset-4 hover:underline"
        >
          Yöntem ve isabet
          <ArrowRight className="size-3.5" aria-hidden="true" />
        </a>
      </section>

      {tam.donem && tam.donem !== 'bilmiyorum' && (
        <section aria-labelledby="donem-baslik" className="flex flex-col gap-1">
          <h3 id="donem-baslik" className="text-label text-muted-foreground">
            Yapım dönemi
          </h3>
          <p className="text-body-sm text-pretty">{DONEM_NOTU[tam.donem]}</p>
          <p className="text-body-sm text-pretty text-muted-foreground">{DONEM_UYARISI}</p>
        </section>
      )}

      <section aria-labelledby="yol-baslik" className="flex flex-col gap-2">
        <h3 id="yol-baslik" className="text-label text-muted-foreground">
          Sonraki adım
        </h3>
        <p className="text-body-sm text-pretty">{PROFESYONEL_YOL}</p>
        <Button className="h-11" onClick={onYazdir}>
          <Printer data-icon="inline-start" />
          Raporu yazdır ya da PDF kaydet
        </Button>
      </section>
    </div>
  )
}
