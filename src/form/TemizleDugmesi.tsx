import { Trash2 } from 'lucide-react'
import { useRef } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'

/**
 * Seçilen binayı ve cevapları bu tarayıcıdan siler; geri alınamadığı için onay ister.
 * Silince tetikleyici düğme ekrandan kalkar; odağı çağıran taraf taşır (onTemizle).
 */
export function TemizleDugmesi({ onTemizle, className }: { onTemizle: () => void; className?: string }) {
  const silindi = useRef(false)
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button type="button" variant="ghost" className={className ?? '-mr-2 h-11'}>
          <Trash2 data-icon="inline-start" />
          Temizle
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent
        onCloseAutoFocus={(e) => {
          if (silindi.current) e.preventDefault()
          silindi.current = false
        }}
      >
        <AlertDialogHeader>
          <AlertDialogTitle>Değerlendirme silinsin mi?</AlertDialogTitle>
          <AlertDialogDescription>
            Seçtiğiniz bina ve verdiğiniz tüm cevaplar bu tarayıcıdan silinir. Bu işlem geri alınamaz.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="h-11">Vazgeç</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            className="h-11"
            onClick={() => {
              silindi.current = true
              onTemizle()
            }}
          >
            Değerlendirmeyi sil
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
