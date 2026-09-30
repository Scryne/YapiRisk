import { Crosshair, LoaderCircle, MousePointerClick } from 'lucide-react'
import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { MahalleArama } from '@/arama/MahalleArama'
import { Button } from '@/components/ui/button'
import { baglantiOku } from '@/harita/baglanti'
import { geometriIcinde } from '@/harita/geometri'
import { BINA_YAKINLIGI, type HaritaHedefi, type Secim } from '@/harita/tipler'
import { SecimKarti } from '@/panel/SecimKarti'
import { bolgeleriYukle, bolgePaketiYukle, type BolgePaketi } from '@/veri/bolge'
import { bilineer } from '@/yontem/tehlike'

// MapLibre (~1 MB) ayrı parçada; panel ve arama harita yüklenmeden kullanılabilir.
const Harita = lazy(() => import('@/harita/Harita').then((m) => ({ default: m.Harita })))

type Yukleme =
  { durum: 'yukleniyor' } | { durum: 'hata'; mesaj: string } | { durum: 'hazir'; paket: BolgePaketi }

const MAHALLE_YAKINLIGI = 15.5
const KONUM_YAKINLIGI = 17

export default function App() {
  const [yukleme, setYukleme] = useState<Yukleme>({ durum: 'yukleniyor' })
  const [secim, setSecim] = useState<Secim | null>(null)
  const [hedef, setHedef] = useState<HaritaHedefi | null>(null)
  const [noktaModu, setNoktaModu] = useState(false)
  const [yakinlik, setYakinlik] = useState(0)
  const [bosTiklama, setBosTiklama] = useState(false)
  const panelRef = useRef<HTMLElement>(null)
  const [bosluk, setBosluk] = useState({ sol: 0, alt: 0 })

  // Panelin kapladığı kenar: masaüstünde sol, telefonda alt. Harita merkezi kalan alana göre.
  useEffect(() => {
    const panel = panelRef.current
    if (!panel) return
    const genis = window.matchMedia('(min-width: 768px)')
    const olc = () => {
      const r = panel.getBoundingClientRect()
      setBosluk(
        genis.matches
          ? { sol: Math.round(r.right), alt: 0 }
          : { sol: 0, alt: Math.round(window.innerHeight - r.top) },
      )
    }
    olc()
    const gozlemci = new ResizeObserver(olc)
    gozlemci.observe(panel)
    genis.addEventListener('change', olc)
    window.addEventListener('resize', olc)
    return () => {
      gozlemci.disconnect()
      genis.removeEventListener('change', olc)
      window.removeEventListener('resize', olc)
    }
  }, [])

  useEffect(() => {
    let iptal = false
    bolgeleriYukle()
      .then(([ilk]) => bolgePaketiYukle(ilk))
      .then((paket) => {
        if (!iptal) setYukleme({ durum: 'hazir', paket })
      })
      .catch((e: unknown) => !iptal && setYukleme({ durum: 'hata', mesaj: String(e) }))
    return () => {
      iptal = true
    }
  }, [])

  const paket = yukleme.durum === 'hazir' ? yukleme.paket : null
  const hazir = paket !== null

  // Adresteki #konum / #harita: açılışta ve sonradan değişince.
  useEffect(() => {
    if (!hazir) return
    const oku = () => {
      const b = baglantiOku(window.location.hash)
      if (!b) return
      if (b.tip === 'konum') {
        setSecim({ tip: 'nokta', merkez: b.merkez })
        setBosTiklama(false)
      }
      const yakinlik = b.tip === 'konum' ? KONUM_YAKINLIGI : b.yakinlik
      setHedef((h) => ({ merkez: b.merkez, yakinlik, sira: (h?.sira ?? 0) + 1 }))
    }
    oku()
    window.addEventListener('hashchange', oku)
    return () => window.removeEventListener('hashchange', oku)
  }, [hazir])
  const ss = useMemo(() => {
    if (!paket || !secim) return null
    const [boylam, enlem] = secim.merkez
    if (!geometriIcinde(secim.merkez, paket.sinir.geometry)) return null
    return bilineer(paket.tehlike.izgaralar.SS, enlem, boylam)
  }, [paket, secim])

  const sec = (s: Secim) => {
    setSecim(s)
    setNoktaModu(false)
    setBosTiklama(false)
  }

  return (
    // data-yakinlik: harita durduğunda (moveend) güncellenir; uçtan uca testler uçuşun bitmesini bununla bekler.
    <main className="relative h-dvh overflow-hidden bg-background" data-yakinlik={yakinlik.toFixed(1)}>
      {paket && (
        <Suspense>
          <Harita
            paket={paket}
            secim={secim}
            hedef={hedef}
            noktaModu={noktaModu}
            bosluk={bosluk}
            onSecim={sec}
            onBosTiklama={() => setBosTiklama(true)}
            onYakinlik={setYakinlik}
          />
        </Suspense>
      )}

      <aside
        ref={panelRef}
        aria-label="Bina bulma"
        className="absolute inset-x-0 bottom-0 z-10 max-h-[48dvh] overflow-y-auto rounded-t-lg border border-b-0 border-border bg-surface px-4 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] supports-[backdrop-filter]:bg-glass supports-[backdrop-filter]:backdrop-blur-md md:top-4 md:bottom-auto md:left-4 md:max-h-[calc(100dvh-2rem)] md:w-[23rem] md:rounded-lg md:border-b"
      >
        <header className="flex items-baseline justify-between gap-3">
          <h1 className="text-headline">YapiRisk</h1>
          <p className="text-body-sm text-muted-foreground">Deprem riski ön değerlendirmesi</p>
        </header>

        {yukleme.durum === 'yukleniyor' && (
          <p className="mt-4 flex items-center gap-2 text-body-sm text-muted-foreground" role="status">
            <LoaderCircle className="size-4 animate-spin motion-reduce:animate-none" aria-hidden="true" />
            Bölge verisi yükleniyor
          </p>
        )}
        {yukleme.durum === 'hata' && (
          <p className="mt-4 text-body-sm text-pretty text-error" role="alert">
            Bölge verisi yüklenemedi. Bağlantınızı kontrol edip sayfayı yenileyin. ({yukleme.mesaj})
          </p>
        )}

        {paket && (
          <div className="mt-4 flex flex-col gap-3">
            <h2 className="text-label text-balance">1. Binanızı bulun</h2>
            <MahalleArama
              kayitlar={paket.mahalleler}
              bolgeAdi={paket.kayit.ad}
              onSec={(k) => {
                setHedef((h) => ({ merkez: k.konum, yakinlik: MAHALLE_YAKINLIGI, sira: (h?.sira ?? 0) + 1 }))
                setBosTiklama(false)
              }}
            />

            <p className="flex gap-2 text-body-sm text-pretty text-muted-foreground" aria-live="polite">
              <MousePointerClick className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              {noktaModu
                ? 'Haritada binanızın bulunduğu yere dokunun.'
                : yakinlik < BINA_YAKINLIGI
                  ? 'Mahallenizi seçin ya da binaları görene kadar yakınlaştırın.'
                  : bosTiklama
                    ? 'Dokunduğunuz yerde çizili bina yok. Binanız haritada yoksa konumunu nokta olarak seçin.'
                    : 'Binanızın çizimine dokunun.'}
            </p>

            <Button
              variant={noktaModu ? 'default' : 'outline'}
              className="h-11 justify-start"
              aria-pressed={noktaModu}
              onClick={() => setNoktaModu((m) => !m)}
            >
              <Crosshair data-icon="inline-start" />
              {noktaModu ? 'Nokta seçimini iptal et' : 'Binam haritada yok, konumu işaretleyeceğim'}
            </Button>

            {secim && (
              <SecimKarti secim={secim} bolgeAdi={paket.kayit.ad} ss={ss} onKaldir={() => setSecim(null)} />
            )}
          </div>
        )}
      </aside>
    </main>
  )
}
