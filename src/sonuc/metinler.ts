// Sonuç kartı ve raporun ortak metinleri. Dil kuralı (DESIGN.md): "riskli", "güvenli", "sağlam", "çürük" yok;
// sonuç bina hakkında hüküm değil, profesyonel inceleme önceliğidir (K-4, K-12).
import type { Donem } from '@/form/taslak'
import type { Bant } from '@/yontem/bant'
import type { Parametre } from '@/yontem/ryteie'
import type { ZeminCevabi } from '@/yontem/tehlike'

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
}

/** RYTEİE Ek-A tablo künyesi (kaynak ipucu, DESIGN.md "Kaynak künyesi"). */
export const PARAMETRE_KAYNAGI: Record<Parametre, string> = {
  tabanPuani: 'RYTEİE Tablo A.1',
  yapisalSistem: 'RYTEİE Tablo A.1',
  gorunenKalite: 'RYTEİE Tablo A.3–A.4',
  yumusakKat: 'RYTEİE Tablo A.3–A.4',
  duseydeDuzensizlik: 'RYTEİE Tablo A.3–A.4',
  agirCikma: 'RYTEİE Tablo A.3–A.4',
  plandaDuzensizlik: 'RYTEİE Tablo A.3–A.4',
  kisaKolon: 'RYTEİE Tablo A.3–A.4',
  zeminEgimi: 'RYTEİE Tablo A.3–A.4',
  yapiNizami: 'RYTEİE Tablo A.3–A.4',
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

/** RYTEİE Ek-A.1.1'in kaydı: yöntem bölgesel dağılım içindir. */
export const TEKIL_BINA_KAYDI =
  'RYTEİE Ek-A.1.1: Bu yöntem binaların bölgesel dağılımını belirlemek içindir; tek bir binada risk değerlendirmesi amacıyla kullanılamaz.'

export const PROFESYONEL_YOL =
  "Binanızın durumunu kesin olarak öğrenmek için 6306 sayılı Kanun kapsamında Çevre, Şehircilik ve İklim Değişikliği Bakanlığı'nın lisans verdiği kuruluşlara başvurabilirsiniz. Kuruluşların listesini ilinizdeki Çevre, Şehircilik ve İklim Değişikliği İl Müdürlüğü'nden öğrenebilirsiniz."

export const tamsayi = new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 0 })
export const ondalik = (basamak: number) =>
  new Intl.NumberFormat('tr-TR', { minimumFractionDigits: basamak, maximumFractionDigits: basamak })

/** "a – b" ya da tek değer. */
export const aralik = (a: number, b: number, bicim: Intl.NumberFormat = tamsayi) =>
  bicim.format(a) === bicim.format(b) ? bicim.format(a) : `${bicim.format(a)} – ${bicim.format(b)}`
