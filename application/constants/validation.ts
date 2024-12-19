import type { ClassAttendance } from "domain/types/classAttendance"

export const VALID_ATTENDANCE_STATUS: ReadonlyArray<ClassAttendance["status"]> =
  ["ABSENT", "CANCELLED", "PLANNED"] as const

export const VALID_ATTENDANCE_TYPE: ReadonlyArray<ClassAttendance["type"]> = [
  "REGULAR",
  "VISITOR",
] as const
