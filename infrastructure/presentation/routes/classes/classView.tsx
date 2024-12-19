import type { Route } from ".react-router/types/infrastructure/presentation/routes/classes/+types/classView"
import type { LevelName } from "domain/types/level"
import { cancelClass } from "infrastructure/db/cancelClass"
import { getClass } from "infrastructure/db/getClass"
import { reinstateClass } from "infrastructure/db/reinstateClass"
import { Form, redirect } from "react-router"
import { match } from "ts-pattern"
import { Button } from "~/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "~/components/ui/dialog"
import { levelLabels } from "~/constants/labels"
import { convertDateToLocaleStrings } from "~/lib/convertDateToLocalStrings"
import { AttendanceList } from "~/routes/classes/classView/AttendanceList"

export async function loader({ params: { classId } }: Route.LoaderArgs) {
  return { class_: await getClass(classId) }
}
export type LoaderData = Awaited<ReturnType<typeof loader>>

export async function action({ params, request }: Route.ActionArgs) {
  const formData = await request.formData()
  const actionType = formData.get("actionType")

  switch (actionType) {
    case "cancelClass": {
      await cancelClass(params.classId)
      return redirect("/classes")
    }
    case "reinstateClass": {
      await reinstateClass(params.classId)
    }
  }
}

export const handle = {
  getLabel: (level: LevelName, date_: Date) => {
    const { date, time } = convertDateToLocaleStrings(date_)
    return `Cours de niveau ${levelLabels[level]} du ${date} à ${time}`
  },
}
export type Handle = typeof handle

export default function ClassView({
  loaderData: { class_ },
}: Route.ComponentProps) {
  return (
    <div className="flex flex-col gap-4 items-start">
      {match(class_.status)
        .with("CANCELLED", () => <ReinstateClassDialog />)
        .with("PLANNED", () => <CancelClassDialog />)
        .exhaustive()}
      <AttendanceList class_={class_} />
    </div>
  )
}

function CancelClassDialog() {
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
            <Button variant="outline">Oh non j'ai peur</Button>
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
  )
}

function ReinstateClassDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default">🚀 Restaurer le cours</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Restaurer le cours</DialogTitle>
          <DialogDescription>Vous pourrez modifier ce cours.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Non en fait</Button>
          </DialogClose>
          <Form method="post">
            <input type="hidden" name="actionType" value="reinstateClass" />
            <Button type="submit" value="reinstate" variant="default">
              Restaurer le cours 🎉
            </Button>
          </Form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
