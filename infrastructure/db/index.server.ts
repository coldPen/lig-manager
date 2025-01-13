import type { ClassRepository } from "domain/ports/classRepository"
import { PrismaClassRepository } from "./class"

// Singleton instance for server-side use
const classRepository: ClassRepository = new PrismaClassRepository()

export { classRepository }
