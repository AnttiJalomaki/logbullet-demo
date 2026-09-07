"use client"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useRef, useState, type SubmitEvent } from "react"
import { ArrowLeft, ArrowRight, Check, Package, Truck } from "lucide-react"
import {
  cartSubtotal,
  createPartsOrder,
  type Customer,
} from "@/lib/parts-order"
import { getPart, partMoney } from "@/lib/parts"
import { partsCopy } from "@/lib/parts-copy"
import type { Locale } from "@/lib/i18n"
import { usePartsReady, usePartsState, updatePartsState } from "./parts-state"
import { CustomerFields } from "./customer-fields"
import { PartsSummary } from "./order-summary"
import { EmptyShop } from "./shop-ui"
export function PartsCheckout({ locale }: { locale: Locale }) {
  const ready = usePartsReady()
  const state = usePartsState()
  const t = partsCopy(locale)
  if (!ready) return <p className="parts-loading">{t.loaded}</p>
  return <CheckoutForm locale={locale} initialCustomer={state.customer} />
}
function CheckoutForm({
  locale,
  initialCustomer,
}: {
  locale: Locale
  initialCustomer: Customer
}) {
  const t = partsCopy(locale)
  const { cart } = usePartsState()
  const router = useRouter()
  const [customer, setCustomer] = useState(initialCustomer)
  const [delivery, setDelivery] = useState<"delivery" | "collection">(
    "delivery"
  )
  const [notes, setNotes] = useState("")
  const [saveProfile, setSaveProfile] = useState(false)
  const [error, setError] = useState("")
  const [pending, setPending] = useState(false)
  const submitting = useRef(false)
  function submit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    if (submitting.current) return
    submitting.current = true
    setPending(true)
    const id = `LB-P-${crypto.randomUUID().replaceAll("-", "").slice(0, 10).toUpperCase()}`
    const saved = updatePartsState((state) => {
      const order = createPartsOrder(
        state.cart,
        customer,
        delivery,
        notes,
        id,
        new Date().toISOString()
      )
      return {
        ...state,
        cart: [],
        customer: saveProfile ? order.customer : state.customer,
        orders: [order, ...state.orders].slice(0, 20),
      }
    })
    if (saved) router.push(`/${locale}/service-parts/order?id=${id}`)
    else {
      setError(t.error)
      setPending(false)
      submitting.current = false
    }
  }
  if (!cart.length && !pending)
    return <EmptyShop locale={locale} title={t.emptyCart} text={t.emptyOrder} />
  return (
    <div className="parts-flow-page">
      <Link href={`/${locale}/service-parts/cart`} className="parts-back">
        <ArrowLeft size={18} />
        {t.viewCart}
      </Link>
      <h1>{t.checkoutTitle}</h1>
      <p className="parts-flow-intro">{t.checkoutIntro}</p>
      <form onSubmit={submit} className="parts-flow-layout">
        <div>
          <fieldset className="parts-form-section">
            <legend>{t.deliveryMethod}</legend>
            <div className="parts-delivery-options">
              {(["delivery", "collection"] as const).map((option) => (
                <label
                  key={option}
                  className={delivery === option ? "is-selected" : ""}
                >
                  <input
                    type="radio"
                    name="delivery"
                    value={option}
                    checked={delivery === option}
                    onChange={() => setDelivery(option)}
                  />
                  {option === "delivery" ? (
                    <Truck size={24} />
                  ) : (
                    <Package size={24} />
                  )}
                  <span>
                    {option === "delivery" ? t.deliveryOption : t.collection}
                  </span>
                  {delivery === option && <Check size={18} />}
                </label>
              ))}
            </div>
            {delivery === "collection" && <p>{t.collectionText}</p>}
          </fieldset>
          <CustomerFields
            locale={locale}
            customer={customer}
            onChange={setCustomer}
            requireAddress={delivery === "delivery"}
          />
          <label className="parts-checkbox parts-save-details">
            <input
              type="checkbox"
              checked={saveProfile}
              onChange={(event) => setSaveProfile(event.target.checked)}
            />
            {t.saveDetails}
          </label>
          <label className="parts-notes">
            {t.notes}
            <textarea
              rows={4}
              maxLength={2000}
              placeholder={t.notesPlaceholder}
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
            />
          </label>
        </div>
        <div>
          <section className="parts-checkout-items">
            <h2>{t.orderItems}</h2>
            <ul>
              {cart.map((line) => {
                const part = getPart(line.id)!
                return (
                  <li key={line.id}>
                    <span>
                      {line.quantity} × {part.name[locale]}
                    </span>
                    <strong>
                      {partMoney(part.priceCents * line.quantity, locale)}
                    </strong>
                  </li>
                )
              })}
            </ul>
          </section>
          <PartsSummary
            locale={locale}
            subtotal={cartSubtotal(cart)}
            collection={delivery === "collection"}
          >
            <button
              className="button button-orange"
              type="submit"
              disabled={pending}
            >
              {pending ? t.savedState : t.request}
              <ArrowRight size={18} />
            </button>
            {error && (
              <p role="alert" className="parts-error">
                {error}
              </p>
            )}
          </PartsSummary>
        </div>
      </form>
    </div>
  )
}
