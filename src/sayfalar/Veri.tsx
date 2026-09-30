// Veri ve lisanslar: her kaynağın lisansı, sürümü ve paket dosyalarının sha256 özeti (K-2, K-15).
// Sürüm ve özetler her bölge paketinin kaynak.json'ından; tam lisans metinleri data/LISANSLAR.md.
import type { BolgeKaydi } from '@/veri/bolge'
import { useJson } from './json'
import { Bolum, Sayfa } from './Sayfa'

interface KaynakPaketi {
  bina: { bina: number; parca: number; dizinOzeti: string }
  dosyalar: Record<string, string>
  kaynaklar: {
    eshm20: { cekim: string }
    microsoft: { surum: string; cekim: string }
    osm: { osmTarihi: string }
  }
}

const tarih = new Intl.DateTimeFormat('tr-TR', { dateStyle: 'long' })
const gun = (iso: string) => tarih.format(new Date(iso.slice(0, 10) + 'T12:00:00Z'))
const sayi = new Intl.NumberFormat('tr-TR')
const kok = import.meta.env.BASE_URL

/** Bir bölge paketinin sürüm bilgisi ve dosya özetleri. */
function BolgePaketi({ kayit }: { kayit: BolgeKaydi }) {
  const k = useJson<KaynakPaketi>(`${kayit.kimlik}/kaynak.json`)
  if (k.durum !== 'hazir')
    return (
      <p className={k.durum === 'hata' ? 'text-error' : 'text-muted-foreground'}>
        {k.durum === 'hata' ? `${kayit.ad} paketi yüklenemedi.` : 'Yükleniyor'}
      </p>
    )
  const v = k.veri
  return (
    <section aria-labelledby={`paket-${kayit.kimlik}`} className="flex flex-col gap-2">
      <h3 id={`paket-${kayit.kimlik}`} className="text-body-md font-medium">
        {kayit.ad}
      </h3>
      <ul className="list-disc pl-5 text-body-sm">
        <li>
          {sayi.format(v.bina.bina)} bina ayak izi, Microsoft sürümü {gun(v.kaynaklar.microsoft.surum)}
        </li>
        <li>ESHM20 çekimi {gun(v.kaynaklar.eshm20.cekim)}</li>
        <li>OpenStreetMap verisi {gun(v.kaynaklar.osm.osmTarihi)}</li>
      </ul>
      <dl className="flex flex-col gap-2">
        {[...Object.entries(v.dosyalar), ['bina/ (dizin)', v.bina.dizinOzeti] as const].map(([ad, ozet]) => (
          <div key={ad}>
            <dt className="text-body-sm">{ad}</dt>
            <dd className="font-mono text-mono-sm break-all text-muted-foreground">{ozet}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

export function Veri() {
  const b = useJson<{ bolgeler: BolgeKaydi[] }>('bolgeler.json')

  return (
    <Sayfa
      etkin="veri"
      baslik="Veri ve lisanslar"
      giris={
        <p>
          YapiRisk’teki her sayı açık bir kaynaktan gelir. Veri paketi tek komutla yeniden üretilir ve her
          dosyanın özeti aşağıdadır; aynı kaynaktan üretilen paket bayt bayt aynı çıkar.
        </p>
      }
    >
      <Bolum id="kaynaklar" baslik="Veri kaynakları">
        <ul className="flex flex-col divide-y divide-border border-y border-border">
          {[
            {
              veri: (
                <>
                  Deprem tehlikesi (S<sub>S</sub>, S<sub>1</sub>, PGA)
                </>
              ),
              kaynak: <a href="https://doi.org/10.12686/a15">ESHM20, EFEHR</a>,
              lisans: 'CC BY 4.0',
            },
            {
              veri: 'Bina ayak izleri',
              kaynak: (
                <a href="https://github.com/microsoft/GlobalMLBuildingFootprints">
                  Microsoft GlobalMLBuildingFootprints
                </a>
              ),
              lisans: 'CDLA Permissive 2.0',
            },
            {
              veri: 'Mahalle ve köy dizini, il sınırı',
              kaynak: <a href="https://www.openstreetmap.org/copyright">© OpenStreetMap katkıcıları</a>,
              lisans: 'ODbL 1.0',
            },
            {
              veri: 'İsabet ölçümü (yalnız özet sayılar)',
              kaynak: <a href="https://zenodo.org/records/13386343">ACI 133, Hariri-Ardebili 2024</a>,
              lisans: 'CC BY 4.0',
              tarih: '2023 depremi',
            },
          ].map((k, i) => (
            <li key={i} className="py-3">
              <p className="font-medium">{k.veri}</p>
              <p className="text-body-sm text-muted-foreground">
                {k.kaynak} · {k.lisans}
                {k.tarih && ` · ${k.tarih}`}
              </p>
            </li>
          ))}
        </ul>
        <p>
          Değişiklikler ve lisansların tam metni: <a href={`${kok}data/LISANSLAR.md`}>LISANSLAR.md</a>. ESHM20
          değerleri Avrupa modelinin kaya değerleridir; AFAD Türkiye Deprem Tehlike Haritası’nın resmî
          değerleri değildir.
        </p>
      </Bolum>

      <Bolum id="yonetmelik" baslik="Yönetmelik tabloları ve çizimler">
        <p>
          Puan tabloları RYTEİE 2019 Ek-A’dan (Resmî Gazete, 16 Şubat 2019, sayı 30688), zemin katsayıları
          Türkiye Bina Deprem Yönetmeliği 2018 Tablo 2.1 ve 2.2’den hücre hücre okundu. Formdaki çizimler
          yönetmeliğin Şekil A.1’inden yeniden çizildi. Resmî Gazete’de yayımlanan düzenleyici metinlerin
          çoğaltılması ve işlenmesi Fikir ve Sanat Eserleri Kanunu’nun 31. maddesiyle serbesttir.
        </p>
      </Bolum>

      <Bolum id="harita" baslik="Harita">
        <ul className="list-disc pl-5">
          <li>
            Taban harita: <a href="https://openfreemap.org">OpenFreeMap</a>, ©{' '}
            <a href="https://www.openmaptiles.org/">OpenMapTiles</a>, ©{' '}
            <a href="https://www.openstreetmap.org/copyright">OpenStreetMap katkıcıları</a>.
          </li>
          <li>
            Uydu görüntüsü (isteğe bağlı, varsayılan kapalı):{' '}
            <a href="https://www.maptiler.com/copyright/">© MapTiler</a> ve görüntü sağlayıcıları. Açıldığında
            harita üzerinde MapTiler logosu ve atfı görünür.
          </li>
        </ul>
      </Bolum>

      <Bolum id="yazi-tipi" baslik="Yazı tipi">
        <p>
          IBM Plex Sans ve IBM Plex Mono, SIL Open Font License 1.1. Uygulamayla birlikte sunulur; yazı tipi
          için başka bir sunucuya istek gitmez.
        </p>
      </Bolum>

      <Bolum id="paketler" baslik="Bölge paketleri ve dosya özetleri (sha256)">
        {b.durum === 'hazir' ? (
          b.veri.bolgeler.map((kayit) => <BolgePaketi key={kayit.kimlik} kayit={kayit} />)
        ) : (
          <p role={b.durum === 'hata' ? 'alert' : 'status'} className="text-muted-foreground">
            {b.durum === 'hata'
              ? 'Bölge listesi yüklenemedi. Bağlantınızı kontrol edip sayfayı yenileyin.'
              : 'Yükleniyor'}
          </p>
        )}
      </Bolum>
    </Sayfa>
  )
}
