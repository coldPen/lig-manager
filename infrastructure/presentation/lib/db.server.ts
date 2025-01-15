import { singleton } from "./singleton.server"
import { PrismaClient } from "@prisma/client"
import { validateAttendanceStatus } from "infrastructure/persistence/middleware/attendanceValidation"
import { z } from "zod"

const dataSchema = z.object({
  id: z.string(),
  status: z.enum(["PLANNED", "ABSENT", "CANCELLED"]),
  type: z.enum(["REGULAR", "VISITOR"]),
  classId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

const prisma = singleton("prisma", () => {
  // NOTE: if you change anything in this function you'll need to restart
  // the dev server to see your changes.
  const client = new PrismaClient().$extends({
    query: {
      classAttendance: {
        async update({ args, query }) {
          const {
            data: { type, status },
          } = args

          validateAttendanceStatus(type, status)

          return query(args)
        },
      },
    },
  })
  // client.$use(attendanceValidationMiddleware)
  client.$connect()
  return client
})

export { prisma }
