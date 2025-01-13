import type { DetailedClass, Class } from "../types/class"

export interface ClassRepository {
  getClass(classId: string): Promise<DetailedClass>
  getIncomingClasses(includeCancelled?: boolean): Promise<Array<Class>>
  cancelClass(classId: string): Promise<void>
  reinstateClass(classId: string): Promise<void>
}
