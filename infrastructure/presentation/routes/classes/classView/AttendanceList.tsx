import type { AttendanceType } from "@prisma/client"
import type { DetailedClass } from "domain/types/class"
import type {
  AttendanceStatus,
  ClassAttendance,
} from "domain/types/classAttendance"
import type { LevelName } from "domain/types/level"
import { useId, useRef } from "react"
import { useButton } from "react-aria"
import { Form } from "react-router"
import { Badge, type BadgeProps } from "~/components/ui/badge"
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
import { Label } from "~/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table"
import {
  attendanceStatusLabels,
  attendanceTypeLabels,
  levelLabels,
  teacherEditableAttendanceStatusLabels,
} from "~/constants/labels"
import { capitalize } from "~/lib/capitalize"
import { convertDateToLocaleStrings } from "~/lib/convertDateToLocalStrings"

export function AttendanceList({ class_ }: { class_: DetailedClass }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Élève</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Statut</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {class_.attendances.map((attendance) => (
          <AttendanceRow
            key={attendance.id}
            attendance={attendance}
            date={class_.date}
            levelName={class_.level.name}
          />
        ))}
      </TableBody>
    </Table>
  )
}

const typeBadgeVariants: Record<AttendanceType, BadgeProps["variant"]> = {
  REGULAR: "default",
  VISITOR: "secondary",
}

const statusBadgeVariants: Record<AttendanceStatus, BadgeProps["variant"]> = {
  PLANNED: "default",
  ABSENT: "secondary",
  CANCELLED: "destructive",
}

function AttendanceRow({
  attendance: { type, status, student },
  date,
  levelName,
}: {
  attendance: ClassAttendance
  date: Date
  levelName: LevelName
}) {
  const ref = useRef<HTMLTableRowElement | null>(null)
  const { buttonProps } = useButton({ elementType: "tr" }, ref)

  const formId = useId()
  const statusSelectId = useId()

  const studentName = `${student.firstName} ${student.lastName}`

  return (
    <Dialog>
      <DialogTrigger asChild>
        <TableRow {...buttonProps} ref={ref}>
          <TableCell>{studentName}</TableCell>
          <TableCell>
            <Badge variant={typeBadgeVariants[type]} className="capitalize">
              {attendanceTypeLabels[type]}
            </Badge>
          </TableCell>
          <TableCell>
            <Badge variant={statusBadgeVariants[status]} className="capitalize">
              {attendanceStatusLabels[status]}
            </Badge>
          </TableCell>
        </TableRow>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier la participation</DialogTitle>
          <DialogDescription>
            Participation de {studentName} au cours {levelLabels[levelName]} du{" "}
            {convertDateToLocaleStrings(date, { dateStyle: "short" }).date}
          </DialogDescription>
        </DialogHeader>

        <Form method="post" id={formId} className="flex flex-col gap-4">
          <input type="hidden" name="actionType" value="editAttendance" />

          <div className="flex flex-col gap-2">
            <Label htmlFor={statusSelectId}>Statut</Label>
            <Select name="status" defaultValue={status}>
              <SelectTrigger id={statusSelectId}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(teacherEditableAttendanceStatusLabels).map(
                  ([statusKey, label]) => (
                    <SelectItem key={statusKey} value={statusKey}>
                      {capitalize(label)}
                    </SelectItem>
                  ),
                )}
              </SelectContent>
            </Select>
          </div>
        </Form>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Annuler</Button>
          </DialogClose>

          <Button type="submit" form={formId} variant="default">
            Confirmer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
