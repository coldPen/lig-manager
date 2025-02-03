import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "infrastructure/presentation/components/ui/breadcrumb";
import { useBreadcrumbs } from "infrastructure/presentation/lib/useBreadcrumbs";
import { NavLink, Outlet } from "react-router";
import { Fragment } from "react/jsx-runtime";

export const handle = {
  label: "Liste des prochains cours",
};
export type Handle = typeof handle;

export default function Classes() {
  const breadcrumbs = useBreadcrumbs();

  return (
    <div className="p-12 flex flex-col gap-12">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">Gestion des présences</h1>
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.map((breadcrumb) => (
              <Fragment key={breadcrumb.id}>
                {breadcrumb.isNotLast ? (
                  <>
                    <BreadcrumbItem>
                      <BreadcrumbLink asChild>
                        <NavLink to={breadcrumb.href}>
                          {breadcrumb.content}
                        </NavLink>
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                  </>
                ) : (
                  <BreadcrumbItem>
                    <BreadcrumbPage>{breadcrumb.content}</BreadcrumbPage>
                  </BreadcrumbItem>
                )}
              </Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
