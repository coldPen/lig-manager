import type { DetailedClass } from "domain/types/class"
import { prisma } from "~/lib/db.server"

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
  })

  if (!class_) {
    throw new Error(`Class not found: ${classId}`)
  }

  return class_
}
