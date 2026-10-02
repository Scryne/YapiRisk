// Paylaşılan bağlantı açıldığında bu tarayıcıda başka bir değerlendirme varsa üzerine yazmadan önce sorulur.
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

interface Props {
  acik: boolean
  onAc: () => void
  onVazgec: () => void
}

export function PaylasimOnayi({ acik, onAc, onVazgec }: Props) {
  return (
    <AlertDialog open={acik} onOpenChange={(o) => !o && onVazgec()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Paylaşılan değerlendirme açılsın mı?</AlertDialogTitle>
          <AlertDialogDescription>
            Bu tarayıcıda kendi değerlendirmeniz var. Paylaşılan değerlendirme onun yerine geçer; kendi
            cevaplarınız silinir.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="h-11">Kendi değerlendirmemde kal</AlertDialogCancel>
          <AlertDialogAction className="h-11" onClick={onAc}>
            Paylaşılanı aç
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
