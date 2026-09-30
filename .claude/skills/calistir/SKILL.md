---
name: calistir
description: YapiRisk'i yerelde başlatma, durdurma ve duman testi tarifi. "Uygulamayı aç", "çalıştır", "ekran görüntüsü al", faz doğrulaması ya da gorsel-dogrulama öncesi kullan.
---

# YapiRisk'i çalıştır

- **Geliştirme:** `npm run dev` → http://localhost:5173 (Vite). Başka port: `npx vite --port 5199 --strictPort`.
- **Üretim önizlemesi:** `npm run build && npm run preview -- --port 4173 --strictPort` → http://localhost:4173.
- **Duman testi:** `npm run test:e2e` (Playwright önizlemeyi kendisi başlatır; masaüstü + Pixel 7).
  İlk kurulumda `npx playwright install chromium`.
- **Tüm yerel CI:** `npm run ci`; pipeline: `cd pipeline && uv run ruff check . && uv run pytest`.
- **Durdurma (Windows):** arka planda başlatılan Vite'ı PowerShell ile kapat:
  `Get-CimInstance Win32_Process -Filter "Name='node.exe'" | ? { $_.CommandLine -match 'vite.*<port>' } | % { Stop-Process -Id $_.ProcessId -Force }`
- **Beklenen:** başlık "YapiRisk", h1 "YapiRisk", IBM Plex yüklü, konsol hatası yok, taban harita (Faz 4+) dışında
  dış istek yok.
