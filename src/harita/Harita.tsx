import 'maplibre-gl/dist/maplibre-gl.css'
import type { Feature } from 'geojson'
import * as maplibregl from 'maplibre-gl'
// MapLibre worker'ını kendi dosyasının yanında arar; Vite onu paketlemez. Worker ayrı modül olarak
// paketlenir ve adresi verilir (Final-Doküman'daki "MapLibre worker tuzağı").
import isciAdresi from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url'
import type { GeoJSONSource, MapMouseEvent } from 'maplibre-gl'
import { useEffect, useEffectEvent, useRef } from 'react'
import type { BolgePaketi } from '@/veri/bolge'
import { gorunenParcalar, ParcaOnbellegi, type BinaCokgeni } from '@/veri/parca'
import { BINA_YAKINLIGI, type HaritaHedefi, type Secim } from './tipler'
import { UYDU_ANAHTARI, uyduKaynagi } from './uydu'
import { cokgenMerkezi } from './geometri'

// Taban harita: OpenFreeMap (anahtarsız). Uygulamanın dışarıya yaptığı tek istek budur (K-1).
const STIL = 'https://tiles.openfreemap.org/styles/dark'
maplibregl.setWorkerUrl(isciAdresi)
const EN_COK_PARCA = 48

interface Props {
  /** Kayıttaki bütün bölgeler; binalar ve sınırlar birlikte çizilir. */
  paketler: BolgePaketi[]
  secim: Secim | null
  hedef: HaritaHedefi | null
  noktaModu: boolean
  /** Uydu katmanı açık mı (anahtar yoksa etkisiz). */
  uydu: boolean
  /** Uydu karoları alınamadı (kota, anahtar, ağ). */
  onUyduHatasi: () => void
  /** Panelin kapladığı kenar (px); harita merkezi görünen alana göre hesaplanır. */
  bosluk: { sol: number; alt: number }
  onSecim: (secim: Secim) => void
  onBosTiklama: () => void
  onYakinlik: (yakinlik: number) => void
}

const dolgu = (b: { sol: number; alt: number }) => ({ top: 0, right: 0, left: b.sol, bottom: b.alt })

const renk = (ad: string) => getComputedStyle(document.documentElement).getPropertyValue(ad).trim()

export function Harita({
  paketler,
  secim,
  hedef,
  noktaModu,
  uydu,
  bosluk,
  onSecim,
  onBosTiklama,
  onYakinlik,
  onUyduHatasi,
}: Props) {
  const kapRef = useRef<HTMLDivElement>(null)
  const haritaRef = useRef<maplibregl.Map | null>(null)
  const boslukRef = useRef(bosluk)
  const uyduOrtenler = useRef<string[]>([])
  useEffect(() => {
    boslukRef.current = bosluk
  })
  // Harita olayları her zaman güncel prop'ları görür, harita yeniden kurulmaz.
  const yakinlikBildir = useEffectEvent((z: number) => onYakinlik(z))
  const tiklandi = useEffectEvent(
    (merkez: [number, number], bina: Omit<Extract<Secim, { tip: 'bina' }>, 'tip'> | null) => {
      if (noktaModu) onSecim({ tip: 'nokta', merkez })
      else if (bina) onSecim({ tip: 'bina', ...bina })
      else onBosTiklama()
    },
  )

  // Harita bir kez kurulur; bölge kaydı değişirse yeniden. Açılışta bütün bölgeler görünür.
  useEffect(() => {
    const kutular = paketler.map((p) => p.kayit.sinirKutusu)
    const [bmin, emin, bmax, emax] = [
      Math.min(...kutular.map((k) => k[0])),
      Math.min(...kutular.map((k) => k[1])),
      Math.max(...kutular.map((k) => k[2])),
      Math.max(...kutular.map((k) => k[3])),
    ]
    const harita = new maplibregl.Map({
      container: kapRef.current!,
      style: STIL,
      bounds: [bmin, emin, bmax, emax],
      // Panelin kapladığı kenar da boşluğa eklenir; iller panelin altında kalmasın.
      fitBoundsOptions: {
        padding: {
          top: 24,
          right: 24,
          bottom: 24 + boslukRef.current.alt,
          left: 24 + boslukRef.current.sol,
        },
      },
      maxBounds: [
        [bmin - 0.6, emin - 0.4],
        [bmax + 0.6, emax + 0.4],
      ],
      attributionControl: {
        compact: true,
        customAttribution: 'Bina ayak izi: Microsoft (CDLA Permissive 2.0) · Tehlike: ESHM20 (CC BY 4.0)',
      },
      locale: {
        'Map.Title': 'Harita',
        'NavigationControl.ZoomIn': 'Yakınlaştır',
        'NavigationControl.ZoomOut': 'Uzaklaştır',
        'AttributionControl.ToggleAttribution': 'Veri kaynaklarını göster ya da gizle',
      },
      dragRotate: false,
      pitchWithRotate: false,
      touchPitch: false,
    })
    harita.touchZoomRotate.disableRotation()
    harita.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right')
    haritaRef.current = harita

    const onbellekler = new Map(paketler.map((p) => [p.kayit.kimlik, new ParcaOnbellegi(p.kayit.kimlik)]))
    const cokgenler = new Map<string, BinaCokgeni>()
    let istek = 0

    async function binalariGuncelle() {
      const sira = ++istek
      yakinlikBildir(harita.getZoom())
      const kaynak = harita.getSource<GeoJSONSource>('binalar')
      if (!kaynak) return
      if (harita.getZoom() < BINA_YAKINLIGI) {
        kaynak.setData({ type: 'FeatureCollection', features: [] })
        return
      }
      const b = harita.getBounds()
      const gorunen = { bati: b.getWest(), guney: b.getSouth(), dogu: b.getEast(), kuzey: b.getNorth() }
      // İl sınırındaki bir karo iki bölgede de bulunabilir; her biri kendi ilinin binalarını taşır.
      const parcalar = paketler
        .flatMap((p) =>
          gorunenParcalar(p.binaDizini, gorunen).map(([x, y]) => ({ bolge: p.kayit.kimlik, x, y })),
        )
        .slice(0, EN_COK_PARCA)
      const yuklenen = await Promise.all(
        parcalar.map(async ({ bolge, x, y }) => ({
          bolge,
          x,
          y,
          binalar: await onbellekler
            .get(bolge)!
            .al(x, y)
            .catch(() => []),
        })),
      )
      if (sira !== istek) return
      cokgenler.clear()
      const features: Feature[] = []
      for (const { bolge, x, y, binalar } of yuklenen) {
        binalar.forEach((cokgen, i) => {
          const anahtar = `${bolge}/${x}/${y}/${i}`
          cokgenler.set(anahtar, cokgen)
          features.push({
            type: 'Feature',
            properties: { anahtar },
            geometry: { type: 'Polygon', coordinates: cokgen },
          })
        })
      }
      kaynak.setData({ type: 'FeatureCollection', features })
    }

    harita.on('load', () => {
      const [cizgi, vurgu, soluk] = [
        renk('--color-text-muted'),
        renk('--color-primary'),
        renk('--color-text'),
      ]
      // Taban haritanın OSM binaları Microsoft ayak izleriyle çakışır; dokunulacak tek çizim bizimki olsun.
      if (harita.getLayer('building')) harita.removeLayer('building')
      if (UYDU_ANAHTARI) {
        // Taban haritanın ilk etiket katmanının altına: yol ve yer adları görüntünün üstünde kalır.
        const katmanlar = harita.getStyle().layers
        const ilk = katmanlar.findIndex((k) => k.type === 'symbol')
        harita.addSource('uydu', uyduKaynagi(UYDU_ANAHTARI))
        harita.addLayer(
          { id: 'uydu', type: 'raster', source: 'uydu', layout: { visibility: 'none' } },
          katmanlar[ilk]?.id,
        )
        // Etiketlerle iç içe gelen yol/alan katmanları görüntüyü örter; uydu açıkken gizlenir.
        uyduOrtenler.current = katmanlar
          .slice(ilk)
          .filter((k) => k.type === 'line' || k.type === 'fill' || k.type === 'fill-extrusion')
          .map((k) => k.id)
      }
      harita.addSource('sinir', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: paketler.map((p) => p.sinir) },
      })
      harita.addLayer({
        id: 'sinir',
        type: 'line',
        source: 'sinir',
        paint: { 'line-color': cizgi, 'line-width': 1.5, 'line-dasharray': [3, 2], 'line-opacity': 0.8 },
      })
      harita.addSource('binalar', { type: 'geojson', data: { type: 'FeatureCollection', features: [] } })
      harita.addLayer({
        id: 'bina-dolgu',
        type: 'fill',
        source: 'binalar',
        paint: { 'fill-color': soluk, 'fill-opacity': 0.14 },
      })
      harita.addLayer({
        id: 'bina-cizgi',
        type: 'line',
        source: 'binalar',
        paint: { 'line-color': soluk, 'line-opacity': 0.45, 'line-width': 0.8 },
      })
      harita.addSource('secim', { type: 'geojson', data: { type: 'FeatureCollection', features: [] } })
      harita.addLayer({
        id: 'secim-dolgu',
        type: 'fill',
        source: 'secim',
        filter: ['==', ['geometry-type'], 'Polygon'],
        paint: { 'fill-color': vurgu, 'fill-opacity': 0.35 },
      })
      harita.addLayer({
        id: 'secim-cizgi',
        type: 'line',
        source: 'secim',
        filter: ['==', ['geometry-type'], 'Polygon'],
        paint: { 'line-color': vurgu, 'line-width': 2.5 },
      })
      harita.addLayer({
        id: 'secim-nokta',
        type: 'circle',
        source: 'secim',
        filter: ['==', ['geometry-type'], 'Point'],
        paint: {
          'circle-radius': 7,
          'circle-color': vurgu,
          'circle-stroke-color': renk('--color-background'),
          'circle-stroke-width': 2,
        },
      })
      void binalariGuncelle()
    })
    harita.on('moveend', () => void binalariGuncelle())
    // Telefonda atıf açık başlar ve haritanın üstünü kaplar. MapLibre onu ancak ilk sürüklemede kapatır;
    // ilk çizimden sonra biz kapatırız, (i) düğmesiyle açılır (ODbL atfı erişilebilir kalır).
    harita.once('idle', () => {
      const atif = kapRef.current?.querySelector('.maplibregl-ctrl-attrib.maplibregl-compact')
      atif?.classList.remove('maplibregl-compact-show')
      atif?.removeAttribute('open')
    })

    harita.on('click', (e: MapMouseEvent) => {
      const merkez: [number, number] = [e.lngLat.lng, e.lngLat.lat]
      // Stil yüklenmeden gelen dokunuşta katman henüz yok; sorgu hata fırlatır.
      const [ozellik] = harita.getLayer('bina-dolgu')
        ? harita.queryRenderedFeatures(e.point, { layers: ['bina-dolgu'] })
        : []
      const anahtar = ozellik?.properties?.anahtar as string | undefined
      const cokgen = anahtar ? cokgenler.get(anahtar) : undefined
      tiklandi(merkez, anahtar && cokgen ? { anahtar, merkez: cokgenMerkezi(cokgen[0]), cokgen } : null)
    })
    harita.on('mouseenter', 'bina-dolgu', () => (harita.getCanvas().style.cursor = 'pointer'))
    harita.on('mouseleave', 'bina-dolgu', () => (harita.getCanvas().style.cursor = ''))

    return () => {
      istek++
      harita.remove()
      haritaRef.current = null
    }
  }, [paketler])

  useEffect(() => {
    const harita = haritaRef.current
    if (!harita) return
    // setPadding haritayı zıplatır ve süren uçuşu keser (telefonda arama listesi kapanınca panel küçülür).
    const uygula = () => harita.setPadding(dolgu({ sol: bosluk.sol, alt: bosluk.alt }))
    if (harita.isMoving()) harita.once('moveend', uygula)
    else uygula()
  }, [bosluk.sol, bosluk.alt])

  // Uydu açıkken bina dolgusu görüntüyü örtmesin; çizgi belirginleşir.
  const uyduHatasi = useEffectEvent(() => onUyduHatasi())
  useEffect(() => {
    const harita = haritaRef.current
    if (!harita || !UYDU_ANAHTARI) return
    const uygula = () => {
      if (!harita.getLayer('uydu')) return false
      harita.setLayoutProperty('uydu', 'visibility', uydu ? 'visible' : 'none')
      for (const id of uyduOrtenler.current) {
        harita.setLayoutProperty(id, 'visibility', uydu ? 'none' : 'visible')
      }
      harita.setPaintProperty('bina-dolgu', 'fill-opacity', uydu ? 0.04 : 0.14)
      harita.setPaintProperty('bina-cizgi', 'line-opacity', uydu ? 0.85 : 0.45)
      harita.setPaintProperty('bina-cizgi', 'line-width', uydu ? 1.2 : 0.8)
      return true
    }
    if (!uygula()) harita.once('load', uygula)
    const hata = (e: maplibregl.ErrorEvent & { sourceId?: string }) => {
      if (uydu && e.sourceId === 'uydu') uyduHatasi()
    }
    harita.on('error', hata)
    return () => {
      harita.off('error', hata)
    }
  }, [uydu])

  // Nokta modunda imleç artı işareti.
  useEffect(() => {
    const harita = haritaRef.current
    if (harita) harita.getCanvasContainer().style.cursor = noktaModu ? 'crosshair' : ''
  }, [noktaModu])

  // Seçim katmanı.
  useEffect(() => {
    const harita = haritaRef.current
    if (!harita) return
    const guncelle = () => {
      const kaynak = harita.getSource<GeoJSONSource>('secim')
      if (!kaynak) return false
      kaynak.setData({
        type: 'FeatureCollection',
        features: !secim
          ? []
          : [
              {
                type: 'Feature',
                properties: {},
                geometry:
                  secim.tip === 'bina'
                    ? { type: 'Polygon', coordinates: secim.cokgen }
                    : { type: 'Point', coordinates: secim.merkez },
              },
            ],
      })
      return true
    }
    if (!guncelle()) harita.once('load', guncelle)
  }, [secim])

  // Hedefe uçuş (mahalle seçimi, bağlantıdaki konum).
  useEffect(() => {
    const harita = haritaRef.current
    if (!harita || !hedef) return
    // essential verilmediği için MapLibre prefers-reduced-motion'da animasyonsuz atlar.
    harita.flyTo({ center: hedef.merkez, zoom: hedef.yakinlik, padding: dolgu(boslukRef.current) })
  }, [hedef])

  // MapLibre CSS'i katmansız ve kabı `position: relative` yapar; Tailwind konumu sarmalayıcıda kalır.
  return (
    <div className="absolute inset-0">
      {/* Erişilebilir ad ve rolü MapLibre verir ("Harita", locale). */}
      <div ref={kapRef} className="size-full" />
    </div>
  )
}
