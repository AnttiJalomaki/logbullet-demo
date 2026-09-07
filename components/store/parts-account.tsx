"use client"
import Link from "next/link"
import { useState, type SubmitEvent } from "react"
import { ArrowUpRight, Check, Package, UserRound } from "lucide-react"
import { cleanCustomer, emptyCustomer, type Customer } from "@/lib/parts-order"
import { partMoney } from "@/lib/parts"
import { partsCopy } from "@/lib/parts-copy"
import type { Locale } from "@/lib/i18n"
import { usePartsReady, usePartsState, updatePartsState } from "./parts-state"
import { CustomerFields } from "./customer-fields"
export function PartsAccount({ locale }: { locale: Locale }) {
  const t = partsCopy(locale)
  const ready = usePartsReady()
  const { customer, orders } = usePartsState()
  if (!ready) return <p className="parts-loading">{t.loaded}</p>
  return (
    <div className="parts-flow-page">
      <h1>{t.accountTitle}</h1>
      <p className="parts-flow-intro">{t.accountIntro}</p>
      <nav className="parts-account-tabs" aria-label={t.account}>
        <a href="#profile">
          <UserRound size={20} />
          {t.profile}
        </a>
        <a href="#requests">
          <Package size={20} />
          {t.savedRequests}
          <span>{orders.length}</span>
        </a>
      </nav>
      <div className="parts-account-layout">
        <section id="profile">
          <h2>{t.profile}</h2>
          <ProfileForm locale={locale} initialCustomer={customer} />
        </section>
        <section id="requests" className="parts-order-history">
          <h2>{t.savedRequests}</h2>
          {orders.length ? (
            <ul>
              {orders.map((order) => (
                <li key={order.id}>
                  <div className="parts-history-header">
                    <span className="parts-saved-status">
                      <Check size={15} />
                      {t.requested}
                    </span>
                    <time dateTime={order.createdAt}>
                      {new Date(order.createdAt).toLocaleDateString(
                        locale === "fi" ? "fi-FI" : "en-GB"
                      )}
                    </time>
                  </div>
                  <h3>{order.id}</h3>
                  <p>
                    {order.lines
                      .map((line) => `${line.quantity} × ${line.name[locale]}`)
                      .join(", ")}
                  </p>
                  <div className="parts-history-footer">
                    <strong>{partMoney(order.subtotalCents, locale)}</strong>
                    <Link
                      href={`/${locale}/service-parts/order?id=${order.id}`}
                    >
                      {t.viewRequest}
                      <ArrowUpRight size={18} />
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="parts-history-empty">
              <Package size={32} strokeWidth={1.4} />
              <p>{t.noOrders}</p>
              <Link className="text-link" href={`/${locale}/service-parts`}>
                {t.shop}
                <ArrowUpRight size={18} />
              </Link>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
function ProfileForm({
  locale,
  initialCustomer,
}: {
  locale: Locale
  initialCustomer: Customer
}) {
  const t = partsCopy(locale)
  const [customer, setCustomer] = useState(initialCustomer)
  const [feedback, setFeedback] = useState("")
  function save(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    setFeedback(
      updatePartsState((state) => ({
        ...state,
        customer: cleanCustomer(customer),
      }))
        ? t.profileSaved
        : t.error
    )
  }
  return (
    <form onSubmit={save}>
      <CustomerFields
        locale={locale}
        customer={customer}
        onChange={setCustomer}
        requireAddress={false}
      />
      <div className="parts-profile-actions">
        <button className="button button-dark" type="submit">
          {t.saveProfile}
          <Check size={18} />
        </button>
        <button
          className="parts-remove"
          type="button"
          onClick={() => {
            const saved = updatePartsState((state) => ({
              ...state,
              customer: { ...emptyCustomer },
            }))
            if (saved) setCustomer({ ...emptyCustomer })
            setFeedback(saved ? t.profileSaved : t.error)
          }}
        >
          {t.clearProfile}
        </button>
      </div>
      <p
        role="status"
        className={feedback === t.error ? "parts-error" : "parts-form-feedback"}
      >
        {feedback}
      </p>
    </form>
  )
}
