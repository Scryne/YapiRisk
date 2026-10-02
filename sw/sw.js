// Çevrimdışı kullanım (Faz 6.7): binanın önünde çekim zayıfken de uygulama açılsın, daha önce gezilen harita ve
// binalar görünsün. Derlemede vite.config.ts'teki eklenti __SURUM__ ve __ONCEDEN__'i doldurup dist/sw.js yazar.
// Önbellek yalnız bu tarayıcıda; hiçbir şey dışarı gönderilmez (K-1). Uydu karoları (MapTiler) önbelleğe alınmaz.
/* global self, caches, URL, Response */

const SURUM = '__SURUM__'
/** Bina parçalarının sürümü: il paketlerinin kaynak.json özetleri; boru hattı parçaları değiştirince yenilenir. */
const PARCA_SURUMU = '__PARCA_SURUMU__'
/** Uygulama kabuğu ve il paketlerinin küçük dosyaları (göreli yollar, sw.js'e göre). */
const ONCEDEN = __ONCEDEN__
const KABUK = `yapirisk-kabuk-${SURUM}`
/** Gezilen bina parçaları ve taban harita karoları; sınırlı. Karolar uygulama sürümünden bağımsız. */
const PARCA = `yapirisk-parca-${PARCA_SURUMU}`
const KARO = 'yapirisk-karo'
const SINIR = { [PARCA]: 1500, [KARO]: 2500 }
const TABAN_HARITA = 'https://tiles.openfreemap.org/'

const kok = new URL('./', self.location).href

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches
      .open(KABUK)
      .then((c) => c.addAll(ONCEDEN.map((y) => new URL(y, kok).href)))
      .then(() => self.skipWaiting()),
  )
})

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((adlar) =>
        Promise.all(
          adlar
            .filter((a) => a.startsWith('yapirisk-') && ![KABUK, PARCA, KARO].includes(a))
            .map((a) => caches.delete(a)),
        ),
      )
      .then(() => self.clients.claim()),
  )
})

/** Önbellek sınırı aşılınca en eski kayıtlar silinir (Cache API ekleme sırasını korur). */
async function kirp(ad) {
  const c = await caches.open(ad)
  const anahtarlar = await c.keys()
  const fazla = anahtarlar.length - SINIR[ad]
  for (let i = 0; i < fazla; i++) await c.delete(anahtarlar[i])
}

/** Önce ağ; ağ yoksa önbellek. Sayfalar ve veri kaydı güncel kalsın. */
async function onceAg(istek, ad) {
  try {
    const yanit = await fetch(istek)
    if (yanit.ok) (await caches.open(ad)).put(istek, yanit.clone())
    return yanit
  } catch {
    const kayitli = await caches.match(istek, { ignoreSearch: true, ignoreVary: true })
    if (kayitli) return kayitli
    if (istek.mode === 'navigate') {
      const ana = await caches.match(new URL('index.html', kok).href, { ignoreVary: true })
      if (ana) return ana
    }
    return Response.error()
  }
}

/**
 * Önce önbellek; yoksa ağdan alıp kaydet. Vary yok sayılır: sunucu `Vary: Origin` dönerse önceden alınan kopya modül
 * betiğinin (Origin başlıklı) isteğiyle eşleşmezdi (vite preview'da görüldü).
 */
async function onceOnbellek(istek, ad) {
  const kayitli = await caches.match(istek, { ignoreVary: true })
  if (kayitli) return kayitli
  const yanit = await fetch(istek)
  if (yanit.ok) {
    await (await caches.open(ad)).put(istek, yanit.clone())
    if (SINIR[ad]) kirp(ad)
  }
  return yanit
}

self.addEventListener('fetch', (e) => {
  const istek = e.request
  if (istek.method !== 'GET') return
  const url = istek.url
  if (url.startsWith(TABAN_HARITA)) {
    e.respondWith(onceOnbellek(istek, KARO))
    return
  }
  if (!url.startsWith(kok)) return
  const yol = url.slice(kok.length)
  if (istek.mode === 'navigate' || yol.endsWith('bolgeler.json')) e.respondWith(onceAg(istek, KABUK))
  else if (yol.startsWith('data/') && yol.includes('/bina/') && yol.endsWith('.json.gz'))
    e.respondWith(onceOnbellek(istek, PARCA))
  else e.respondWith(onceOnbellek(istek, KABUK))
})
