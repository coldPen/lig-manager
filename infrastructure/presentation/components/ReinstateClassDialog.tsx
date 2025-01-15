import { Form } from "react-router"
import { Button } from "~/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog"

export function ReinstateClassDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default">🚀 Restaurer ce cours</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Restaurer le cours</DialogTitle>
          <DialogDescription>
            Vous pourrez modifier ce cours à nouveau.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">En fait non</Button>
          </DialogClose>
          <Form method="post">
            <input type="hidden" name="actionType" value="reinstateClass" />
            <Button type="submit" value="reinstate" variant="default">
              Restaurer ce cours 🎉
            </Button>
          </Form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
