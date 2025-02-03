import type { Class } from "domain/types/class";
import { prisma } from "~/lib/db.server";

export async function getIncomingClasses(
  includeCancelled = false,
): Promise<Array<Class>> {
  return await prisma.class.findMany({
    select: {
      id: true,
      date: true,
      status: true,
      level: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    where: {
      date: {
        gte: new Date(),
      },
      status: includeCancelled ? undefined : "PLANNED",
    },
    orderBy: {
      date: "asc",
    },
  });
}
