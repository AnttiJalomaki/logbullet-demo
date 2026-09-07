"use client"
import { useSyncExternalStore } from "react"
import { cleanCart, emptyPartsState, parsePartsState, type PartsState } from "@/lib/parts-order"

const key = "logbullet-parts-v1"
const eventName = "logbullet-parts-change"
let cachedRaw: string | null | undefined
let cachedState = emptyPartsState
function getSnapshot(): PartsState {
  try {
    const raw = localStorage.getItem(key)
    if (raw !== cachedRaw) { cachedRaw = raw; cachedState = parsePartsState(raw) }
    return cachedState
  } catch { return emptyPartsState }
}
function subscribe(callback: () => void) {
  const onStorage = (event: StorageEvent) => { if (event.key === key || event.key === null) callback() }
  window.addEventListener("storage", onStorage)
  window.addEventListener(eventName, callback)
  return () => { window.removeEventListener("storage", onStorage); window.removeEventListener(eventName, callback) }
}
export const usePartsState = () => useSyncExternalStore(subscribe, getSnapshot, () => emptyPartsState)
const subscribeReady = () => () => {}
export const usePartsReady = () => useSyncExternalStore(subscribeReady, () => true, () => false)
export function updatePartsState(change: (current: PartsState) => PartsState): boolean {
  try {
    const next = change(getSnapshot())
    const raw = JSON.stringify(next)
    localStorage.setItem(key, raw)
    cachedRaw = raw
    cachedState = next
    window.dispatchEvent(new Event(eventName))
    return true
  } catch { return false }
}
export function addPart(id: string, quantity = 1) {
  return updatePartsState((state) => ({ ...state, cart: cleanCart([...state.cart, { id, quantity }]) }))
}
export function setPartQuantity(id: string, quantity: number) {
  return updatePartsState((state) => ({ ...state, cart: cleanCart(state.cart.map((line) => line.id === id ? { id, quantity } : line)) }))
}
