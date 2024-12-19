import { prisma } from "~/lib/db.server"

export async function reinstateClass(classId: string) {
  await prisma.class.update({
    where: {
      id: classId,
    },
    data: {
      status: "PLANNED",
    },
  })
}
