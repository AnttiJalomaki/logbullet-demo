import type { ModelId } from "./catalog"
import type { Locale } from "./i18n"
export const ORDER_STORAGE_KEY = "logbullet-demo-order-v1"
export type ContactDetails = {
  name: string
  email: string
  phone: string
  company: string
  country: string
  customCountry: string
  notes: string
}
export type DemoOrder = {
  version: 1
  id: string
  createdAt: string
  locale: Locale
  model: ModelId
  options: string[]
  estimate: number
  unpriced: boolean
  contact: Omit<ContactDetails, "customCountry">
  status: "demo-saved"
}
export const emptyContact: ContactDetails = {
  name: "",
  email: "",
  phone: "",
  company: "",
  country: "",
  customCountry: "",
  notes: "",
}
export function parseDemoOrder(value: string | null): DemoOrder | null {
  if (!value) return null
  try {
    const data = JSON.parse(value)
    if (
      data.version !== 1 ||
      data.status !== "demo-saved" ||
      typeof data.id !== "string" ||
      typeof data.createdAt !== "string" ||
      !Number.isFinite(Date.parse(data.createdAt)) ||
      !["en", "fi"].includes(data.locale) ||
      !["logbullet", "superbullet", "megamax"].includes(data.model) ||
      !Array.isArray(data.options) ||
      !data.options.every((id: unknown) => typeof id === "string") ||
      typeof data.estimate !== "number" ||
      !Number.isFinite(data.estimate) ||
      typeof data.unpriced !== "boolean" ||
      !data.contact
    )
      return null
    for (const key of ["name", "email", "phone", "company", "country", "notes"])
      if (typeof data.contact[key] !== "string") return null
    return data as DemoOrder
  } catch {
    return null
  }
}
