import type { AttendanceType } from "@prisma/client"
import type { DetailedClass } from "domain/types/class"
import type {
  AttendanceStatus,
  ClassAttendance,
} from "domain/types/classAttendance"
import type { LevelName } from "domain/types/level"
import { Slash } from "lucide-react"
import { useId } from "react"
import { Form } from "react-router"
import { Badge, type BadgeProps } from "~/components/ui/badge"
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
  REGULAR: "outline",
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
  const formId = useId()
  const statusSelectId = useId()

  const studentName = `${student.firstName} ${student.lastName}`

  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-4">
          {studentName}
          <Badge variant={typeBadgeVariants[type]} className="capitalize">
            {attendanceTypeLabels[type]}
          </Badge>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-4">
          <Badge variant={statusBadgeVariants[status]} className="capitalize">
            {attendanceStatusLabels[status]}
          </Badge>
          {type === "VISITOR" && (
            <Form method="post" id={formId}>
              <input type="hidden"></input>
            </Form>
          )}
        </div>
      </TableCell>
    </TableRow>
  )
}
