import type { Localized } from "./catalog"
import { getPart } from "./parts"

export type CartLine = { id: string; quantity: number }
export type Customer = {
  name: string
  email: string
  phone: string
  company: string
  address: string
  postalCode: string
  city: string
  country: string
  model: string
  serial: string
}
export type PartsOrder = {
  id: string
  createdAt: string
  customer: Customer
  delivery: "delivery" | "collection"
  notes: string
  lines: {
    id: string
    sku: string
    name: Localized
    priceCents: number
    quantity: number
  }[]
  subtotalCents: number
}
export type PartsState = {
  version: 1
  cart: CartLine[]
  customer: Customer
  orders: PartsOrder[]
}
export const emptyCustomer: Customer = {
  name: "",
  email: "",
  phone: "",
  company: "",
  address: "",
  postalCode: "",
  city: "",
  country: "",
  model: "",
  serial: "",
}
export const emptyPartsState: PartsState = {
  version: 1,
  cart: [],
  customer: emptyCustomer,
  orders: [],
}
const object = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value)
export function cleanCart(value: unknown): CartLine[] {
  if (!Array.isArray(value)) return []
  const items = new Map<string, number>()
  for (const line of value.slice(0, 200)) {
    if (
      !object(line) ||
      typeof line.id !== "string" ||
      typeof line.quantity !== "number" ||
      !Number.isFinite(line.quantity)
    )
      continue
    const part = getPart(line.id)
    if (!part || part.stock === 0 || line.quantity <= 0) continue
    items.set(
      part.id,
      Math.min(
        part.stock,
        99,
        (items.get(part.id) ?? 0) + Math.floor(line.quantity)
      )
    )
  }
  return Array.from(items, ([id, quantity]) => ({ id, quantity })).filter(
    (line) => line.quantity > 0
  )
}
export function cleanCustomer(value: unknown): Customer {
  const result = { ...emptyCustomer }
  if (object(value))
    for (const key of Object.keys(result) as (keyof Customer)[])
      result[key] =
        typeof value[key] === "string" ? value[key].trim().slice(0, 200) : ""
  return result
}
export function cartSubtotal(cart: CartLine[]) {
  return cleanCart(cart).reduce(
    (total, line) => total + getPart(line.id)!.priceCents * line.quantity,
    0
  )
}
export function createPartsOrder(
  cart: CartLine[],
  customer: Customer,
  delivery: PartsOrder["delivery"],
  notes: string,
  id: string,
  createdAt: string
): PartsOrder {
  const clean = cleanCart(cart)
  if (!clean.length) throw new Error("empty-cart")
  return {
    id,
    createdAt,
    customer: cleanCustomer(customer),
    delivery,
    notes: notes.trim().slice(0, 2000),
    subtotalCents: cartSubtotal(clean),
    lines: clean.map((line) => {
      const part = getPart(line.id)!
      return {
        ...line,
        sku: part.sku,
        name: { ...part.name },
        priceCents: part.priceCents,
      }
    }),
  }
}
function parseOrder(value: unknown): PartsOrder | null {
  if (
    !object(value) ||
    typeof value.id !== "string" ||
    !/^LB-P-[A-F0-9]{10}$/.test(value.id) ||
    typeof value.createdAt !== "string" ||
    Number.isNaN(Date.parse(value.createdAt)) ||
    !Array.isArray(value.lines) ||
    value.lines.length === 0 ||
    value.lines.length > 100
  )
    return null
  const lines: PartsOrder["lines"] = []
  for (const line of value.lines) {
    if (
      !object(line) ||
      typeof line.id !== "string" ||
      typeof line.sku !== "string" ||
      !object(line.name) ||
      typeof line.name.en !== "string" ||
      typeof line.name.fi !== "string" ||
      !Number.isSafeInteger(line.quantity) ||
      Number(line.quantity) < 1 ||
      Number(line.quantity) > 99 ||
      !Number.isSafeInteger(line.priceCents) ||
      Number(line.priceCents) < 0 ||
      Number(line.priceCents) > 10000000
    )
      return null
    lines.push({
      id: line.id.slice(0, 100),
      sku: line.sku.slice(0, 100),
      name: { en: line.name.en.slice(0, 200), fi: line.name.fi.slice(0, 200) },
      priceCents: Number(line.priceCents),
      quantity: Number(line.quantity),
    })
  }
  if (value.delivery !== "delivery" && value.delivery !== "collection")
    return null
  return {
    id: value.id,
    createdAt: value.createdAt,
    customer: cleanCustomer(value.customer),
    delivery: value.delivery,
    notes: typeof value.notes === "string" ? value.notes.slice(0, 2000) : "",
    lines,
    subtotalCents: lines.reduce(
      (total, line) => total + line.priceCents * line.quantity,
      0
    ),
  }
}
export function parsePartsState(raw: string | null): PartsState {
  if (!raw) return emptyPartsState
  try {
    const value: unknown = JSON.parse(raw)
    if (!object(value) || value.version !== 1) return emptyPartsState
    return {
      version: 1,
      cart: cleanCart(value.cart),
      customer: cleanCustomer(value.customer),
      orders: Array.isArray(value.orders)
        ? value.orders
            .slice(0, 20)
            .map(parseOrder)
            .filter((order): order is PartsOrder => order !== null)
        : [],
    }
  } catch {
    return emptyPartsState
  }
}
