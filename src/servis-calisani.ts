// Çevrimdışı kullanım için servis çalışanı (sw/sw.js, derlemede dist/sw.js). Yalnız üretim derlemesinde; geliştirmede
// Vite'ın anlık yenilemesiyle çakışmasın. Kayıt başarısızsa uygulama çevrimiçi olarak aynen çalışır.
export function servisCalisaniKaydet() {
  if (!import.meta.env.PROD || !('serviceWorker' in navigator)) return
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`).catch(() => {})
  })
}

/**
 * Gezilen bölgenin izi: önbellekteki harita karoları ve bina parçaları hangi bölgeye bakıldığını gösterir. "Temizle"
 * bunları da siler; uygulama kabuğu (herkes için aynı dosyalar) kalır.
 */
export async function gezintiOnbelleginiSil() {
  try {
    const adlar = await caches.keys()
    await Promise.all(
      adlar
        .filter((a) => a.startsWith('yapirisk-parca') || a === 'yapirisk-karo')
        .map((a) => caches.delete(a)),
    )
  } catch {
    // Cache API yoksa (eski tarayıcı, güvensiz bağlam) silinecek bir şey de yok.
  }
}
