import { singleton } from "./singleton.server"
import { PrismaClient } from "@prisma/client"
import { attendanceValidationExtension } from "infrastructure/persistence/middleware/attendanceValidation"

const prisma = singleton("prisma", () => {
  // NOTE: if you change anything in this function you'll need to restart
  // the dev server to see your changes.
  const client = new PrismaClient()

  // Extension that validates the status and type of an attendance record
  client.$extends(attendanceValidationExtension)

  client.$connect()

  return client
})

export { prisma }
