// Hakkında, feragat ve aydınlatma: YapiRisk ne değildir, veriler nereye gider (K-1, K-16).
import { PROFESYONEL_YOL, TEKIL_BINA_KAYDI } from '@/sonuc/metinler'
import { adlarListesi, bulunma, type BolgeKaydi } from '@/veri/bolge'
import { useJson } from './json'
import { Bolum, Sayfa } from './Sayfa'

const kok = import.meta.env.BASE_URL

export function Hakkinda() {
  const b = useJson<{ bolgeler: BolgeKaydi[] }>('bolgeler.json')
  // İl adları bölge kaydından (K-3); yüklenene kadar genel ifade.
  const iller = b.durum === 'hazir' ? adlarListesi(b.veri.bolgeler.map((k) => k.ad)) : null
  return (
    <Sayfa
      etkin="hakkinda"
      baslik="Hakkında"
      giris={
        <p>
          YapiRisk, {iller ? bulunma(iller) + 'ki' : 'kapsadığı illerdeki'} betonarme ve yığma binalar için
          deprem riskinin ön değerlendirmesini yapar: binanızı haritada bulursunuz, dışarıdan bakarak
          cevaplanabilen soruları cevaplarsınız, resmî bir yöntemle hesaplanan profesyonel inceleme önceliğini
          görürsünüz.
        </p>
      }
    >
      <Bolum id="ne-degil" baslik="Ne değildir">
        <p>
          YapiRisk’in sonucu bir yapı tespiti, rapor ya da resmî belge değildir. Bir binanın depremde nasıl
          davranacağı hakkında hüküm vermez; yalnız profesyonel incelemede sıranın neresinde olduğunu
          gösterir.
        </p>
        <p>{TEKIL_BINA_KAYDI}</p>
        <p>{PROFESYONEL_YOL}</p>
        <p>
          YapiRisk bilgilendirme amaçlıdır. Sonucuna dayanarak verilen kararlardan, formdaki cevapların
          doğruluğundan ve veri kaynaklarındaki hatalardan doğan sonuçlardan sorumluluk kabul edilmez.
          Yöntemin sınırları <a href={`${kok}yontem.html`}>Yöntem ve isabet</a> sayfasındadır.
        </p>
      </Bolum>

      <Bolum id="aydinlatma" baslik="Verileriniz nereye gider">
        <p>
          YapiRisk’in bir sunucusu yok. Seçtiğiniz bina, cevaplarınız ve girdiğiniz değerler yalnız bu
          tarayıcıda saklanır; yeniden açtığınızda kaldığınız yerden devam edebilesiniz diye. Bağlantı olmadan
          da çalışsın diye uygulama dosyaları ve baktığınız bölgenin harita ve bina parçaları da bu
          tarayıcının önbelleğinde tutulur. “Temizle” düğmesi cevaplarınızı ve baktığınız bölgenin önbelleğini
          siler. Hesap yok, çerez yok, ziyaret istatistiği tutulmaz. Rapor da tarayıcınızda üretilir.
        </p>
        <p>Tarayıcınızın bizim dışımızda istek gönderdiği yerler:</p>
        <ul className="list-disc pl-5">
          <li>
            <strong className="font-medium">Harita karoları:</strong>{' '}
            <a href="https://openfreemap.org">OpenFreeMap</a>. Haritada baktığınız bölgenin karoları buradan
            yüklenir; bu sunucu IP adresinizi ve hangi karoları istediğinizi görür. Seçtiğiniz bina ve
            cevaplarınız gönderilmez.
          </li>
          <li>
            <strong className="font-medium">Uydu görüntüsü (isteğe bağlı):</strong> uydu düğmesine basarsanız
            baktığınız bölgenin görüntüleri <a href="https://www.maptiler.com/privacy-policy/">MapTiler</a>
            ’dan yüklenir. Varsayılan olarak kapalıdır; açmadıkça MapTiler’a istek gitmez.
          </li>
          <li>
            <strong className="font-medium">AFAD Türkiye Deprem Tehlike Haritası:</strong> sonuç ekranındaki
            bağlantıya tıklarsanız AFAD’ın sitesine gidersiniz. Oradan aldığınız değeri YapiRisk’e siz elle
            girersiniz; iki site arasında veri aktarılmaz.
          </li>
        </ul>
        <p>
          Mahalle araması da tarayıcıda, uygulamayla gelen dizinde yapılır; yazdığınız arama bir yere
          gönderilmez.
        </p>
      </Bolum>

      <Bolum id="kapsam" baslik="Kapsam">
        <p>
          Şimdilik yalnız {iller ?? 'kapsanan illerin'} {iller ? 'için veri var' : 'verisi var'}. Yöntem 1–7
          serbest katlı betonarme ve 1–5 serbest katlı yığma binalar içindir; çelik ve prefabrik binalar, 8 ya
          da daha fazla katlı betonarme ve 6 ya da daha fazla katlı yığma binalar değerlendirilmez.
        </p>
      </Bolum>
    </Sayfa>
  )
}
