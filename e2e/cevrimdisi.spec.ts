import { expect, test } from '@playwright/test'
import { doldur, hazirBekle, KUSURSUZ_4_KAT } from './yardim.ts'

// Sahada kullanım: uygulama bir kez açıldıktan sonra bağlantı kesilse de açılır ve değerlendirme sonuna kadar yapılır.
test('bağlantı kesilince uygulama yeniden açılıyor; daha önce bakılan konumda değerlendirme yapılıyor', async ({
  page,
  context,
}) => {
  const hatalar: string[] = []
  page.on('pageerror', (e) => hatalar.push(e.message))

  await page.goto('/')
  await hazirBekle(page)
  // Servis çalışanı kabuğu ve il paketlerini önceden önbelleğe alır, sonra sayfayı denetimine alır. İlk açılışta
  // devreye girmeden inen parçalar önbelleğe girmez; bu yüzden bina ölçeğine denetim başladıktan sonra gidilir.
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready
  })
  await expect
    .poll(() => page.evaluate(() => !!navigator.serviceWorker.controller), { timeout: 20_000 })
    .toBe(true)
  await page.goto('/#harita=17/38.614/27.4303')
  await expect(page.locator('main')).toHaveAttribute('data-yakinlik', '17.0', { timeout: 20_000 })
  await expect
    .poll(
      () => page.evaluate(async () => (await caches.keys()).some((a) => a.startsWith('yapirisk-parca-'))),
      {
        timeout: 20_000,
      },
    )
    .toBe(true)
  await page.goto('/#konum=38.614,27.4303')
  await expect(page.getByRole('heading', { name: 'Seçilen nokta' })).toBeVisible()
  const onbellekler = await page.evaluate(() => caches.keys())
  expect(onbellekler.some((a) => a.startsWith('yapirisk-kabuk-'))).toBe(true)

  await context.setOffline(true)
  await page.reload()
  await hazirBekle(page)
  await expect(page.getByRole('status').filter({ hasText: 'Bağlantı yok' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Seçilen nokta' })).toBeVisible()
  await expect(page.getByTestId('ss-degeri')).toBeVisible()

  await page.getByRole('button', { name: 'Sorulara başla' }).click()
  await doldur(page, KUSURSUZ_4_KAT)
  await expect(page.getByTestId('bant')).toBeVisible()

  // Bilgi sayfaları da çevrimdışı açılıyor.
  await page.goto('/yontem.html')
  await expect(page.getByRole('heading', { level: 1, name: 'Yöntem ve isabet' })).toBeVisible()
  await expect(page.getByText('Ağır hasarı ayırma gücü (AUC)').first()).toBeVisible()

  await context.setOffline(false)
  await page.goto('/')
  await expect(page.getByRole('status').filter({ hasText: 'Bağlantı yok' })).toHaveCount(0)

  // "Temizle" baktığınız bölgenin izini (bina parçaları, harita karoları) de siler; uygulama kabuğu kalır. Harita aynı
  // bölgeyi göstermeye devam ettiği için birkaç karo hemen yeniden inebilir; eski kayıtların gittiğine bakılır.
  const icerik = () =>
    page.evaluate(async () => {
      const sonuc: Record<string, string[]> = {}
      for (const a of await caches.keys()) sonuc[a] = (await (await caches.open(a)).keys()).map((r) => r.url)
      return sonuc
    })
  const once = await icerik()
  const oncekiParcalar = Object.entries(once)
    .filter(([a]) => a.startsWith('yapirisk-parca-'))
    .flatMap(([, u]) => u)
  expect(oncekiParcalar.length).toBeGreaterThan(0)
  await page.getByRole('button', { name: 'Temizle' }).click()
  await page.getByRole('alertdialog').getByRole('button', { name: 'Değerlendirmeyi sil' }).click()
  await expect
    .poll(async () => {
      const sonra = await icerik()
      const parcalar = Object.entries(sonra)
        .filter(([a]) => a.startsWith('yapirisk-parca-'))
        .flatMap(([, u]) => u)
      return {
        eskiParcaKaldi: oncekiParcalar.some((u) => parcalar.includes(u)),
        karoAzaldi: (sonra['yapirisk-karo']?.length ?? 0) < (once['yapirisk-karo']?.length ?? 0),
        kabukVar: Object.keys(sonra).some((a) => a.startsWith('yapirisk-kabuk-')),
      }
    })
    .toEqual({ eskiParcaKaldi: false, karoAzaldi: true, kabukVar: true })
  expect(hatalar).toEqual([])
})
