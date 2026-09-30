// Yazdırma görünümü: yalnız baskıda görünür (print:block). Açık tema, beyaz kâğıt, siyah metin; cam, harita ve
// renkli zemin yok (DESIGN.md "Rapor"). Tarayıcıda üretilir, hiçbir yere gönderilmez (K-1).
import { useState } from 'react'
import { cevapEtiketi, KAT_SEVIYESI, SORULAR } from '@/form/sorular'
import { ADIMLAR, type Taslak } from '@/form/taslak'
import type { Secim } from '@/harita/tipler'
import { BantRozeti } from './BantRozeti'
import {
  aralik,
  BANT_ANLAMI,
  BANT_SINIRI,
  DONEM_NOTU,
  DONEM_UYARISI,
  ondalik,
  PARAMETRE_ADI,
  PARAMETRE_KAYNAGI,
  PROFESYONEL_YOL,
  tamsayi,
  TEKIL_BINA_KAYDI,
  tehlikeFarkiNotu,
  ZEMIN_ADI,
} from './metinler'
import { katkiSatirlari, type Sonuc } from './sonuc'
import { S1_BANDI } from '@/yontem/tehlike'

const g3 = ondalik(3)
const iki = ondalik(2)
const k5 = ondalik(5)
const tarih = new Intl.DateTimeFormat('tr-TR', { dateStyle: 'long' })

interface Props {
  sonuc: Sonuc
  secim: Secim
  taslak: Taslak
  bolgeAdi: string
}

const Baslik = ({ children }: { children: string }) => (
  <h2 className="mt-5 mb-1.5 border-b border-paper-ink/30 pb-0.5 text-[11pt] font-semibold break-after-avoid">
    {children}
  </h2>
)

export function Rapor({ sonuc, secim, taslak, bolgeAdi }: Props) {
  const { d, tam } = sonuc
  const [boylam, enlem] = secim.merkez
  const ikiUc = d.kotu.pp !== d.iyi.pp
  // Raporun tarihi: sayfanın açıldığı an (her çizimde değişmesin).
  const [bugun] = useState(() => new Date())
  const satirlar = ADIMLAR.flatMap((ad) => {
    const soru = SORULAR[ad]
    const satir = { soru, deger: soru.oku(taslak) }
    return ad === 'nizam' && (taslak.nizam === 'bitisik' || taslak.nizam === 'kosede')
      ? [satir, { soru: KAT_SEVIYESI, deger: KAT_SEVIYESI.oku(taslak) }]
      : [satir]
  })

  return (
    <article className="hidden bg-paper text-[9.5pt] leading-snug text-paper-ink print:block">
      <header className="flex items-baseline justify-between border-b-2 border-paper-ink pb-2">
        <div>
          <h1 className="text-[16pt] font-semibold">YapiRisk · Deprem riski ön değerlendirmesi</h1>
          <p>RYTEİE 2019 Ek-A (betonarme) hızlı değerlendirme yöntemiyle profesyonel inceleme önceliği</p>
        </div>
        <p className="shrink-0 font-mono">{tarih.format(bugun)}</p>
      </header>

      <Baslik>Konum</Baslik>
      <p>
        {secim.tip === 'bina' ? 'Haritadan seçilen bina' : 'Haritada işaretlenen nokta'}, {bolgeAdi}. Enlem{' '}
        <span className="font-mono">{k5.format(enlem)}</span>, boylam{' '}
        <span className="font-mono">{k5.format(boylam)}</span> (WGS 84).
      </p>

      <Baslik>Sonuç</Baslik>
      <div className="flex items-start gap-4 break-inside-avoid">
        <BantRozeti bant={d.bant.bant} />
        <div>
          <p>{BANT_ANLAMI[d.bant.bant]}</p>
          <p className="mt-1">
            Performans puanı (PP):{' '}
            <span className="font-mono font-semibold">{aralik(d.kotu.pp, d.iyi.pp)}</span> · bant sınırı{' '}
            <span className="font-mono">{BANT_SINIRI[d.bant.bant]}</span>
            {d.bant.yayilim.length > 1 &&
              ` · aralık ${d.bant.yayilim.length} önceliğe yayılıyor, öncelik elverişsiz uçtan seçildi`}
          </p>
        </div>
      </div>

      <Baslik>Puan nasıl oluştu</Baslik>
      <table className="w-full break-inside-avoid border-collapse">
        <thead>
          <tr className="border-b border-paper-ink/40 text-left">
            <th className="py-0.5 font-medium">Kalem</th>
            <th className="py-0.5 font-medium">Kaynak</th>
            <th className="py-0.5 text-right font-medium">{ikiUc ? 'Elverişsiz uç' : 'Katkı'}</th>
            {ikiUc && <th className="py-0.5 text-right font-medium">Elverişli uç</th>}
          </tr>
        </thead>
        <tbody>
          {katkiSatirlari(d).map((s) => (
            <tr key={s.parametre} className="border-b border-paper-ink/15">
              <td className="py-0.5">
                {PARAMETRE_ADI[s.parametre]}
                {s.parametre === 'tabanPuani' &&
                  ` (${tam.cevaplar.kat} kat, bölge ${d.tehlike.bolgeKotu}${d.tehlike.bolgeIyi !== d.tehlike.bolgeKotu ? `–${d.tehlike.bolgeIyi}` : ''})`}
              </td>
              <td className="py-0.5 font-mono text-[8pt]">{PARAMETRE_KAYNAGI[s.parametre]}</td>
              <td className="py-0.5 text-right font-mono">{tamsayi.format(s.kotu)}</td>
              {ikiUc && <td className="py-0.5 text-right font-mono">{tamsayi.format(s.iyi)}</td>}
            </tr>
          ))}
          <tr className="font-semibold">
            <td className="py-0.5">Toplam (PP)</td>
            <td />
            <td className="py-0.5 text-right font-mono">{tamsayi.format(d.kotu.pp)}</td>
            {ikiUc && <td className="py-0.5 text-right font-mono">{tamsayi.format(d.iyi.pp)}</td>}
          </tr>
        </tbody>
      </table>

      <Baslik>Deprem tehlikesi</Baslik>
      <p>
        S<sub>S</sub>{' '}
        <span className="font-mono">{aralik(d.tehlike.ssAraligi![0], d.tehlike.ssAraligi![1], g3)} g</span> ·
        S<sub>DS</sub>{' '}
        <span className="font-mono">{aralik(d.tehlike.sdsAraligi[0], d.tehlike.sdsAraligi[1], g3)} g</span> ·
        zemin {ZEMIN_ADI(tam.zemin)} · RYTEİE Tablo A.2 tehlike bölgesi {d.tehlike.bolgeKotu}
        {d.tehlike.bolgeIyi !== d.tehlike.bolgeKotu && `–${d.tehlike.bolgeIyi}`}.
      </p>
      <p className="mt-1">
        {d.tehlike.kaynak === 'tdth' ? (
          <>
            Kaynak: AFAD Türkiye Deprem Tehlike Haritası (DD-2), kullanıcının girdiği S<sub>S</sub> değeri. S
            <sub>DS</sub>, TBDY 2018 Tablo 2.1 zemin katsayısıyla hesaplandı.
          </>
        ) : (
          <>
            Kaynak: ESHM20 (EFEHR, CC BY 4.0), 475 yıl, kaya; seçilen noktada S<sub>S</sub>{' '}
            <span className="font-mono">{g3.format(sonuc.ssEshm20)} g</span>. {tehlikeFarkiNotu(sonuc)} (oran{' '}
            {iki.format(S1_BANDI.altOran)}–{iki.format(S1_BANDI.ustOran)}). AFAD’ın resmî değeri değildir.
          </>
        )}
      </p>

      <Baslik>Cevaplar</Baslik>
      <dl className="grid grid-cols-2 gap-x-6 gap-y-0.5 break-inside-avoid">
        {satirlar.map(({ soru, deger }) => (
          <div key={soru.kisa} className="flex justify-between gap-2 border-b border-paper-ink/15">
            <dt>{soru.kisa}</dt>
            <dd className="text-right font-medium">{cevapEtiketi(soru, deger)}</dd>
          </div>
        ))}
      </dl>
      {d.belirsiz.length > 0 && (
        <p className="mt-1">
          “Bilmiyorum” cevapları puanı iki uca açtı:{' '}
          {d.belirsiz.map((p) => PARAMETRE_ADI[p as keyof typeof PARAMETRE_ADI]).join(', ')}.
        </p>
      )}
      {tam.malzemeVarsayildi && (
        <p className="mt-1">Taşıyıcı malzeme bilinmediği için bina betonarme varsayıldı.</p>
      )}
      {tam.donem && tam.donem !== 'bilmiyorum' && (
        <p className="mt-1">
          {DONEM_NOTU[tam.donem]} {DONEM_UYARISI}
        </p>
      )}

      <Baslik>Bu sonucu nasıl okumalı</Baslik>
      <p>
        Sonuç bina hakkında bir hüküm değildir; profesyonel inceleme önceliğini gösterir. Yöntem 2023
        Kahramanmaraş depremlerinden 154 betonarme binada (ACI 133 veri seti) sınandı: ağır hasar görenleri
        ayırma gücü AUC ≈ 0,70; yalnız kat sayısı da aynı değeri verdi. Görünen kalite, ağır çıkma, düşeyde ve
        planda düzensizlik, yapı nizamı ve zemin eğimi veride olmadığı için sınanamadı. Ayrıntı: YapiRisk
        “Yöntem ve isabet” sayfası.
      </p>
      <p className="mt-1">{TEKIL_BINA_KAYDI}</p>
      <p className="mt-1">{PROFESYONEL_YOL}</p>

      <Baslik>Kaynaklar</Baslik>
      <ul className="list-disc pl-4 text-[8.5pt]">
        <li>
          Riskli Yapıların Tespit Edilmesine İlişkin Esaslar (2019), Ek-A.2.1; Resmî Gazete 16.02.2019, sayı
          30688.
        </li>
        <li>Türkiye Bina Deprem Yönetmeliği (2018), Tablo 2.1 ve 2.2.</li>
        <li>ESHM20, Danciu vd. 2021, EFEHR, doi:10.12686/a15 (CC BY 4.0).</li>
        <li>
          Bina ayak izi: Microsoft GlobalMLBuildingFootprints (CDLA Permissive 2.0). Harita: © OpenStreetMap
          katkıcıları (ODbL).
        </li>
      </ul>
      <p className="mt-3 border-t border-paper-ink/30 pt-1 text-[8pt]">
        Bu rapor tarayıcınızda üretildi; girdiğiniz bilgiler hiçbir sunucuya gönderilmedi.
      </p>
    </article>
  )
}
