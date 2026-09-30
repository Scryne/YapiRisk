import { Crosshair, LoaderCircle, MousePointerClick, Satellite } from 'lucide-react'
import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { MahalleArama } from '@/arama/MahalleArama'
import { Button } from '@/components/ui/button'
import { Form } from '@/form/Form'
import { kayitOku, kayitSil, kayitYaz } from '@/form/kayit'
import { TemizleDugmesi } from '@/form/TemizleDugmesi'
import { ADIMLAR, bosMu, bosTaslak, type Taslak } from '@/form/taslak'
import { cn } from '@/lib/utils'
import { Rapor } from '@/sonuc/Rapor'
import { sonucHesapla } from '@/sonuc/sonuc'
import { baglantiOku } from '@/harita/baglanti'
import { BINA_YAKINLIGI, type HaritaHedefi, type Secim } from '@/harita/tipler'
import { UYDU_ANAHTARI } from '@/harita/uydu'
import { SecimKarti } from '@/panel/SecimKarti'
import { adlarListesi, bolgeBul, tumBolgeleriYukle, type BolgePaketi } from '@/veri/bolge'
import { bilineer } from '@/yontem/tehlike'

// MapLibre (~1 MB) ayrı parçada; panel ve arama harita yüklenmeden kullanılabilir.
const Harita = lazy(() => import('@/harita/Harita').then((m) => ({ default: m.Harita })))

type Yukleme =
  { durum: 'yukleniyor' } | { durum: 'hata'; mesaj: string } | { durum: 'hazir'; paketler: BolgePaketi[] }

const MAHALLE_YAKINLIGI = 15.5
const KONUM_YAKINLIGI = 17

/** TDTH değeri girildiği konuma aittir; seçim değişince kendiliğinden düşer. */
const konumAnahtari = (s: Secim | null) => (s ? s.merkez.join(',') : '')

export default function App() {
  const [yukleme, setYukleme] = useState<Yukleme>({ durum: 'yukleniyor' })
  // Önceki ziyaretten kalan değerlendirme (yalnız bu tarayıcıda, K-1).
  const [ilkKayit] = useState(kayitOku)
  const [secim, setSecim] = useState<Secim | null>(ilkKayit?.secim ?? null)
  const [taslak, setTaslak] = useState<Taslak>(ilkKayit?.taslak ?? bosTaslak())
  const [adim, setAdim] = useState(ilkKayit?.adim ?? 0)
  const [formda, setFormda] = useState(false)
  const [tdth, setTdth] = useState(() =>
    ilkKayit?.tdthSs ? { ss: ilkKayit.tdthSs, anahtar: konumAnahtari(ilkKayit.secim) } : null,
  )
  const tdthSs = tdth && tdth.anahtar === konumAnahtari(secim) ? tdth.ss : null
  // Form kapanınca (Haritaya dön, Temizle) odak kaldırılan düğmede kalmasın: devam düğmesine ya da başlığa.
  const [odakIstegi, setOdakIstegi] = useState(0)
  const devamRef = useRef<HTMLButtonElement>(null)
  const bulBaslikRef = useRef<HTMLHeadingElement>(null)
  const [hedef, setHedef] = useState<HaritaHedefi | null>(() =>
    ilkKayit?.secim ? { merkez: ilkKayit.secim.merkez, yakinlik: KONUM_YAKINLIGI, sira: 1 } : null,
  )
  const [noktaModu, setNoktaModu] = useState(false)
  const [yakinlik, setYakinlik] = useState(0)
  const [bosTiklama, setBosTiklama] = useState(false)
  const [uydu, setUydu] = useState(false)
  const [uyduHatasi, setUyduHatasi] = useState(false)
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
    tumBolgeleriYukle()
      .then((paketler) => {
        if (!iptal) setYukleme({ durum: 'hazir', paketler })
      })
      .catch((e: unknown) => !iptal && setYukleme({ durum: 'hata', mesaj: String(e) }))
    return () => {
      iptal = true
    }
  }, [])

  // Değerlendirme değiştikçe tarayıcıya yazılır; boşsa kayıt tutulmaz.
  useEffect(() => {
    if (secim === null && adim === 0 && bosMu(taslak)) kayitSil()
    else kayitYaz({ secim, taslak, adim, tdthSs })
  }, [secim, taslak, adim, tdthSs])

  useEffect(() => {
    if (odakIstegi) (devamRef.current ?? bulBaslikRef.current)?.focus()
  }, [odakIstegi])

  const haritaya = () => {
    setFormda(false)
    setOdakIstegi((n) => n + 1)
  }

  const temizle = () => {
    kayitSil()
    setSecim(null)
    setTaslak(bosTaslak())
    setAdim(0)
    setTdth(null)
    haritaya()
  }

  const paketler = yukleme.durum === 'hazir' ? yukleme.paketler : null
  const hazir = paketler !== null
  const mahalleler = useMemo(() => paketler?.flatMap((p) => p.mahalleler) ?? [], [paketler])
  const adlar = useMemo(() => paketler?.map((p) => p.kayit.ad) ?? [], [paketler])

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
  // Seçilen noktayı sınırı içine alan bölge; tehlike o bölgenin ızgarasından okunur.
  const secimBolgesi = useMemo(
    () => (paketler && secim ? bolgeBul(paketler, secim.merkez) : null),
    [paketler, secim],
  )
  const ss = useMemo(() => {
    if (!secimBolgesi || !secim) return null
    const [boylam, enlem] = secim.merkez
    return bilineer(secimBolgesi.tehlike.izgaralar.SS, enlem, boylam)
  }, [secimBolgesi, secim])

  const sonuc = useMemo(
    () =>
      sonucHesapla(
        taslak,
        ss,
        tdthSs,
        secimBolgesi?.kayit ?? null,
        paketler?.map((p) => p.kayit),
      ),
    [taslak, ss, tdthSs, secimBolgesi, paketler],
  )

  const sec = (s: Secim) => {
    setSecim(s)
    setNoktaModu(false)
    setBosTiklama(false)
  }

  return (
    <>
      {/* data-yakinlik: harita durduğunda (moveend) güncellenir; uçtan uca testler uçuşun bitmesini bununla bekler. */}
      <main
        className="relative h-dvh overflow-hidden bg-background print:hidden"
        data-yakinlik={yakinlik.toFixed(1)}
      >
        {paketler && (
          <Suspense>
            <Harita
              paketler={paketler}
              secim={secim}
              hedef={hedef}
              noktaModu={noktaModu}
              uydu={uydu}
              onUyduHatasi={() => {
                setUydu(false)
                setUyduHatasi(true)
              }}
              bosluk={bosluk}
              onSecim={sec}
              onBosTiklama={() => setBosTiklama(true)}
              onYakinlik={setYakinlik}
            />
          </Suspense>
        )}

        {paketler && UYDU_ANAHTARI && (
          <button
            type="button"
            aria-pressed={uydu}
            aria-label="Uydu görünümü"
            title="Uydu görünümü"
            onClick={() => {
              setUydu((u) => !u)
              setUyduHatasi(false)
            }}
            className="absolute top-24 right-2.5 z-10 flex size-9 items-center justify-center rounded-sm border border-border bg-surface text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring aria-pressed:bg-primary aria-pressed:text-primary-foreground"
          >
            <Satellite className="size-5" aria-hidden="true" />
          </button>
        )}
        {uydu && (
          // MapTiler ücretsiz planı logoyu şart koşar; dosya bizden servis edilir.
          <a
            href="https://www.maptiler.com/"
            target="_blank"
            rel="noopener"
            className="absolute left-2.5 z-10 md:bottom-2.5 md:left-[25rem]"
            style={{ bottom: bosluk.alt ? bosluk.alt + 10 : undefined }}
          >
            <img src={`${import.meta.env.BASE_URL}maptiler-logo.svg`} alt="MapTiler" width={67} height={20} />
          </a>
        )}

        <aside
          ref={panelRef}
          aria-label={formda ? 'Değerlendirme' : 'Bina bulma'}
          className={cn(
            'absolute inset-x-0 bottom-0 z-10 overflow-y-auto rounded-t-lg border border-b-0 border-border bg-surface px-4 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] supports-[backdrop-filter]:bg-glass supports-[backdrop-filter]:backdrop-blur-md md:top-4 md:bottom-auto md:left-4 md:max-h-[calc(100dvh-2rem)] md:w-[23rem] md:rounded-lg md:border-b',
            // Telefonda form sabit yükseklikte: adımlar arasında panel ve harita merkezi zıplamasın.
            formda ? 'flex h-[78dvh] flex-col pb-0 md:h-auto' : 'max-h-[48dvh]',
          )}
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

          {paketler && formda && (
            <div className="mt-2 flex flex-1 flex-col">
              <Form
                taslak={taslak}
                adim={adim}
                sonuc={sonuc}
                merkez={secim?.merkez ?? null}
                onTaslak={setTaslak}
                onAdim={setAdim}
                onHaritaya={haritaya}
                onTemizle={temizle}
                onTdth={(ss) => setTdth(ss === null ? null : { ss, anahtar: konumAnahtari(secim) })}
                onYazdir={() => window.print()}
              />
            </div>
          )}

          {paketler && !formda && (
            <div className="mt-4 flex flex-col gap-3">
              <h2 ref={bulBaslikRef} tabIndex={-1} className="text-label text-balance outline-none">
                1. Binanızı bulun
              </h2>
              <MahalleArama
                kayitlar={mahalleler}
                bolgeAdi={adlar.join(' ')}
                onSec={(k) => {
                  setHedef((h) => ({
                    merkez: k.konum,
                    yakinlik: MAHALLE_YAKINLIGI,
                    sira: (h?.sira ?? 0) + 1,
                  }))
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

              {uydu && (
                <p className="text-body-sm text-pretty text-muted-foreground">
                  Uydu görüntüsü MapTiler&apos;dan yükleniyor; baktığınız bölge MapTiler&apos;a iletilir.
                  Kapatmak için uydu düğmesine yeniden dokunun.
                </p>
              )}
              {uyduHatasi && (
                <p className="text-body-sm text-pretty text-error" role="alert">
                  Uydu görüntüsü şu an alınamıyor. Koyu haritayla devam edebilirsiniz.
                </p>
              )}

              {secim && (
                <SecimKarti
                  secim={secim}
                  bolgeAdi={adlarListesi(adlar)}
                  ss={ss}
                  onKaldir={() => setSecim(null)}
                />
              )}

              {secim && ss !== null && (
                <>
                  <h2 className="mt-1 text-label text-balance">2. Binanızı tanımlayın</h2>
                  <Button ref={devamRef} className="h-11" onClick={() => setFormda(true)}>
                    {bosMu(taslak)
                      ? 'Sorulara başla'
                      : adim >= ADIMLAR.length
                        ? 'Cevaplarımı göster'
                        : `Sorulara devam et (${adim + 1} / ${ADIMLAR.length})`}
                  </Button>
                </>
              )}
              {!bosMu(taslak) && (
                <TemizleDugmesi onTemizle={temizle} className="h-11 justify-start self-start" />
              )}

              <nav
                aria-label="Bilgi sayfaları"
                className="flex flex-wrap gap-x-4 border-t border-border pt-1"
              >
                {[
                  ['yontem', 'Yöntem ve isabet'],
                  ['veri', 'Veri ve lisanslar'],
                  ['hakkinda', 'Hakkında'],
                ].map(([ad, etiket]) => (
                  <a
                    key={ad}
                    href={`${import.meta.env.BASE_URL}${ad}.html`}
                    className="flex min-h-11 items-center text-body-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                  >
                    {etiket}
                  </a>
                ))}
              </nav>
            </div>
          )}
        </aside>
      </main>
      {sonuc && secim && secimBolgesi && (
        <Rapor sonuc={sonuc} secim={secim} taslak={taslak} bolgeAdi={secimBolgesi.kayit.ad} />
      )}
    </>
  )
}
