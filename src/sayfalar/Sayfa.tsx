// Bilgi sayfalarının ortak kabuğu (Yöntem ve isabet, Veri ve lisanslar, Profesyonel inceleme, Hakkında). Harita yok; DESIGN.md gereği
// arkaplan hafif gradient mesh, gezinme çubuğu cam. Uzun metin düz zeminde, satır boyu ~65 karakter.
import type { ReactNode } from 'react'
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
  children: ReactNode
}

export function Sayfa({ etkin, baslik, giris, children }: Props) {
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
          className="mx-auto flex max-w-3xl flex-wrap items-center gap-x-4 gap-y-1 px-4 py-2"
        >
          <a href={kok} className="flex min-h-11 w-full items-center text-headline sm:mr-auto sm:w-auto">
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

      <main id="icerik" tabIndex={-1} className="mx-auto max-w-3xl px-4 pt-10 pb-16 outline-none">
        <h1 className="text-display text-balance">{baslik}</h1>
        <div className="mt-4 max-w-prose text-body-md text-pretty text-muted-foreground">{giris}</div>
        <div className="mt-10 flex flex-col gap-12">{children}</div>
      </main>

      <footer className="border-t border-border">
        <p className="mx-auto max-w-3xl px-4 py-6 text-body-sm text-pretty text-muted-foreground">
          YapiRisk’in sonucu bina hakkında hüküm değil, profesyonel inceleme önceliğidir.{' '}
          <a href={kok} className="text-primary underline-offset-4 hover:underline">
            Haritaya dön
          </a>
        </p>
      </footer>
    </div>
  )
}

export function Bolum({ id, baslik, children }: { id: string; baslik: string; children: ReactNode }) {
  return (
    <section aria-labelledby={id} className="flex max-w-prose flex-col gap-3">
      <h2 id={id} className="text-headline text-balance">
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
