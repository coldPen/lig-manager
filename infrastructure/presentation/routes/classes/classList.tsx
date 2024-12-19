import type { Route } from ".react-router/types/infrastructure/presentation/routes/classes/+types/classList"
import { type Class } from "domain/types/class"
import { getIncomingClasses } from "infrastructure/db/getIncomingClasses"
import { buttonVariants } from "infrastructure/presentation/components/ui/button"
import { convertDateToLocaleStrings } from "infrastructure/presentation/lib/convertDateToLocalStrings"
import { useId } from "react"
import { Form, NavLink } from "react-router"
import { Badge } from "~/components/ui/badge"
import { Label } from "~/components/ui/label"
import { Switch } from "~/components/ui/switch"
import { levelLabels } from "~/constants/labels"
import { cn } from "~/lib/utils"

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url)
  const includeCancelled = url.searchParams.get("includeCancelled") === "true"

  return {
    incomingClasses: await getIncomingClasses(includeCancelled),
    includeCancelled,
  }
}

export default function ClassList({
  loaderData: { incomingClasses, includeCancelled },
}: Route.ComponentProps) {
  const switchId = useId()
  return (
    <div className="flex flex-col gap-8">
      <aside>
        <Form method="get">
          <div className="flex items-center gap-2">
            <Switch
              type="submit"
              name="includeCancelled"
              value="true"
              defaultChecked={includeCancelled}
              id={switchId}
            />
            <Label htmlFor={switchId}>Afficher les cours annulés</Label>
          </div>
        </Form>
      </aside>
      <section className="grid grid-cols-[repeat(auto-fit,minmax(16rem,1fr))] gap-8">
        {incomingClasses.map((class_) => (
          <ClassPreview key={class_.id} class_={class_} />
        ))}
      </section>
    </div>
  )
}

function ClassPreview({ class_ }: { class_: Class }) {
  const { date, time } = convertDateToLocaleStrings(class_.date)
  return (
    <article
      key={class_.id}
      className={cn(
        "flex flex-col gap-2 border p-4 rounded shadow-sm",
        class_.status === "CANCELLED" && "opacity-60 shadow-none bg-slate-100",
      )}
    >
      <div className="flex justify-between items-start">
        <header>
          <h3 className="font-semibold">{`Niveau ${levelLabels[class_.level.name]}`}</h3>
          <p className="text-sm">{`${date} à ${time}`}</p>
        </header>
        {class_.status === "CANCELLED" && (
          <Badge variant="destructive">Annulé</Badge>
        )}
      </div>

      <NavLink
        to={class_.id}
        className={buttonVariants({ variant: "outline" })}
      >
        Voir le cours
      </NavLink>
    </article>
  )
}
