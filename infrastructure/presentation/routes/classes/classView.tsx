import type { Route } from ".react-router/types/infrastructure/presentation/routes/classes/+types/classView"
import { getRepository } from "application/server"
import type { ClassStatus } from "domain/types/class"
import type { LevelName } from "domain/types/level"
import type { ReactNode } from "react"
import { redirect } from "react-router"
import { AttendanceList } from "~/components/AttendanceList"
import { CancelClassDialog } from "~/components/CancelClassDialog"
import { ReinstateClassDialog } from "~/components/ReinstateClassDialog"
import { levelLabels } from "~/constants/labels"
import { convertDateToLocaleStrings } from "~/lib/convertDateToLocalStrings"

export async function loader({ params: { classId } }: Route.LoaderArgs) {
  return { class_: await getRepository("class").getClass(classId) }
}
export type LoaderData = Awaited<ReturnType<typeof loader>>

export async function action({ params, request }: Route.ActionArgs) {
  const formData = await request.formData()
  const actionType = formData.get("actionType")

  switch (actionType) {
    case "cancelClass": {
      await getRepository("class").cancelClass(params.classId)
      return redirect("/classes")
    }
    case "reinstateClass": {
      await getRepository("class").reinstateClass(params.classId)
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

const statusDialogs: Record<ClassStatus, ReactNode> = {
  PLANNED: <CancelClassDialog />,
  CANCELLED: <ReinstateClassDialog />,
}

export default function ClassView({
  loaderData: { class_ },
}: Route.ComponentProps) {
  return (
    <div className="flex flex-col gap-4 items-start">
      {statusDialogs[class_.status]}
      <AttendanceList class_={class_} />
    </div>
  )
}
