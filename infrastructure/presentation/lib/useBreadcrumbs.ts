import { useCallback, useMemo } from "react"
import { useMatches, type UIMatch } from "react-router"
import type { Handle as ClassesHandle } from "~/routes/classes"
import type {
  Handle as ClassViewHandle,
  LoaderData as ClassViewLoaderData,
} from "~/routes/classes/classView"

type Breadcrumb = {
  id: string
  content: string
  href: string
  isNotLast: boolean
}
export function useBreadcrumbs(): Array<Breadcrumb> {
  const uiMatches = useMatches()

  const getBreadcrumbMemo = useCallback(getBreadcrumb, [])

  const breadcrumbs = useMemo(() => {
    return uiMatches
      .reduce<Array<Omit<Breadcrumb, "isNotLast">>>((acc, match) => {
        const content = getBreadcrumbMemo(match)
        if (content !== null) {
          acc.push({
            id: match.id,
            content,
            href: match.pathname,
          })
        }
        return acc
      }, [])
      .map((breadcrumb, i, breadcrumbs) => {
        return {
          ...breadcrumb,
          isNotLast: i < breadcrumbs.length - 1,
        }
      })
  }, [uiMatches, getBreadcrumbMemo])

  return breadcrumbs
}

// Making heavy use of type castings
// as handle and data types are not inferred but don't need validation
function getBreadcrumb(routerMatch: UIMatch) {
  switch (routerMatch.id) {
    case "routes/classes/index": {
      const handle = routerMatch.handle as ClassesHandle
      return handle.label
    }
    case "routes/classes/classView": {
      const handle = routerMatch.handle as ClassViewHandle
      const data = routerMatch.data as ClassViewLoaderData
      return handle.getLabel(data.class_.level.name, data.class_.date)
    }
    default: {
      return null
    }
  }
}
