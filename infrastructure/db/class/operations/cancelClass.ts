import { prisma } from "~/lib/db.server"

export async function cancelClass(classId: string): Promise<void> {
  await prisma.class.update({
    where: { id: classId },
    data: { status: "CANCELLED" },
  })
}
