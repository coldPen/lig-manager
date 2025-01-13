import type { ClassRepository } from "domain/ports/classRepository"
import { getClass } from "./operations/getClass"
import { getIncomingClasses } from "./operations/getIncomingClasses"
import { cancelClass } from "./operations/cancelClass"
import { reinstateClass } from "./operations/reinstateClass"

export class PrismaClassRepository implements ClassRepository {
  getClass = getClass
  getIncomingClasses = getIncomingClasses
  cancelClass = cancelClass
  reinstateClass = reinstateClass
}