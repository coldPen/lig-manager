import { type ClassAttendance } from "domain/types/classAttendance"
import type { LevelName } from "domain/types/level"

export type ClassStatus = "PLANNED" | "CANCELLED"

export interface Class {
  id: string
  date: Date
  status: ClassStatus
  level: {
    id: string
    name: LevelName
  }
}

// export interface DetailedClass extends Class {
//   attendances: Array<ClassAttendance>
// }
export interface DetailedClass extends Class {
  attendances: {
    regular: Array<ClassAttendance & { type: "REGULAR" }>
    visitor: Array<ClassAttendance & { type: "VISITOR" }>
  }
}
