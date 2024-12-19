import type { ClassStatus } from "domain/types/class"
import type {
  AttendanceStatus,
  AttendanceType,
  StudentEditableAttendanceStatus,
  TeacherEditableAttendanceStatus,
} from "domain/types/classAttendance"
import type { LevelName } from "domain/types/level"

export const levelLabels: Record<LevelName, string> = {
  BEGINNER: "débutant",
  INTERMEDIATE: "intermédiaire",
  ADVANCED: "avancé",
}

export const classStatusLabels: Record<ClassStatus, string> = {
  PLANNED: "planifié",
  CANCELLED: "annulé",
}

export const attendanceTypeLabels: Record<AttendanceType, string> = {
  REGULAR: "régulier",
  VISITOR: "visiteur",
}

export const attendanceStatusLabels: Record<AttendanceStatus, string> = {
  PLANNED: "planifié",
  ABSENT: "absent",
  CANCELLED: "annulé",
}

export const teacherEditableAttendanceStatusLabels: Record<
  TeacherEditableAttendanceStatus,
  string
> = {
  PLANNED: "planifié",
  CANCELLED: "annulé",
}

export const studentEditableAttendanceStatusLabels: Record<
  StudentEditableAttendanceStatus,
  string
> = {
  PLANNED: "planifié",
  ABSENT: "absent",
}
