import { cancelClass } from "./operations/cancelClass"
import { getClass } from "./operations/getClass"
import { getIncomingClasses } from "./operations/getIncomingClasses"
import { reinstateClass } from "./operations/reinstateClass"
import type { ClassRepository } from "domain/ports/classRepository"

export class PrismaClassRepository implements ClassRepository {
  getClass = getClass
  getIncomingClasses = getIncomingClasses
  cancelClass = cancelClass
  reinstateClass = reinstateClass
}
