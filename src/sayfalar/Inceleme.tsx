// Profesyonel inceleme: YapiRisk'in önceliğinden sonra kesin bilgi için 6306 sayılı Kanun kapsamında riskli yapı
// tespiti. Yalnız birincil kaynakta doğrulanan bilgi yazılır (kontrol 2026-10-02); ücret, kira yardımı, kredi ve
// süre rakamları resmî kaynakta bulunamadığı için yazılmaz, il müdürlüğüne ve ALO 181'e yönlendirilir.
import type { ReactNode } from 'react'
import type { BolgeKaydi } from '@/veri/bolge'
import { useJson } from './json'
import { Bolum, Sayfa, Tablo } from './Sayfa'

const KANUN = 'https://www.mevzuat.gov.tr/mevzuatmetin/1.5.6306.pdf'
const EDEVLET = {
  tespit: 'https://www.turkiye.gov.tr/csb-riskli-yapi-tespiti-4609',
  itiraz: 'https://www.turkiye.gov.tr/csb-ebasvuru-2773',
  kira: 'https://www.turkiye.gov.tr/csb-kentsel-donusum-kira-yardimi-basvurusu-4621',
}
const IZMIR_SSS = 'https://izmir.csb.gov.tr/50-soru-50-cevapta-kentsel-donusum-i-5067'
const YARISI_BIZDEN = 'https://csb.gov.tr/haberler/istanbul-icin-yarisi-bizden-kampanyasi-302278'

const Dis = ({ href, children }: { href: string; children: ReactNode }) => (
  <a href={href} target="_blank" rel="noopener">
    {children}
    <span className="sr-only"> (yeni sekmede açılır)</span>
  </a>
)

export function Inceleme() {
  const b = useJson<{ bolgeler: BolgeKaydi[] }>('bolgeler.json')
  const mudurlukler = b.durum === 'hazir' ? b.veri.bolgeler.filter((k) => k.ilMudurlugu) : []

  return (
    <Sayfa
      etkin="inceleme"
      baslik="Profesyonel inceleme"
      giris={
        <p>
          YapiRisk’in sonucu bir öncelik sırasıdır, binanız hakkında hüküm değildir. Binanızın durumunu kesin
          olarak öğrenmenin yolu, 6306 sayılı Kanun kapsamında yetkili bir kuruluşa riskli yapı tespiti
          yaptırmaktır. Bu sayfa sürecin nasıl işlediğini anlatır.
        </p>
      }
    >
      <Bolum id="kim" baslik="Kim yaptırır, kim öder">
        <p>
          Kanuna göre riskli yapı tespitini öncelikle yapının malikleri ya da kanuni temsilcileri, masrafları
          kendilerine ait olmak üzere, Kentsel Dönüşüm Başkanlığının lisans verdiği kurum ve kuruluşlara
          yaptırır (6306 sayılı Kanun, madde 3). İzmir İl Müdürlüğü’nün açıklamasına göre başvuru için
          binadaki maliklerden birinin talebi yeterlidir; bütün maliklerin onayı gerekmez.
        </p>
        <p>
          Tespit ücreti için resmî bir tarife bulamadık. Ücreti kuruluşlar belirler; birkaç kuruluştan yazılı
          teklif almanızı öneririz.
        </p>
      </Bolum>

      <Bolum id="nasil" baslik="Nasıl başvurulur">
        <ol className="list-decimal pl-5">
          <li>
            Lisanslı bir kuruluş seçin. İlinizdeki kuruluşları Çevre, Şehircilik ve İklim Değişikliği İl
            Müdürlüğü’nden ya da ALO 181’den öğrenebilirsiniz (aşağıda).
          </li>
          <li>
            Başvuruyu e-Devlet’teki <Dis href={EDEVLET.tespit}>Riskli Yapı Tespiti</Dis> hizmetinden yapın.
          </li>
          <li>
            Kuruluş binayı inceler ve sonucu Kentsel Dönüşüm Başkanlığına ya da il müdürlüğüne bildirir.
          </li>
        </ol>
      </Bolum>

      <Bolum id="sonra" baslik="Tespitten sonra">
        <p>
          Bina riskli bulunursa tespite ilişkin tutanak yapıya asılır, maliklere e-Devlet üzerinden bildirilir
          ve muhtarlıkta 15 gün süreyle ilan edilir. İlanın son günü bütün maliklere tebliğ edilmiş sayılır
          (6306 sayılı Kanun, madde 3).
        </p>
        <p>
          Malikler tespite 15 gün içinde itiraz edebilir. İtirazı üniversite öğretim üyeleri ve Bakanlık ya da
          Başkanlık görevlilerinden oluşan teknik heyetler inceler. İtiraz için e-Devlet’te{' '}
          <Dis href={EDEVLET.itiraz}>Riskli Yapı Tespitine İtiraz</Dis> hizmeti vardır.
        </p>
      </Bolum>

      <Bolum id="riskli" baslik="Bina riskli çıkarsa">
        <p>
          Maliklere yapıyı yıktırmaları için 90 günü geçmeyen bir süre verilir; bu sürede yıktırılmayan yapıyı
          idare yıktırır (6306 sayılı Kanun, madde 5).
        </p>
        <p>
          Kanun tahliye edilen yapıların maliklerine, kiracılarına ve orada oturan sınırlı ayni hak
          sahiplerine geçici konut ya da kira yardımı, yapım için yardım ve banka kredilerine faiz desteği
          verilebileceğini söyler (madde 5). Kira yardımı başvurusu e-Devlet’teki{' '}
          <Dis href={EDEVLET.kira}>Riskli Yapı Kira Yardımı Başvurusu</Dis> hizmetinden yapılır. Güncel
          tutarları ve sizin binanıza uygulanacak adımları il müdürlüğüne ya da ALO 181’e sorun; bu sayfada
          tutar vermiyoruz, çünkü güncel değerleri resmî bir kaynakta doğrulayamadık.
        </p>
        <p>
          Bakanlığın “Yarısı Bizden” kampanyası şu anda yalnız İstanbul’daki binalar için geçerlidir (
          <Dis href={YARISI_BIZDEN}>Bakanlık duyurusu</Dis>).
        </p>
      </Bolum>

      <Bolum id="iletisim" baslik="Nereye sorabilirsiniz">
        {b.durum === 'yukleniyor' && (
          <p role="status" className="text-muted-foreground">
            İl müdürlükleri yükleniyor
          </p>
        )}
        {b.durum === 'hata' && (
          <p role="alert" className="text-error">
            İl müdürlüklerinin listesi yüklenemedi. Bağlantınızı kontrol edip sayfayı yenileyin.
          </p>
        )}
        {mudurlukler.length > 0 && (
          <Tablo
            baslik="Çevre, Şehircilik ve İklim Değişikliği İl Müdürlükleri"
            sutunlar={['İl', 'Telefon (santral)', 'Site']}
            satirlar={mudurlukler.map((k) => [
              k.ad,
              <a
                key="t"
                href={`tel:${k.ilMudurlugu!.telefon.replace(/\s/g, '')}`}
                className="whitespace-nowrap"
              >
                {k.ilMudurlugu!.telefon}
              </a>,
              <Dis key="s" href={k.ilMudurlugu!.site}>
                {k.ilMudurlugu!.site.replace('https://', '')}
              </Dis>,
            ])}
          />
        )}
        <p>
          Bakanlığın iletişim merkezi <a href="tel:181">ALO 181</a> her gün 24 saat açıktır.
        </p>
      </Bolum>

      <Bolum id="kaynaklar" baslik="Kaynaklar">
        <ul className="list-disc pl-5">
          <li>
            <Dis href={KANUN}>6306 sayılı Afet Riski Altındaki Alanların Dönüştürülmesi Hakkında Kanun</Dis>,
            madde 3 ve 5 (7471 sayılı Kanunla değişik, 2023).
          </li>
          <li>
            e-Devlet hizmetleri: <Dis href={EDEVLET.tespit}>Riskli Yapı Tespiti</Dis>,{' '}
            <Dis href={EDEVLET.itiraz}>Riskli Yapı Tespitine İtiraz</Dis>,{' '}
            <Dis href={EDEVLET.kira}>Riskli Yapı Kira Yardımı Başvurusu</Dis>.
          </li>
          <li>
            İzmir Çevre, Şehircilik ve İklim Değişikliği İl Müdürlüğü,{' '}
            <Dis href={IZMIR_SSS}>Kentsel dönüşüm: 50 soru 50 cevap</Dis>.
          </li>
          <li>
            İl müdürlüklerinin iletişim sayfaları ve <Dis href="https://alo181.gov.tr">alo181.gov.tr</Dis>.
          </li>
        </ul>
        <p className="text-body-sm text-muted-foreground">Bilgiler 2 Ekim 2026’da kontrol edildi.</p>
      </Bolum>
    </Sayfa>
  )
}
