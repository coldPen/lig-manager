import { PrismaClassRepository } from "infrastructure/persistence/class"

// Server-side dependency injection
export const repositories = {
  class: new PrismaClassRepository(),
} as const

// Type-safe accessor for repositories
export function getRepository<T extends keyof typeof repositories>(
  name: T,
): (typeof repositories)[T] {
  return repositories[name]
}
