// Bilgi sayfalarının ortak kabuğu (Yöntem ve isabet, Veri ve lisanslar, Profesyonel inceleme, Hakkında). Harita yok; DESIGN.md gereği
// arkaplan hafif gradient mesh, gezinme çubuğu cam. Uzun metin düz zeminde, satır boyu ~65 karakter.
//
// Uzun sayfada okurun yerini kaybetmemesi için: geniş ekranda sağda yapışkan "Bu sayfada" listesi (etkin bölüm
// işaretli), dar ekranda girişin altında açılır liste. Liste bölüm başlıklarından üretilir; elle tutulmaz.
import { useEffect, useState, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

export type SayfaAdi = 'yontem' | 'veri' | 'inceleme' | 'hakkinda'

const SAYFALAR: { ad: SayfaAdi; etiket: string }[] = [
  { ad: 'yontem', etiket: 'Yöntem ve isabet' },
  { ad: 'veri', etiket: 'Veri ve lisanslar' },
  { ad: 'inceleme', etiket: 'Profesyonel inceleme' },
  { ad: 'hakkinda', etiket: 'Hakkında' },
]

const kok = import.meta.env.BASE_URL

interface Props {
  etkin: SayfaAdi
  baslik: string
  giris: ReactNode
  /** Girişin altında öne çıkan sayılar (isteğe bağlı). */
  kisaca?: ReactNode
  children: ReactNode
}

interface Baslik {
  id: string
  metin: string
}

function useBolumler(): { bolumler: Baslik[]; etkin: string | null } {
  const [bolumler, setBolumler] = useState<Baslik[]>([])
  const [etkin, setEtkin] = useState<string | null>(null)

  useEffect(() => {
    const topla = () =>
      [...document.querySelectorAll<HTMLHeadingElement>('#icerik section > h2[id]')].map((h) => ({
        id: h.id,
        metin: h.textContent ?? '',
      }))
    // İlk toplama bir sonraki turda (render bittikten sonra); içerik JSON'dan geç gelirse yarım saniye sonra bir
    // kez daha.
    const ilk = window.setTimeout(() => setBolumler(topla()), 0)
    const ikinci = window.setTimeout(() => setBolumler(topla()), 500)
    return () => {
      window.clearTimeout(ilk)
      window.clearTimeout(ikinci)
    }
  }, [])

  useEffect(() => {
    if (bolumler.length === 0 || typeof IntersectionObserver === 'undefined') return
    const gozlemci = new IntersectionObserver(
      (girdiler) => {
        const gorunen = girdiler
          .filter((g) => g.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (gorunen[0]) setEtkin(gorunen[0].target.id)
      },
      { rootMargin: '-80px 0px -65% 0px' },
    )
    for (const b of bolumler) {
      const el = document.getElementById(b.id)
      if (el) gozlemci.observe(el)
    }
    return () => gozlemci.disconnect()
  }, [bolumler])

  return { bolumler, etkin }
}

function Icindekiler({ bolumler, etkin }: { bolumler: Baslik[]; etkin: string | null }) {
  return (
    <ol className="flex flex-col gap-0.5 border-l border-border">
      {bolumler.map((b) => (
        <li key={b.id}>
          <a
            href={`#${b.id}`}
            aria-current={etkin === b.id ? 'location' : undefined}
            className={cn(
              '-ml-px block border-l-2 border-transparent py-1.5 pl-3 text-body-sm text-muted-foreground',
              'hover:text-foreground aria-[current=location]:border-primary aria-[current=location]:text-foreground',
            )}
          >
            {b.metin}
          </a>
        </li>
      ))}
    </ol>
  )
}

export function Sayfa({ etkin, baslik, giris, kisaca, children }: Props) {
  const { bolumler, etkin: etkinBolum } = useBolumler()

  return (
    <div className="zemin-mesh min-h-dvh">
      <a
        href="#icerik"
        className="sr-only z-20 rounded-md bg-primary px-3 py-2 text-label text-on-primary focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
      >
        İçeriğe geç
      </a>
      <header className="sticky top-0 z-10 border-b border-border bg-surface supports-[backdrop-filter]:bg-glass supports-[backdrop-filter]:backdrop-blur-md">
        <nav
          aria-label="Sayfalar"
          className="mx-auto flex max-w-4xl flex-wrap items-center gap-x-4 gap-y-1 px-4 py-2"
        >
          <a
            href={kok}
            className="flex min-h-11 w-full items-center gap-2 text-headline sm:mr-auto sm:w-auto"
          >
            <img src={`${kok}favicon.svg`} alt="" width={22} height={22} className="size-[22px]" />
            YapiRisk
          </a>
          {SAYFALAR.map((s) => (
            <a
              key={s.ad}
              href={`${kok}${s.ad}.html`}
              aria-current={s.ad === etkin ? 'page' : undefined}
              className={cn(
                'flex min-h-11 items-center text-body-sm text-muted-foreground underline-offset-4 hover:text-foreground',
                'aria-[current=page]:text-foreground aria-[current=page]:underline',
              )}
            >
              {s.etiket}
            </a>
          ))}
        </nav>
      </header>

      <div className="mx-auto grid max-w-4xl gap-10 px-4 pt-10 pb-16 lg:grid-cols-[minmax(0,1fr)_13rem]">
        <main id="icerik" tabIndex={-1} className="min-w-0 outline-none">
          <h1 className="text-display text-balance">{baslik}</h1>
          <div className="mt-4 max-w-prose text-body-md text-pretty text-muted-foreground">{giris}</div>
          {kisaca && <div className="mt-6 max-w-prose">{kisaca}</div>}
          {bolumler.length > 2 && (
            <details className="mt-6 max-w-prose rounded-lg border border-border bg-surface/60 px-4 py-2 lg:hidden">
              <summary className="flex min-h-11 cursor-pointer items-center text-label">Bu sayfada</summary>
              <nav aria-label="Bu sayfada" className="pb-2">
                <Icindekiler bolumler={bolumler} etkin={etkinBolum} />
              </nav>
            </details>
          )}
          <div className="mt-10 flex flex-col gap-12">{children}</div>
        </main>

        {bolumler.length > 2 && (
          <aside className="hidden lg:block">
            <nav aria-label="Bu sayfada" className="sticky top-24">
              <p className="mb-2 text-label text-muted-foreground">Bu sayfada</p>
              <Icindekiler bolumler={bolumler} etkin={etkinBolum} />
            </nav>
          </aside>
        )}
      </div>

      <footer className="border-t border-border bg-surface/60">
        <div className="mx-auto grid max-w-4xl gap-6 px-4 py-8 text-body-sm text-muted-foreground sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <p className="text-label text-foreground">YapiRisk</p>
            <p className="text-pretty">
              Sonuç bina hakkında hüküm değil, profesyonel inceleme önceliğidir. Kesin değerlendirme ancak
              yerinde yapılan mühendislik incelemesiyle olur.
            </p>
            <a href={kok} className="text-primary underline-offset-4 hover:underline">
              Haritaya dön
            </a>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-label text-foreground">Dayanak</p>
            <ul className="flex flex-col gap-1">
              <li>RYTEİE 2019 Ek-A (resmî hızlı değerlendirme)</li>
              <li>ESHM20 deprem tehlike modeli</li>
              <li>Microsoft bina ayak izleri, OpenStreetMap</li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  )
}

/** Girişin altındaki öne çıkan sayılar: değer mono, açıklama düz; en çok 4 kutu. */
export function Kisaca({ ogeler }: { ogeler: { deger: ReactNode; etiket: ReactNode }[] }) {
  return (
    <dl className="grid grid-cols-2 gap-3">
      {ogeler.map((o, i) => (
        <div
          key={i}
          className="flex flex-col-reverse justify-end rounded-lg border border-border bg-surface/70 px-3 py-3"
        >
          <dt className="mt-1 text-body-sm text-pretty text-muted-foreground">{o.etiket}</dt>
          <dd className="font-mono text-mono-md text-foreground tabular-nums">{o.deger}</dd>
        </div>
      ))}
    </dl>
  )
}

export function Bolum({ id, baslik, children }: { id: string; baslik: string; children: ReactNode }) {
  return (
    <section aria-labelledby={id} className="flex max-w-prose scroll-mt-24 flex-col gap-3">
      <h2 id={id} className="scroll-mt-24 text-headline text-balance">
        {baslik}
      </h2>
      <div className="flex flex-col gap-3 text-body-md text-pretty [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4">
        {children}
      </div>
    </section>
  )
}

/** Sade veri tablosu: sayılar mono ve sağa hizalı. */
export function Tablo({
  baslik,
  sutunlar,
  satirlar,
  sayisal = [],
}: {
  baslik: string
  sutunlar: string[]
  satirlar: ReactNode[][]
  /** Sağa hizalı, mono sütunların sırası. */
  sayisal?: number[]
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-body-sm">
        <caption className="mb-2 text-left text-label text-muted-foreground">{baslik}</caption>
        <thead>
          <tr className="border-b border-border">
            {sutunlar.map((s, i) => (
              <th
                key={s}
                scope="col"
                className={cn('py-1.5 pr-3 font-medium', sayisal.includes(i) ? 'text-right' : 'text-left')}
              >
                {s}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {satirlar.map((satir, r) => (
            <tr key={r} className="border-b border-border/60">
              {satir.map((h, i) =>
                i === 0 ? (
                  <th key={i} scope="row" className="py-1.5 pr-3 text-left font-normal">
                    {h}
                  </th>
                ) : (
                  <td
                    key={i}
                    className={cn(
                      'py-1.5 pr-3',
                      sayisal.includes(i) && 'text-right font-mono text-mono-sm tabular-nums',
                    )}
                  >
                    {h}
                  </td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
