# S4 — Manisa'da adres araması ve bina ayak izi

**Soru:** Kullanıcı binasını bulabilir mi? Adresle mi, haritada tıklayarak mı? Ayak izi verisi statik siteye
sığar mı (K-1)?

## Sonuç (2026-09-30)

### OSM kapsamı (Overpass, il alanı)
- Bina: 67.847 way · **kapı numarası (`addr:housenumber`): 779** · `building:levels`: 321.
- Yol parçası (residential…primary): 29.922, **adı olan: 2.304 (%8)**.
- Mahalle/köy yer kaydı: 1.323.
- → Kapı numarasıyla adres araması Manisa'da çalışmaz; sokak düzeyi de büyük ölçüde boş.

### Mahalle araması (`mahalle-arama-sonuc.json`)
OSM'den rastgele 20 mahalle düğümü; sorgu kullanıcının yazacağı biçimde "X Mahallesi, İlçe, Manisa".
İki düğüm OSM'de adı "mahalle" olan çöp kayıttı; geçerli 18'de ≤ 2 km isabet: **Photon 18/18**,
Nominatim 15/18 (3'ünü bulamadı). Kaynak OSM'nin kendisi olduğundan test kısmen döngüsel; asıl ölçtüğü,
Türkçe "Mahallesi, İlçe" kalıbının iki motorda çalışıp çalışmadığı. Photon otomatik tamamlamaya da izin
veriyor (Nominatim politikası yasaklıyor).

### Microsoft GlobalMLBuildingFootprints (`ayak_izi.py`)
- 16 quadkey (z9), 220 MB gzip, indirme ~100 sn. Lisans CDLA Permissive 2.0.
- Il sınırı (OSM) içinde **474.953 bina** (OSM'nin ~7 katı). Yükseklik/kat alanı: 0 → kat kullanıcıdan (K-1 ile tutarlı).
- Taban alanı medyan ~98 m², %90 ~340 m² (kaba).
- Ham GeoJSONL 155 MB; koordinat 6 ondalık + z14 parçalama + gzip → **15,3 MB, 3.669 dosya**, parça medyanı
  1,4 KB, en büyük 140 KB (3.641 bina). Tarayıcı yalnız görünen parçaları çeker; statik barındırmaya uygun.

## Karar → Proje-Fikri K-7
Akış: mahalle araması (Photon) → harita o mahalleye gider → kullanıcı binasına **tıklar** (Microsoft ayak izi
parçası) → tıklanan poligonun merkezi tehlike ızgarasına sorgulanır. Kapı numarası araması v1'de yok.
Ayak izi olmayan yerde "haritada nokta seç" yedeği.
