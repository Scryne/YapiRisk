// Veri ve lisanslar: her kaynağın lisansı, sürümü ve paket dosyalarının sha256 özeti (K-2, K-15).
// Sürüm ve özetler bölge paketindeki kaynak.json'dan; tam lisans metinleri data/LISANSLAR.md.
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

export function Veri() {
  const k = useJson<KaynakPaketi>('manisa/kaynak.json')
  const v = k.durum === 'hazir' ? k.veri : null

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
              tarih: v && `çekim ${gun(v.kaynaklar.eshm20.cekim)}`,
            },
            {
              veri: v ? `Bina ayak izleri (${sayi.format(v.bina.bina)} bina)` : 'Bina ayak izleri',
              kaynak: (
                <a href="https://github.com/microsoft/GlobalMLBuildingFootprints">
                  Microsoft GlobalMLBuildingFootprints
                </a>
              ),
              lisans: 'CDLA Permissive 2.0',
              tarih: v && `sürüm ${gun(v.kaynaklar.microsoft.surum)}`,
            },
            {
              veri: 'Mahalle ve köy dizini, il sınırı',
              kaynak: <a href="https://www.openstreetmap.org/copyright">© OpenStreetMap katkıcıları</a>,
              lisans: 'ODbL 1.0',
              tarih: v && `veri ${gun(v.kaynaklar.osm.osmTarihi)}`,
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
        {k.durum === 'hata' && (
          <p role="alert" className="text-error">
            Sürüm bilgisi yüklenemedi. Bağlantınızı kontrol edip sayfayı yenileyin.
          </p>
        )}
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

      <Bolum id="ozetler" baslik="Dosya özetleri (sha256)">
        {v ? (
          <dl className="flex flex-col gap-2">
            {[...Object.entries(v.dosyalar), ['bina/ (dizin)', v.bina.dizinOzeti] as const].map(
              ([ad, ozet]) => (
                <div key={ad}>
                  <dt className="text-body-sm">{ad}</dt>
                  <dd className="font-mono text-mono-sm break-all text-muted-foreground">{ozet}</dd>
                </div>
              ),
            )}
          </dl>
        ) : (
          <p className="text-muted-foreground">{k.durum === 'hata' ? 'Yüklenemedi.' : 'Yükleniyor'}</p>
        )}
      </Bolum>
    </Sayfa>
  )
}
