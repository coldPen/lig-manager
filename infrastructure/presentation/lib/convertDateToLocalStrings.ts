type Style = "full" | "long" | "medium" | "short"
export function convertDateToLocaleStrings(
  date: Date,
  config?: {
    dateStyle?: Style
    timeStyle?: Style
  },
) {
  const { dateStyle = "full", timeStyle = "short" } = config || {}

  const date_ = date.toLocaleDateString("fr-FR", {
    timeZone: "Europe/Paris",
    dateStyle,
  })
  const time = date.toLocaleTimeString("fr-FR", {
    timeZone: "Europe/Paris",
    timeStyle,
  })
  return { date: date_, time }
}
