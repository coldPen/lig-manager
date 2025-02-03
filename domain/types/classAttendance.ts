export type AttendanceStatus = "PLANNED" | "ABSENT" | "CANCELLED";

export type TeacherEditableAttendanceStatus = Exclude<
  AttendanceStatus,
  "ABSENT" // this status is defined by students only
>;

export type StudentEditableAttendanceStatus = Exclude<
  AttendanceStatus,
  "CANCELLED" // this status is defined by teachers only
>;

export type AttendanceType = "REGULAR" | "VISITOR";

export type ClassAttendance = {
  status: AttendanceStatus;
  type: AttendanceType;
  id: string;
  student: {
    id: string;
    firstName: string;
    lastName: string;
  };
};
