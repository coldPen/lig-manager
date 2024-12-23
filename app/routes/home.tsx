import { prisma } from "~/utils/db.server"
import type { Route } from "./+types/home"
import { getWeek, isSameWeek } from "date-fns"

const AttendanceType = {
  REGULAR: "REGULAR",
  VISITOR: "VISITOR",
} as const
const AttendanceStatus = {
  PLANNED: "PLANNED",
  ABSENT: "ABSENT",
  CANCELLED: "CANCELLED",
} as const

export async function loader() {
  const incomingClasses = (
    await prisma.class.findMany({
      where: {
        date: {
          gte: new Date(),
        },
      },
      select: {
        id: true,
        date: true,
        level: {
          select: {
            id: true,
            name: true,
          },
        },
        attendances: {
          select: {
            id: true,
            status: true,
            type: true,
            student: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    })
  ).sort((a, b) => a.date.getTime() - b.date.getTime())

  return {
    incomingClasses,
  }
}

export default function Home({
  loaderData: { incomingClasses },
}: Route.ComponentProps) {
  return (
    <div className="p-12">
      <h1 className="text-4xl font-bold">Gestion des présences - Accueil</h1>
      <h2 className="text-2xl">Cours à venir</h2>
      <section className="flex flex-col gap-6">
        {incomingClasses.map((class_) => {
          const date = class_.date.toLocaleDateString("fr-FR", {
            timeZone: "Europe/Paris",
            dateStyle: "long",
          })
          const time = class_.date.toLocaleTimeString("fr-FR", {
            timeZone: "Europe/Paris",
            hour: "2-digit",
            hour12: false,
          })
          return (
            <article key={class_.id} className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <h3 className="card-title">{class_.level.name}</h3>
                <h4 className="text-sm">{`${date} à ${time}`}</h4>
                <table className="table table-xs">
                  {class_.attendances.map((attendance) => {
                    const studentName = `${attendance.student.firstName} ${attendance.student.lastName}`
                    return (
                      <tr key={attendance.id}>
                        <td>{studentName}</td>
                        <td>
                          <span className="badge badge-neutral">
                            {attendance.type}
                          </span>
                        </td>
                        <td>
                          <span className="badge badge-neutral">
                            {attendance.status}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </table>
              </div>
            </article>
          )
        })}
      </section>
    </div>
  )
}
