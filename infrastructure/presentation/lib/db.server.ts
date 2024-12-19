import { PrismaClient } from "@prisma/client"
import { singleton } from "./singleton.server"

const prisma = singleton("prisma", () => {
  // NOTE: if you change anything in this function you'll need to restart
  // the dev server to see your changes.
  const client = new PrismaClient()
  client.$connect()
  return client
})

export { prisma }
