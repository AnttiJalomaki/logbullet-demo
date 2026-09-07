import type { Locale } from "./i18n"
import { en } from "./dictionaries/en"
import { fi } from "./dictionaries/fi"
export type { Dictionary } from "./dictionaries/en"
export function getDictionary(locale: Locale) {
  return locale === "fi" ? fi : en
}
