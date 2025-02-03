import { invariantResponse } from "@epic-web/invariant";
import {
  Prisma,
  type AttendanceStatus as PrismaAttendanceStatus,
  type AttendanceType as PrismaAttendanceType,
} from "@prisma/client";
import { match } from "ts-pattern";

const REGULAR_ALLOWED_STATUSES: ReadonlyArray<PrismaAttendanceStatus> = [
  "PLANNED",
  "ABSENT",
] as const;

const VISITOR_ALLOWED_STATUSES: ReadonlyArray<PrismaAttendanceStatus> = [
  "PLANNED",
  "ABSENT",
  "CANCELLED",
] as const;

export function validateAttendanceStatus({
  type,
  status,
}: {
  type:
    | PrismaAttendanceType
    | Prisma.EnumAttendanceTypeFieldUpdateOperationsInput
    | undefined;
  status:
    | PrismaAttendanceStatus
    | Prisma.EnumAttendanceStatusFieldUpdateOperationsInput
    | undefined;
}): void {
  const actualType = typeof type === "object" ? type.set : type;
  const actualStatus = typeof status === "object" ? status.set : status;

  if (actualType === undefined && actualStatus === undefined) {
    return;
  }

  invariantResponse(actualType !== undefined, "Type must be provided");

  invariantResponse(actualStatus !== undefined, "Status must be provided");

  match(actualType)
    .with("REGULAR", (regularType) => {
      invariantResponse(
        REGULAR_ALLOWED_STATUSES.includes(actualStatus),
        `Invalid status "${actualStatus}" for attendance type "${regularType}". Regular attendances can only be PLANNED or ABSENT`,
      );
    })
    .with("VISITOR", (visitorType) => {
      invariantResponse(
        VISITOR_ALLOWED_STATUSES.includes(actualStatus),
        `Invalid status "${actualStatus}" for attendance type "${visitorType}". Visitor attendances can only be PLANNED, ABSENT or CANCELLED`,
      );
    })
    .exhaustive();
}

export const attendanceValidationExtension = Prisma.defineExtension({
  name: "validate-attendance-type-and-status",
  query: {
    classAttendance: {
      async update({ args, query }) {
        const {
          data: { type, status },
        } = args;

        validateAttendanceStatus({ type, status });

        return query(args);
      },
    },
  },
});
