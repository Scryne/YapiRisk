// Yöntem ve isabet (K-6): ne ölçüldüğü, nasıl hesaplandığı ve 2023 depreminde ne kadar tuttuğu.
// İsabet sayıları public/data/dogrulama.json'dan (boru hattı üretir); tehlike karşılaştırması spike/S1.
import type { ReactNode } from 'react'
import { BantRozeti } from '@/sonuc/BantRozeti'
import { ondalik, TEKIL_BINA_KAYDI } from '@/sonuc/metinler'
import type { Bant } from '@/yontem/bant'
import { S1_BANDI } from '@/yontem/tehlike'
import { useJson } from './json'
import { Bolum, Sayfa, Tablo } from './Sayfa'

interface BantOrani {
  bant: Bant
  n: number
  agirHasar: number
  oran: number | null
}
interface Dogrulama {
  auc: Record<
    'ryteie_ham' | 'ryteie_ortalama' | 'kat_sayisi' | 'yas' | 'yumusak_kat' | 'hassan_sozen',
    number
  >
  nToplam: number
  nKapsam: number
  pozitif: number
  katDagilimi: Record<string, number>
  bantlar: { bacVarsayimiyla: BantOrani[]; perdeVerisiyle: BantOrani[] }
  veri: { ad: string; yazar: string; lisans: string; url: string }
}

const iki = ondalik(2)
const uc = ondalik(3)
const yuzde = new Intl.NumberFormat('tr-TR', { style: 'percent', maximumFractionDigits: 0 })

const Sayi = ({ children }: { children: ReactNode }) => (
  <span className="font-mono text-mono-sm tabular-nums">{children}</span>
)

function bantTablosu(baslik: string, satirlar: BantOrani[]) {
  return (
    <Tablo
      baslik={baslik}
      sutunlar={['Öncelik', 'Bina', 'Ağır hasar ve üstü', 'Oran']}
      sayisal={[1, 2, 3]}
      satirlar={satirlar.map((s) => [
        <BantRozeti key={s.bant} bant={s.bant} kucuk />,
        s.n,
        s.agirHasar,
        s.oran === null ? '—' : yuzde.format(s.oran),
      ])}
    />
  )
}

export function Yontem() {
  const d = useJson<Dogrulama>('dogrulama.json')

  return (
    <Sayfa
      etkin="yontem"
      baslik="Yöntem ve isabet"
      giris={
        <p>
          YapiRisk, Çevre, Şehircilik ve İklim Değişikliği Bakanlığı’nın resmî hızlı değerlendirme yöntemini
          (RYTEİE 2019 Ek-A) binaya dışarıdan bakılarak cevaplanabilen sorularla uygular. Bu sayfa hesabın
          nasıl yapıldığını ve 2023 depreminde ne kadar tuttuğunu anlatır.
        </p>
      }
    >
      <Bolum id="ne-olcuyor" baslik="Ne ölçüyor">
        <p>
          Yöntem her binaya bir performans puanı (PP) verir: taban puanı, perde duvar varsa eklenen puan ve
          gözlenen her kusur için düşülen puanların toplamıdır (RYTEİE Denklem A2.1). Taban puanı kat sayısına
          ve binanın bulunduğu yerin deprem tehlikesine göre Tablo A.1’den okunur; kusur puanları Tablo A.3 ve
          A.4’tedir.
        </p>
        <p>
          Puan ne kadar düşükse bina profesyonel incelemede o kadar öne alınmalıdır. Resmî metin bir eşik
          vermez; puanlar büyükten küçüğe sıralanır (A.2.1.8). {TEKIL_BINA_KAYDI}
        </p>
        <p>
          Kapsam: betonarme, 1–7 serbest katlı binalar. Yığma, çelik, prefabrik ve 8 ya da daha fazla katlı
          binalar bu yöntemle değerlendirilmez.
        </p>
      </Bolum>

      <Bolum id="tehlike" baslik="Deprem tehlikesi">
        <p>
          Yöntem, binanın konumundaki tasarım ivmesini (S<sub>DS</sub>, 475 yıllık deprem, DD-2) zemin
          sınıfıyla birlikte dört tehlike bölgesine çevirir (Tablo A.2). Resmî değer AFAD’ın Türkiye Deprem
          Tehlike Haritası’ndadır, ama haritanın açık bir veri servisi yok. YapiRisk bu yüzden varsayılan
          olarak Avrupa modelini (ESHM20) kullanır.
        </p>
        <p>
          İki modeli Manisa ve İzmir’de 10’ar ilçe merkezinde, toplam 20 noktada karşılaştırdık: ESHM20’nin S
          <sub>S</sub> değeri AFAD’ınkinin en az <Sayi>{iki.format(S1_BANDI.altOran)}</Sayi>, en çok{' '}
          <Sayi>{iki.format(S1_BANDI.ustOran)}</Sayi> katı çıktı (ortalama Manisa’da <Sayi>0,89</Sayi>,
          İzmir’de <Sayi>0,98</Sayi>). Yalnız ESHM20’ye bakılsaydı 20 noktanın 4’ünde tehlike bölgesi AFAD’a
          göre daha düşük tehlikeli bir bölgeye düşerdi. YapiRisk bu yüzden ESHM20 değerini bu oran aralığıyla
          bir aralığa açar; 20 noktanın hepsinde AFAD’ın değeri aralığın içinde kaldı. AFAD raporundaki S
          <sub>S</sub> değerini girerseniz aralık kalkar.
        </p>
        <p>
          Zemin katsayısı Türkiye Bina Deprem Yönetmeliği (2018) Tablo 2.1’den gelir. Zemin sınıfını
          bilmiyorsanız ZC, ZD ve ZE içinden sonucu en elverişsiz yapan kullanılır.
        </p>
      </Bolum>

      <Bolum id="bilmiyorum" baslik="“Bilmiyorum” cevapları">
        <p>
          Perde sorusu bilinmiyorsa yönetmelik gereği perdesiz çerçeve kabul edilir (A.2.1.1). Diğer sorularda
          “Bilmiyorum”, puanı iki uca açar: kusur varmış gibi hesaplanan elverişsiz uç ve yokmuş gibi
          hesaplanan elverişli uç. Deprem tehlikesi aralığı da bu iki uca katılır. Öncelik elverişsiz uçtan
          seçilir; belirsizlik sizi daha sonraki sıraya değil, daha önceki sıraya taşır.
        </p>
      </Bolum>

      <Bolum id="bantlar" baslik="Üç öncelik bandı">
        <Tablo
          baslik="Bant sınırları"
          sutunlar={['Öncelik', 'Performans puanı']}
          sayisal={[1]}
          satirlar={[
            [<BantRozeti key="y" bant="yuksek" kucuk />, 'PP < 50'],
            [<BantRozeti key="o" bant="orta" kucuk />, '50 ≤ PP < 100'],
            [<BantRozeti key="d" bant="dusuk" kucuk />, 'PP ≥ 100'],
          ]}
        />
        <p>
          100, Bakanlığın hızlı değerlendirme rehberinde kullanılan sınırdır; YapiRisk bunu bir hüküm olarak
          değil, sıralamada bir işaret olarak kullanır. 50, en yüksek tehlike bölgesinde hiç kusuru olmayan
          6–7 katlı betonarme çerçevenin puanıdır: PP 50’nin altındaysa bina, yöntemin en elverişsiz kusursuz
          binasından da düşük puan almıştır.
        </p>
        <p>
          Bant sayısı bilerek üçte tutuldu. Aşağıdaki ölçüm yöntemin daha ince bir ayrımı desteklemediğini
          gösteriyor; beş bant, olmayan bir kesinlik izlenimi verirdi.
        </p>
      </Bolum>

      <Bolum id="isabet" baslik="2023 depreminde ne kadar tuttu">
        {d.durum === 'yukleniyor' && (
          <p role="status" className="text-muted-foreground">
            Ölçüm sonuçları yükleniyor
          </p>
        )}
        {d.durum === 'hata' && (
          <p role="alert" className="text-error">
            Ölçüm sonuçları yüklenemedi. Bağlantınızı kontrol edip sayfayı yenileyin.
          </p>
        )}
        {d.durum === 'hazir' && (
          <>
            <p>
              Yöntemi, 6 Şubat 2023 Kahramanmaraş depremlerinden sonra sahada incelenen{' '}
              <Sayi>{d.veri.nToplam}</Sayi> betonarme binanın hasar kayıtlarıyla sınadık (
              <a href={d.veri.veri.url}>{d.veri.veri.yazar}, ACI 133 veri seti</a>, {d.veri.veri.lisans}).
              Yöntemin kapsamına giren 1–7 katlı <Sayi>{d.veri.nKapsam}</Sayi> binanın{' '}
              <Sayi>{d.veri.pozitif}</Sayi>’ü ağır hasar görmüş ya da yıkılmıştı.
            </p>
            <p>
              Ölçü AUC: rastgele seçilen ağır hasarlı bir binanın, rastgele seçilen daha az hasarlı bir
              binadan daha düşük puan alma olasılığı. <Sayi>0,5</Sayi> yazı-tura, <Sayi>1</Sayi> kusursuz
              sıralamadır.
            </p>
            <Tablo
              baslik={`Ağır hasarı ayırma gücü (AUC), ${d.veri.nKapsam} bina`}
              sutunlar={['Puan', 'AUC']}
              sayisal={[1]}
              satirlar={[
                ['RYTEİE puanı (veride olan parametrelerle)', uc.format(d.veri.auc.ryteie_ortalama)],
                ['Yalnız kat sayısı', uc.format(d.veri.auc.kat_sayisi)],
                ['Yalnız bina yaşı', uc.format(d.veri.auc.yas)],
                ['Yalnız yumuşak kat', uc.format(d.veri.auc.yumusak_kat)],
                ['Hassan–Sozen indeksi (kolon ve duvar ölçümü ister)', iki.format(d.veri.auc.hassan_sozen)],
              ]}
            />
            <p>
              <strong className="font-medium">Okuma:</strong> YapiRisk’in uyguladığı puan ağır hasarlı
              binaları rastgele sıralamadan belirgin iyi ayırdı, ama yalnız kat sayısına bakmak da aynı
              ayırmayı yaptı. Bu veri setinde yöntem kat sayısından fazlasını söylemedi. YapiRisk’in sunduğu
              şey daha isabetli bir tahmin değil; resmî yöntemin açık, tekrarlanabilir ve sınırları yazılı bir
              uygulamasıdır.
            </p>
            {bantTablosu(
              'Bant başına ağır hasar oranı, perde duvar bilinmiyor sayılarak (uygulamanın “Bilmiyorum” kuralı)',
              d.veri.bantlar.bacVarsayimiyla,
            )}
            {bantTablosu(
              'Bant başına ağır hasar oranı, veri setindeki perde duvar ölçümüyle',
              d.veri.bantlar.perdeVerisiyle,
            )}
            <p>
              İki tanımda da puan düştükçe ağır hasar oranı artıyor. Ama oranları bir bina için olasılık gibi
              okumayın: örneklem hasar gözlemi için seçilmiş binalardan oluşuyor ve ağır hasar oranı genel
              bina stoğunu temsil etmiyor.
            </p>
            <h3 className="mt-2 text-label text-muted-foreground">Sınanamayanlar</h3>
            <ul className="list-disc pl-5">
              <li>
                Görünen kalite, ağır çıkma, düşeyde ve planda düzensizlik, yapı nizamı ve zemin eğimi veri
                setinde yok; bu parametreler ölçümde “yok” sayıldı. Formdaki etkileri resmî tablodan gelir,
                sınanmadı.
              </li>
              <li>
                Binaların <Sayi>{(d.veri.katDagilimi['6'] ?? 0) + (d.veri.katDagilimi['7'] ?? 0)}</Sayi>’i 6–7
                katlı ve neredeyse hepsi en yüksek tehlike bölgesinde. Tehlike teriminin ve alçak binaların
                etkisi bu veriyle ölçülemedi.
              </li>
              <li>
                Ölçüm Kahramanmaraş depremlerinden; YapiRisk’in kapsadığı illerdeki bina stoğu ve depremler
                farklı olabilir.
              </li>
            </ul>
          </>
        )}
      </Bolum>

      <Bolum id="kaynaklar" baslik="Kaynaklar">
        <ul className="list-disc pl-5">
          <li>
            Riskli Yapıların Tespit Edilmesine İlişkin Esaslar (2019), Ek-A. Resmî Gazete, 16 Şubat 2019, sayı
            30688.
          </li>
          <li>Türkiye Bina Deprem Yönetmeliği (2018), Tablo 2.1 ve 2.2.</li>
          <li>
            Danciu vd. (2021), ESHM20, EFEHR. <a href="https://doi.org/10.12686/a15">doi:10.12686/a15</a>
          </li>
          <li>
            Hariri-Ardebili (2024), ACI 133 hasar veri seti.{' '}
            <a href="https://zenodo.org/records/13386343">zenodo.org/records/13386343</a>
          </li>
        </ul>
      </Bolum>
    </Sayfa>
  )
}
