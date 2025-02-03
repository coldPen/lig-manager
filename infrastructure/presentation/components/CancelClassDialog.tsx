import { Form } from "react-router";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";

export function CancelClassDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive">💣 Annuler le cours</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmer l'annulation</DialogTitle>
          <DialogDescription>
            Vous ne pourrez plus modifier ce cours.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">En fait non</Button>
          </DialogClose>
          <Form method="post">
            <input type="hidden" name="actionType" value="cancelClass" />
            <Button type="submit" value="cancel" variant="destructive">
              Annuler le cours 🤘
            </Button>
          </Form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
