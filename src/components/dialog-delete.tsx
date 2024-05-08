import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface IDialogDelete {
    onDelete: () => void;
}

export function DialogDelete({ onDelete }: IDialogDelete) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive">Deletar</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
          Tem certeza que deseja deletar ?
          </DialogTitle>
        </DialogHeader>
        <Button type="submit" onClick={onDelete}>Sim</Button>
      </DialogContent>
    </Dialog>
  )
}
