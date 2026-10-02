// Değerlendirme formu: her adımda tek soru, yerel radyo düğmeleriyle (ok tuşları, Tab, Enter = İleri).
// Adım değişince odak sorunun başlığına gider; ekran okuyucu yeni soruyu okur.
import { ArrowLeft, ArrowRight, Map as HaritaIkonu } from 'lucide-react'
import { useEffect, useId, useRef, useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { Sonuc } from '@/sonuc/sonuc'
import { KapsamDisiEkrani } from './KapsamDisiEkrani'
import { Ozet } from './Ozet'
import { KAT_SEVIYESI, SORULAR, type Soru } from './sorular'
import { adimlar, cevaplandi, istegeBagli, kapsamDisi, type Taslak } from './taslak'
import { TemizleDugmesi } from './TemizleDugmesi'

interface Props {
  taslak: Taslak
  adim: number
  /** Cevaplar tamam ve bina bölge içindeyse sonuç; değilse null. */
  sonuc: Sonuc | null
  /** Seçili binanın konumu [boylam, enlem]; seçim yoksa null. */
  merkez: [number, number] | null
  onTaslak: (t: Taslak) => void
  onAdim: (a: number) => void
  onHaritaya: () => void
  onTemizle: () => void
  onTdth: (ss: number | null) => void
  onYazdir: () => void
  /** Değerlendirmeyi taşıyan bağlantı (#paylas); seçim yoksa null. */
  paylasimAdresi: string | null
}

export function Form(p: Props) {
  const { taslak, adim, onTaslak, onAdim, onHaritaya, onTemizle } = p
  const [hata, setHata] = useState(false)
  const [kapsamGoster, setKapsamGoster] = useState(false)
  const baslikRef = useRef<HTMLHeadingElement>(null)

  // Adım değişince odak yeni başlığa (ilk açılışta da: form düğmeyle açılır, odak eski yerde kalmasın).
  useEffect(() => {
    baslikRef.current?.focus()
  }, [adim, kapsamGoster])

  const git = (a: number) => {
    setHata(false)
    setKapsamGoster(false)
    onAdim(a)
  }

  const kapsam = kapsamDisi(taslak)
  const liste = adimlar(taslak)
  const ozette = adim >= liste.length
  const ad = liste[Math.min(adim, liste.length - 1)]

  const ileri = (e: FormEvent) => {
    e.preventDefault()
    if (!istegeBagli(ad) && !cevaplandi(taslak, ad)) {
      setHata(true)
      return
    }
    if (kapsam && (ad === 'malzeme' || ad === 'kat')) {
      setHata(false)
      setKapsamGoster(true)
      return
    }
    git(adim + 1)
  }

  const ust = (
    <div className="flex items-center justify-between gap-2">
      <Button type="button" variant="ghost" className="-ml-2 h-11" onClick={onHaritaya}>
        <HaritaIkonu data-icon="inline-start" />
        Haritaya dön
      </Button>
      <TemizleDugmesi onTemizle={onTemizle} />
    </div>
  )

  if (kapsamGoster && kapsam)
    return (
      <div className="flex flex-col gap-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        {ust}
        <KapsamDisiEkrani
          neden={kapsam}
          baslikRef={baslikRef}
          onDegistir={() => git(liste.indexOf(kapsam === 'kat' || kapsam === 'yigmaKat' ? 'kat' : 'malzeme'))}
        />
      </div>
    )

  if (ozette)
    return (
      <div className="flex flex-col gap-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        {ust}
        <Ozet
          taslak={taslak}
          sonuc={p.sonuc}
          merkez={p.merkez}
          baslikRef={baslikRef}
          onGit={git}
          onHaritaya={onHaritaya}
          onTdth={p.onTdth}
          onYazdir={p.onYazdir}
          paylasimAdresi={p.paylasimAdresi}
        />
      </div>
    )

  const soru = SORULAR[ad]
  const altSoru = ad === 'nizam' && (taslak.nizam === 'bitisik' || taslak.nizam === 'kosede')
  const eksik = altSoru && taslak.katSeviyesi === undefined ? KAT_SEVIYESI : soru
  const sonAdim = adim === liste.length - 1

  return (
    <form className="flex flex-1 flex-col gap-4" onSubmit={ileri} noValidate>
      {ust}
      <div>
        <p className="text-label text-muted-foreground tabular-nums">
          Soru {adim + 1} / {liste.length}
          {istegeBagli(ad) && ' · isteğe bağlı'}
        </p>
        <div className="mt-2 h-1 rounded-full bg-border" aria-hidden="true">
          <div
            className="h-full rounded-full bg-primary"
            style={{ width: `${((adim + 1) / liste.length) * 100}%` }}
          />
        </div>
      </div>

      <SoruAlani
        soru={soru}
        taslak={taslak}
        onTaslak={(t) => {
          setHata(false)
          onTaslak(t)
        }}
        baslikRef={baslikRef}
        zorunlu={!istegeBagli(ad)}
        hata={hata && eksik === soru}
      />
      {altSoru && (
        <SoruAlani
          soru={KAT_SEVIYESI}
          taslak={taslak}
          onTaslak={(t) => {
            setHata(false)
            onTaslak(t)
          }}
          zorunlu
          hata={hata && eksik === KAT_SEVIYESI}
        />
      )}

      <div className="sticky bottom-0 -mx-4 mt-auto flex gap-2 border-t border-border bg-surface px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:rounded-b-lg">
        <Button
          type="button"
          variant="outline"
          className="h-11 flex-1"
          onClick={() => (adim === 0 ? onHaritaya() : git(adim - 1))}
        >
          <ArrowLeft data-icon="inline-start" />
          Geri
        </Button>
        <Button type="submit" className="h-11 flex-[2]">
          {sonAdim ? 'Cevapları gözden geçir' : istegeBagli(ad) && !cevaplandi(taslak, ad) ? 'Atla' : 'İleri'}
          <ArrowRight data-icon="inline-end" />
        </Button>
      </div>
    </form>
  )
}

interface SoruAlaniProps {
  soru: Soru
  taslak: Taslak
  onTaslak: (t: Taslak) => void
  baslikRef?: React.Ref<HTMLHeadingElement>
  zorunlu: boolean
  hata: boolean
}

function SoruAlani({ soru, taslak, onTaslak, baslikRef, zorunlu, hata }: SoruAlaniProps) {
  const id = useId()
  const secili = soru.oku(taslak)
  const secenekler =
    soru.bilmiyorum === false
      ? soru.secenekler
      : [...soru.secenekler, { deger: 'bilmiyorum', etiket: 'Bilmiyorum', aciklama: soru.bilmiyorum }]

  return (
    <fieldset className="min-w-0 space-y-3" aria-describedby={cn(`${id}-ipucu`, hata && `${id}-hata`)}>
      <legend>
        <h2 ref={baslikRef} tabIndex={-1} className="text-headline text-balance outline-none">
          {soru.soru}
        </h2>
      </legend>
      <p id={`${id}-ipucu`} className="text-body-sm text-pretty text-muted-foreground">
        {soru.ipucu}
      </p>

      {soru.ornekler && (
        <div className="grid grid-cols-2 gap-2">
          {soru.ornekler.map(({ cizim: Cizim, aciklama }) => (
            <figure key={aciklama} className="rounded-md border border-border p-2">
              <div className="mx-auto max-w-32 text-foreground/80">
                <Cizim />
              </div>
              <figcaption className="mt-1 text-body-sm text-pretty text-muted-foreground">
                {aciklama}
              </figcaption>
            </figure>
          ))}
        </div>
      )}

      {hata && (
        <p id={`${id}-hata`} role="alert" className="text-body-sm text-pretty text-error">
          {soru.bilmiyorum === false
            ? 'Devam etmek için bir seçenek seçin.'
            : 'Devam etmek için bir seçenek seçin. Emin değilseniz “Bilmiyorum”u seçebilirsiniz.'}
        </p>
      )}

      <div className={cn('grid gap-2', soru.izgara ? 'grid-cols-4' : 'grid-cols-1')}>
        {secenekler.map((s) => {
          const Cizim = 'cizim' in s ? s.cizim : undefined
          const genis = 'genisCizim' in s && s.genisCizim
          return (
            <label
              key={s.deger}
              className={cn(
                'flex cursor-pointer gap-3 rounded-md border border-border bg-background/40 p-3 transition-colors hover:border-muted-foreground/50',
                'has-checked:border-primary has-checked:bg-primary/10 has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-ring',
                soru.izgara ? 'min-h-11 items-center justify-center px-2 py-2' : 'flex-wrap items-start',
                soru.izgara && s.deger === '8+' && 'col-span-4',
              )}
            >
              <input
                type="radio"
                name={`${id}-secim`}
                value={s.deger}
                checked={secili === s.deger}
                onChange={() => onTaslak(soru.yaz(taslak, s.deger))}
                required={zorunlu}
                aria-invalid={hata || undefined}
                aria-labelledby={`${id}-${s.deger}-e`}
                aria-describedby={s.aciklama ? `${id}-${s.deger}-a` : undefined}
                className={cn('size-5 shrink-0 accent-primary', !soru.izgara && 'mt-0.5')}
              />
              <span className={cn('min-w-0', soru.izgara ? 'text-mono-md tabular-nums' : 'flex-1')}>
                <span
                  id={`${id}-${s.deger}-e`}
                  className={cn('block', !soru.izgara && 'text-body-md font-medium')}
                >
                  {s.etiket}
                </span>
                {s.aciklama && (
                  <span
                    id={`${id}-${s.deger}-a`}
                    className="mt-0.5 block text-body-sm text-pretty text-muted-foreground"
                  >
                    {s.aciklama}
                  </span>
                )}
              </span>
              {Cizim && (
                <span className={cn('text-foreground/80', genis ? 'w-full basis-full' : 'w-28 shrink-0')}>
                  <Cizim />
                </span>
              )}
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}
