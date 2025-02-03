import type { DetailedClass } from "domain/types/class";
import type { ClassAttendance } from "domain/types/classAttendance";
import { prisma } from "~/lib/db.server";

export async function getClass(classId: string): Promise<DetailedClass> {
  const class_ = await prisma.class.findFirst({
    where: { id: classId },
    select: {
      id: true,
      level: {
        select: {
          id: true,
          name: true,
        },
      },
      status: true,
      date: true,
      attendances: {
        select: {
          id: true,
          type: true,
          status: true,
          student: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      },
    },
  });

  if (!class_) {
    throw new Error(`Class not found: ${classId}`);
  }

  const classWithSeparatedAttendances: DetailedClass = {
    ...class_,
    attendances: {
      regular: class_.attendances.filter(
        (attendance): attendance is ClassAttendance & { type: "REGULAR" } =>
          attendance.type === "REGULAR",
      ),
      visitor: class_.attendances.filter(
        (attendance): attendance is ClassAttendance & { type: "VISITOR" } =>
          attendance.type === "VISITOR",
      ),
    },
  };

  return classWithSeparatedAttendances;
}
