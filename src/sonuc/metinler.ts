// Sonuç kartı ve raporun ortak metinleri. Dil kuralı (DESIGN.md): "riskli", "güvenli", "sağlam", "çürük" yok;
// sonuç bina hakkında hüküm değil, profesyonel inceleme önceliğidir (K-4, K-12).
import type { Donem } from '@/form/taslak'
import { adlarListesi, bulunma, type BolgeKaydi } from '@/veri/bolge'
import type { Bant } from '@/yontem/bant'
import type { Yontem } from '@/yontem/degerlendir'
import type { Parametre } from '@/yontem/ryteie'
import type { ZeminCevabi } from '@/yontem/tehlike'
import type { Sonuc } from './sonuc'

export const BANT_ADI: Record<Bant, string> = {
  yuksek: 'Yüksek öncelik',
  orta: 'Orta öncelik',
  dusuk: 'Düşük öncelik',
}

/** Bandın tek cümlelik anlamı; sınırlar K-12. */
export const BANT_ANLAMI: Record<Bant, string> = {
  yuksek:
    'Profesyonel incelemede öne alınması önerilen grupta. Puan, bu yöntemde hiç kusuru olmayan en elverişsiz binanın puanının da altında.',
  orta: 'Profesyonel incelemede orta sırada. Kusurlar ya da bölgenin deprem tehlikesi puanı belirgin düşürüyor.',
  dusuk:
    'Profesyonel incelemede daha sonra gelebilecek grupta. Bu, binanın depreme dayanıklı olduğunu göstermez; yalnız sıralamadaki yeridir.',
}

export const BANT_SINIRI: Record<Bant, string> = {
  yuksek: 'PP < 50',
  orta: '50 ≤ PP < 100',
  dusuk: 'PP ≥ 100',
}

export const PARAMETRE_ADI: Record<Parametre, string> = {
  tabanPuani: 'Taban puanı',
  yapisalSistem: 'Yapısal sistem',
  gorunenKalite: 'Görünen kalite',
  yumusakKat: 'Yumuşak kat',
  duseydeDuzensizlik: 'Düşeyde düzensizlik',
  agirCikma: 'Ağır çıkma',
  plandaDuzensizlik: 'Planda düzensizlik',
  kisaKolon: 'Kısa kolon',
  zeminEgimi: 'Tabii zemin eğimi',
  yapiNizami: 'Yapı nizamı',
  malzemeKalitesi: 'Malzeme kalitesi',
  duvarIsciligi: 'Duvar işçiliği',
  mevcutHasar: 'Mevcut hasar',
  planGeometrisi: 'Planda düzensizlik',
  duvarMiktari: 'Duvar miktarı',
  yatayHatil: 'Yatay hatıl',
  boslukDuzeni: 'Düşey boşluk düzeni',
  cepheKatFarki: 'Cepheye göre kat farkı',
  duzlemDisi: 'Düzlem dışı davranış',
  toprakDam: 'Toprak dam',
}

/** RYTEİE Ek-A tablo künyesi (kaynak ipucu, DESIGN.md "Kaynak künyesi"). */
const KAYNAK: Record<Yontem, Partial<Record<Parametre, string>>> = {
  betonarme: {
    tabanPuani: 'RYTEİE Tablo A.1',
    yapisalSistem: 'RYTEİE Tablo A.1',
  },
  yigma: {
    tabanPuani: 'RYTEİE Tablo A.5',
    yapisalSistem: 'RYTEİE A.2.2.4',
    malzemeKalitesi: 'RYTEİE Tablo A.6–A.7',
    duvarIsciligi: 'RYTEİE Tablo A.6–A.7',
    mevcutHasar: 'RYTEİE Tablo A.6–A.7',
    planGeometrisi: 'RYTEİE Tablo A.6, A.8',
    duvarMiktari: 'RYTEİE Tablo A.6, A.8',
    yatayHatil: 'RYTEİE Tablo A.6, A.8',
    boslukDuzeni: 'RYTEİE Tablo A.6, A.9',
    cepheKatFarki: 'RYTEİE Tablo A.6, A.9',
    yumusakKat: 'RYTEİE Tablo A.6, A.9',
    duzlemDisi: 'RYTEİE A.2.2.9, A.2.2.12',
    toprakDam: 'RYTEİE A.2.2.13',
    yapiNizami: 'RYTEİE Tablo A.6, A.10',
  },
}
export const parametreKaynagi = (y: Yontem, p: Parametre) =>
  KAYNAK[y][p] ?? (y === 'betonarme' ? 'RYTEİE Tablo A.3–A.4' : 'RYTEİE Ek-A.2.2')

export const YONTEM_ADI: Record<Yontem, string> = {
  betonarme: 'RYTEİE 2019 Ek-A.2.1 (betonarme)',
  yigma: 'RYTEİE 2019 Ek-A.2.2 (yığma)',
}

/** Sonuç kartındaki puan tablosunun altı. */
export const TABLO_KAYNAGI: Record<Yontem, string> = {
  betonarme: 'Kaynak: RYTEİE Ek-A Tablo A.1 (taban, sistem), A.3–A.4 (kusurlar)',
  yigma: 'Kaynak: RYTEİE Ek-A Tablo A.5 (taban), A.2.2.4 (sistem), A.6–A.10 (olumsuzluklar)',
}

/** "Bilmiyorum" denen taşıyıcı sistem sorusunun kabulü. */
export const SISTEM_KABULU: Record<Yontem, string> = {
  betonarme: 'Perde sorusu “Bilmiyorum”: yönetmelik gereği perdesiz çerçeve kabul edildi (RYTEİE A.2.1.1).',
  yigma: 'Yığma bina türü “Bilmiyorum”: donatısız yığma kabul edildi; bu tür ek puan almaz.',
}

/** K-10: yapım dönemi puana girmez; dönemin deprem yönetmeliği bilgi olarak yazılır. */
export const DONEM_NOTU: Record<Donem, string> = {
  'once-1975':
    '1975 öncesi: 1968 ve daha eski deprem yönetmelikleri dönemi. Bugünkü sünek tasarım kuralları henüz yoktu.',
  '1975-1997':
    '1975–1997: 1975 deprem yönetmeliği dönemi. Bugünkü sünek tasarım kurallarının çoğu henüz yoktu.',
  '1998-2006':
    '1998–2006: 1998 deprem yönetmeliği dönemi; sünek tasarım kuralları bu yönetmelikle ayrıntılandı.',
  '2007-2018': '2007–2018: 2007 deprem yönetmeliği dönemi.',
  '2019-sonra':
    "2019 ve sonrası: 2018 Türkiye Bina Deprem Yönetmeliği dönemi (1 Ocak 2019'da yürürlüğe girdi).",
}
export const DONEM_UYARISI =
  'Bir binanın yönetmeliğe göre tasarlanmış olması, uygulamanın da ona uygun yapıldığını göstermez. Bu not puana katılmaz.'

export const ZEMIN_ADI = (z: ZeminCevabi) =>
  z === 'bilmiyorum' ? 'Bilinmiyor (ZC, ZD, ZE içinden en elverişsizi)' : z

/** "Bu sonucu nasıl okumalı": yöntemin 2023 verisinde ölçülen isabeti (S3). */
export const ISABET_OZETI: Record<Yontem, string> = {
  betonarme:
    'Sonuç binanız hakkında bir hüküm değil; profesyonel incelemede sıranın neresinde olduğunu gösterir. Yöntemi 2023 depreminden 154 betonarme binada sınadık: ağır hasar görenleri rastgele sıralamadan belirgin iyi ayırdı, ama yalnız kat sayısına bakmak da aynı ayırmayı yaptı.',
  yigma:
    'Sonuç binanız hakkında bir hüküm değil; profesyonel incelemede sıranın neresinde olduğunu gösterir. Yığma yöntemini 2023 depreminden 414 yığma binada sınadık: kat sayısı ve deprem tehlikesinden oluşan taban puanı ağır hasar görenleri rastgele sıralamadan belirgin iyi ayırdı, ayrımı çoğunlukla deprem tehlikesi yaptı. Duvar, harç ve bağlantı soruları veride olmadığı için sınanamadı.',
}

/** Raporun isabet paragrafı. */
export const ISABET_RAPORU: Record<Yontem, string> = {
  betonarme:
    'Sonuç bina hakkında bir hüküm değildir; profesyonel inceleme önceliğini gösterir. Yöntem 2023 Kahramanmaraş depremlerinden 154 betonarme binada (ACI 133 veri seti) sınandı: ağır hasar görenleri ayırma gücü AUC ≈ 0,70; yalnız kat sayısı da aynı değeri verdi. Görünen kalite, ağır çıkma, düşeyde ve planda düzensizlik, yapı nizamı ve zemin eğimi veride olmadığı için sınanamadı. Ayrıntı: YapiRisk “Yöntem ve isabet” sayfası.',
  yigma:
    'Sonuç bina hakkında bir hüküm değildir; profesyonel inceleme önceliğini gösterir. Yöntem 2023 Kahramanmaraş depremlerinden Gaziantep’te 414 yığma binada (Atasever vd. veri seti) sınandı: taban puanının ağır hasar görenleri ayırma gücü AUC ≈ 0,71; ayrımı deprem tehlikesi yaptı, kat sayısı tek başına ayırmadı (0,52). Tablo A.6’daki gözlem parametreleri veride olmadığı için sınanamadı. Ayrıntı: YapiRisk “Yöntem ve isabet” sayfası.',
}

/** RYTEİE Ek-A.1.1'in kaydı: yöntem bölgesel dağılım içindir. */
export const TEKIL_BINA_KAYDI =
  'RYTEİE Ek-A.1.1: Bu yöntem binaların bölgesel dağılımını belirlemek içindir; tek bir binada risk değerlendirmesi amacıyla kullanılamaz.'

export const PROFESYONEL_YOL =
  'Binanızın durumunu kesin olarak öğrenmek için 6306 sayılı Kanun kapsamında riskli yapı tespiti yaptırabilirsiniz. Tespiti Kentsel Dönüşüm Başkanlığının lisans verdiği kuruluşlar yapar; başvuru e-Devlet’ten yapılır, ücreti malikler öder.'

/** Binanın ilindeki müdürlük (bölge kaydından, K-3); kayıt yoksa genel yönlendirme. */
export function ilMudurluguNotu(bolge: BolgeKaydi | null): string {
  if (bolge?.ilMudurlugu)
    return `İlinizdeki lisanslı kuruluşları ${bolge.ad} Çevre, Şehircilik ve İklim Değişikliği İl Müdürlüğü’nden (${bolge.ilMudurlugu.telefon}) ya da ALO 181’den öğrenebilirsiniz.`
  return 'İlinizdeki lisanslı kuruluşları Çevre, Şehircilik ve İklim Değişikliği İl Müdürlüğü’nden ya da ALO 181’den öğrenebilirsiniz.'
}

export const tamsayi = new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 0 })
export const ondalik = (basamak: number) =>
  new Intl.NumberFormat('tr-TR', { minimumFractionDigits: basamak, maximumFractionDigits: basamak })

/** "a – b" ya da tek değer. */
export const aralik = (a: number, b: number, bicim: Intl.NumberFormat = tamsayi) =>
  bicim.format(a) === bicim.format(b) ? bicim.format(a) : `${bicim.format(a)} – ${bicim.format(b)}`

/** ESHM20 kaynaklı sonuçta AFAD farkının nerede ölçüldüğü (S1); bölge kayıtlarından, kod il bilmez (K-3). */
export function tehlikeFarkiNotu({
  bolge,
  olculenBolgeler,
}: Pick<Sonuc, 'bolge' | 'olculenBolgeler'>): string {
  if (bolge && bolge.tdthNokta > 0)
    return `AFAD’ın resmî değeriyle farkı ${bulunma(bolge.ad)} ${bolge.tdthNokta} noktada ölçüldü ve aralığa katıldı`
  if (olculenBolgeler.length)
    return `Bu ilde AFAD’la karşılaştırma henüz yapılmadı; aralık ${bulunma(adlarListesi(olculenBolgeler.map((b) => b.ad)))} ölçülen farktan geliyor`
  return 'AFAD’la karşılaştırma henüz yapılmadı'
}
