"use client"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { ArrowRight, Check, Download, RotateCcw, Trash2 } from "lucide-react"
import { cleanCart } from "@/lib/parts-order"
import { partMoney } from "@/lib/parts"
import { partsCopy } from "@/lib/parts-copy"
import type { Locale } from "@/lib/i18n"
import { usePartsReady, usePartsState, updatePartsState } from "./parts-state"
import { EmptyShop } from "./shop-ui"
import { PartsSummary } from "./order-summary"
export function PartsConfirmation({ locale }: { locale: Locale }) {
  const t = partsCopy(locale)
  const ready = usePartsReady()
  const { orders } = usePartsState()
  const params = useSearchParams()
  const router = useRouter()
  const order = orders.find((item) => item.id === params.get("id"))
  const [feedback, setFeedback] = useState("")
  if (!ready) return <p className="parts-loading">{t.loaded}</p>
  if (!order)
    return (
      <EmptyShop
        locale={locale}
        title={t.orderMissing}
        text={t.orderMissingText}
        account
      />
    )
  const reorderAvailable = cleanCart(order.lines).length > 0
  function download() {
    if (!order) return
    const text = [
      `Logbullet — ${t.reference} ${order.id}`,
      `${t.orderDate}: ${new Date(order.createdAt).toLocaleDateString(locale)}`,
      "",
      ...order.lines.map(
        (line) =>
          `${line.quantity} × ${line.name[locale]} (${line.sku}) — ${partMoney(line.quantity * line.priceCents, locale)}`
      ),
      "",
      `${t.subtotal}: ${partMoney(order.subtotalCents, locale)}`,
      t.taxDelivery,
      "",
      t.contact,
      ...Object.values(order.customer).filter(Boolean),
      "",
      order.delivery === "collection"
        ? `${t.collection}: ${t.collectionText}`
        : t.deliveryOption,
      order.notes,
      "",
      t.paymentText,
    ].join("\n")
    const url = URL.createObjectURL(
      new Blob([text], { type: "text/plain;charset=utf-8" })
    )
    const link = document.createElement("a")
    link.href = url
    link.download = `${order.id}.txt`
    link.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }
  return (
    <div className="parts-flow-page parts-confirmation">
      <div className="parts-confirm-icon">
        <Check size={32} strokeWidth={1.6} />
      </div>
      <h1>{t.saved}</h1>
      <p className="parts-flow-intro">{t.savedText}</p>
      <div className="parts-reference">
        <span>{t.reference}</span>
        <strong>{order.id}</strong>
        <button onClick={download}>
          <Download size={18} />
          {t.download}
        </button>
      </div>
      <div className="parts-flow-layout">
        <div>
          <section className="parts-checkout-items">
            <h2>{t.orderItems}</h2>
            <ul>
              {order.lines.map((line, index) => (
                <li key={`${line.id}-${index}`}>
                  <span>
                    {line.quantity} × {line.name[locale]}
                    <small>{line.sku}</small>
                  </span>
                  <strong>
                    {partMoney(line.priceCents * line.quantity, locale)}
                  </strong>
                </li>
              ))}
            </ul>
          </section>
          <section className="parts-saved-customer">
            <h2>{t.contact}</h2>
            <p>
              {order.customer.name}
              <br />
              {order.customer.email}
              {order.customer.phone && (
                <>
                  <br />
                  {order.customer.phone}
                </>
              )}
              {order.customer.company && (
                <>
                  <br />
                  {order.customer.company}
                </>
              )}
            </p>
            <h2>
              {order.delivery === "collection"
                ? t.collection
                : t.deliveryAddress}
            </h2>
            <p>
              {order.delivery === "collection" ? (
                t.collectionText
              ) : (
                <>
                  {order.customer.address}
                  <br />
                  {order.customer.postalCode} {order.customer.city}
                  <br />
                  {order.customer.country}
                </>
              )}
            </p>
            {(order.customer.model || order.customer.serial) && (
              <>
                <h2>{t.machineDetails}</h2>
                <p>
                  {order.customer.model === "logbullet"
                    ? "Logbullet"
                    : order.customer.model === "superbullet"
                      ? "Superbullet"
                      : order.customer.model === "megamax"
                        ? "Megamax"
                        : ""}
                  {order.customer.serial && ` · ${order.customer.serial}`}
                </p>
              </>
            )}
            {order.notes && (
              <>
                <h2>{t.notes}</h2>
                <p>{order.notes}</p>
              </>
            )}
          </section>
        </div>
        <PartsSummary
          locale={locale}
          subtotal={order.subtotalCents}
          collection={order.delivery === "collection"}
        >
          <Link
            className="button button-dark"
            href={`/${locale}/service-parts/account`}
          >
            {t.accountLink}
            <ArrowRight size={18} />
          </Link>
        </PartsSummary>
      </div>
      <div className="parts-confirm-actions">
        <button
          className="button button-dark"
          disabled={!reorderAvailable}
          onClick={() =>
            setFeedback(
              updatePartsState((state) => ({
                ...state,
                cart: cleanCart([...state.cart, ...order.lines]),
              }))
                ? t.itemsAdded
                : t.error
            )
          }
        >
          <RotateCcw size={18} />
          {t.repeat}
        </button>
        <Link href={`/${locale}/service-parts/cart`} className="text-link">
          {t.viewCart}
          <ArrowRight size={18} />
        </Link>
        <button
          className="parts-remove"
          onClick={() => {
            if (
              updatePartsState((state) => ({
                ...state,
                orders: state.orders.filter((item) => item.id !== order.id),
              }))
            )
              router.push(`/${locale}/service-parts/account`)
            else setFeedback(t.error)
          }}
        >
          <Trash2 size={18} />
          {t.deleteRequest}
        </button>
      </div>
      <p
        role="status"
        className={feedback === t.error ? "parts-error" : "parts-form-feedback"}
      >
        {feedback}
      </p>
    </div>
  )
}
