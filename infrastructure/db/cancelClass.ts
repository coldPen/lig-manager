import { prisma } from "~/lib/db.server"

export async function cancelClass(classId: string) {
  await prisma.class.update({
    where: {
      id: classId,
    },
    data: {
      status: "CANCELLED",
    },
  })
}
