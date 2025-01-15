import { invariantResponse } from "@epic-web/invariant"
import type {
  Prisma,
  AttendanceStatus as PrismaAttendanceStatus,
  AttendanceType as PrismaAttendanceType,
} from "@prisma/client"
import { match } from "ts-pattern"

const REGULAR_ALLOWED_STATUSES: ReadonlyArray<PrismaAttendanceStatus> = [
  "PLANNED",
  "ABSENT",
] as const

const VISITOR_ALLOWED_STATUSES: ReadonlyArray<PrismaAttendanceStatus> = [
  "PLANNED",
  "ABSENT",
  "CANCELLED",
] as const

export function validateAttendanceStatus(
  type:
    | PrismaAttendanceType
    | Prisma.EnumAttendanceTypeFieldUpdateOperationsInput
    | undefined,
  status:
    | PrismaAttendanceStatus
    | Prisma.EnumAttendanceStatusFieldUpdateOperationsInput
    | undefined,
): void {
  const actualType = typeof type === "object" ? type.set : type
  const actualStatus = typeof status === "object" ? status.set : status

  // TODO: if one (and only one) is undefined, replace it with the data from the db
  if (actualType === undefined || actualStatus === undefined) {
    return
  }

  match(actualType)
    .with("REGULAR", (regularType) => {
      invariantResponse(
        REGULAR_ALLOWED_STATUSES.includes(actualStatus),
        `Invalid status "${actualStatus}" for attendance type "${regularType}". Regular attendances can only be PLANNED or ABSENT`,
      )
    })
    .with("VISITOR", (visitorType) => {
      invariantResponse(
        VISITOR_ALLOWED_STATUSES.includes(actualStatus),
        `Invalid status "${actualStatus}" for attendance type "${visitorType}". Visitor attendances can only be PLANNED, ABSENT or CANCELLED`,
      )
    })
    .exhaustive()
}
