---
name: calistir
description: YapiRisk'i yerelde başlatma, durdurma ve duman testi tarifi. "Uygulamayı aç", "çalıştır", "ekran görüntüsü al", faz doğrulaması ya da gorsel-dogrulama öncesi kullan.
---

# YapiRisk'i çalıştır

- **Geliştirme:** `npm run dev` → http://localhost:5173 (Vite). Başka port: `npx vite --port 5199 --strictPort`.
- **Üretim önizlemesi:** `npm run build && npm run preview -- --port 4173 --strictPort` → http://localhost:4173.
- **Duman testi:** `npm run test:e2e` (Playwright önizlemeyi kendisi başlatır; masaüstü + Pixel 7).
  İlk kurulumda `npx playwright install chromium`.
- **Veri paketi:** `cd pipeline && PYTHONIOENCODING=utf-8 uv run python -m yapirisk_pipeline manisa` (ilk çalıştırma
  ~10 dk: EFEHR SA sorguları 70–120 sn, Microsoft ~220 MB; arka planda koş). Ham dosyalar `pipeline/.onbellek/`,
  ikinci çalıştırma ağa çıkmaz ve bayt bayt aynı çıktıyı verir. Tazelemek için ilgili önbellek dosyasını sil.
- **Tüm yerel CI:** `npm run ci`; pipeline: `cd pipeline && uv run ruff check . && uv run pytest`.
- **Durdurma (Windows):** arka planda başlatılan Vite'ı PowerShell ile kapat:
  `Get-CimInstance Win32_Process -Filter "Name='node.exe'" | ? { $_.CommandLine -match 'vite.*<port>' } | % { Stop-Process -Id $_.ProcessId -Force }`
- **Doğrudan konuma git:** `http://localhost:5173/#konum=38.6140,27.4303` (nokta seçer) ya da
  `#harita=19/38.614/27.430` (yalnız harita). Harita durunca `main[data-yakinlik]` güncellenir.
- **Beklenen:** başlık "YapiRisk", h1 "YapiRisk", IBM Plex yüklü, konsol hatası yok, taban harita (Faz 4+) dışında
  dış istek yok.
