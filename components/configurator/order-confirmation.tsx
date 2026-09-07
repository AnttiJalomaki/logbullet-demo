"use client"
import Image from "next/image"
import Link from "next/link"
import { useMemo, useState, useSyncExternalStore } from "react"
import { ArrowRight, Check, Download, Trash2 } from "lucide-react"
import { ORDER_STORAGE_KEY, parseDemoOrder } from "@/lib/order"
import { getMachine } from "@/lib/catalog"
import { money, type Locale } from "@/lib/i18n"
import type { Dictionary } from "@/lib/dictionaries"
function subscribe(callback: () => void) {
  window.addEventListener("storage", callback)
  return () => window.removeEventListener("storage", callback)
}
function snapshot() {
  try {
    return localStorage.getItem(ORDER_STORAGE_KEY)
  } catch {
    return null
  }
}
export function OrderConfirmation({
  locale,
  d,
}: {
  locale: Locale
  d: Dictionary
}) {
  const raw = useSyncExternalStore(subscribe, snapshot, () => null)
  const order = useMemo(() => parseDemoOrder(raw), [raw])
  const [cleared, setCleared] = useState(false)
  const [error, setError] = useState("")
  const machine = order ? getMachine(order.model) : null
  const reference = order?.id.replace(/^LB-DEMO-/, "LB-")
  const country = order
    ? /^[A-Z]{2}$/.test(order.contact.country)
      ? (new Intl.DisplayNames([locale], { type: "region" }).of(
          order.contact.country
        ) ?? order.contact.country)
      : order.contact.country
    : ""
  function clear() {
    try {
      localStorage.removeItem(ORDER_STORAGE_KEY)
      window.dispatchEvent(new Event("storage"))
      setCleared(true)
    } catch {
      setError(d.config.saveError)
    }
  }
  function download() {
    if (!order || !machine) return
    const lines = [
      `LOGBULLET — ${d.config.requestLabel}`,
      "",
      `${d.config.reference}: ${reference}`,
      new Intl.DateTimeFormat(locale, {
        dateStyle: "long",
        timeStyle: "short",
      }).format(new Date(order.createdAt)),
      "",
      machine.name,
      ...machine.equipment
        .filter((e) => order.options.includes(e.id))
        .map(
          (e) =>
            `${e.name[locale]} — ${e.price === null ? d.config.quote : money(e.price, locale)}`
        ),
      "",
      `${d.config.estimate}: ${money(order.estimate, locale)}`,
      order.unpriced ? d.config.unpriced : "",
      "",
      `${d.config.name}: ${order.contact.name}`,
      `${d.config.email}: ${order.contact.email}`,
      `${d.config.phone}: ${order.contact.phone}`,
      `${d.config.country}: ${country}`,
      `${d.config.company}: ${order.contact.company}`,
      order.contact.notes,
    ]
    const blob = new Blob([lines.join("\n")], {
      type: "text/plain;charset=utf-8",
    })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement("a")
    anchor.href = url
    anchor.download = `${reference}.txt`
    anchor.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }
  if (!order || !machine)
    return (
      <main id="main" className="empty-order section-pad">
        <h1>{cleared ? d.config.cleared : d.config.title}</h1>
        <p>{d.config.emptyRequest}</p>
        <Link
          href={`/${locale}/configure/logbullet`}
          className="button button-dark"
        >
          {d.home.configureAction}
          <ArrowRight size={17} />
        </Link>
      </main>
    )
  return (
    <main id="main" className="confirmation-page section-pad">
      <div className="confirmation-copy">
        <span className="confirmation-check">
          <Check size={28} />
        </span>
        <h1>{d.config.successTitle}</h1>
        <p>{d.config.successText}</p>
        <div className="confirmation-reference">
          <span>{d.config.reference}</span>
          <strong>{reference}</strong>
        </div>
        <div className="confirmation-actions">
          <button className="button button-dark" onClick={download}>
            <Download size={16} />
            {d.config.download}
          </button>
          <Link href={`/${locale}#machines`} className="text-link">
            {d.config.startAgain}
            <ArrowRight size={16} />
          </Link>
        </div>
        <button className="clear-order" onClick={clear}>
          <Trash2 size={14} />
          {d.config.clear}
        </button>
        {error && <p role="alert">{error}</p>}
      </div>
      <div className="confirmation-card">
        <div className="confirmation-image">
          <Image
            src={machine.image}
            alt={machine.name}
            fill
            sizes="(max-width: 800px) 100vw, 40vw"
            className="image-cover"
          />
        </div>
        <div className="confirmation-details">
          <h2>{machine.name}</h2>
          <p>{machine.tagline[locale]}</p>
          <div className="summary-line">
            <span>{d.models.basePrice}</span>
            <span>{money(machine.basePrice, locale)}</span>
          </div>
          {machine.equipment
            .filter((e) => order.options.includes(e.id))
            .map((e) => (
              <div className="summary-line" key={e.id}>
                <span>{e.name[locale]}</span>
                <span>
                  {e.price === null ? d.config.quote : money(e.price, locale)}
                </span>
              </div>
            ))}
          <div className="summary-line summary-total">
            <strong>{d.config.estimate}</strong>
            <strong>{money(order.estimate, locale)}</strong>
          </div>
          <p className="fine-print">
            {d.config.excluding}. {order.unpriced ? d.config.unpriced : ""}
          </p>
          <div className="confirmation-contact">
            <strong>{order.contact.name}</strong>
            <span>{order.contact.email}</span>
            <span>{country}</span>
          </div>
        </div>
      </div>
    </main>
  )
}
