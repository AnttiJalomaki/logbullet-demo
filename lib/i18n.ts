export const locales = ["en", "fi"] as const
export type Locale = (typeof locales)[number]
export const isLocale = (value: string): value is Locale =>
  locales.some((locale) => locale === value)
export const languageNames: Record<Locale, string> = {
  en: "English",
  fi: "Suomi",
}
export function preferredLocale(acceptLanguage: string | null): Locale {
  const candidates = (acceptLanguage ?? "")
    .split(",")
    .map((entry) => {
      const [tag, ...parameters] = entry.trim().toLowerCase().split(";")
      const quality = parameters.find((parameter) =>
        parameter.trim().startsWith("q=")
      )
      return {
        locale: tag.split("-")[0],
        quality: quality ? Number(quality.trim().slice(2)) : 1,
      }
    })
    .filter((candidate) => candidate.quality > 0 && candidate.quality <= 1)
    .sort((a, b) => b.quality - a.quality)
  for (const candidate of candidates) {
    if (isLocale(candidate.locale)) return candidate.locale
  }
  return "en"
}
export const localize = (value: { en: string; fi: string }, locale: Locale) =>
  value[locale]
export function money(value: number, locale: Locale) {
  return new Intl.NumberFormat(locale === "fi" ? "fi-FI" : "en-IE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value)
}
export function number(value: number, locale: Locale) {
  return new Intl.NumberFormat(locale === "fi" ? "fi-FI" : "en-GB").format(
    value
  )
}
