"use client"
import Link from "next/link"
import { useState } from "react"
import { ArrowLeft, ArrowRight, Trash2 } from "lucide-react"
import { getPart, partMoney } from "@/lib/parts"
import { cartSubtotal } from "@/lib/parts-order"
import { partsCopy } from "@/lib/parts-copy"
import type { Locale } from "@/lib/i18n"
import { setPartQuantity, usePartsReady, usePartsState } from "./parts-state"
import { EmptyShop, PartImage, Quantity } from "./shop-ui"
import { PartsSummary } from "./order-summary"
export function PartsCart({ locale }: { locale: Locale }) {
  const t = partsCopy(locale)
  const ready = usePartsReady()
  const { cart } = usePartsState()
  const [error, setError] = useState("")
  const change = (id: string, quantity: number) =>
    setError(setPartQuantity(id, quantity) ? "" : t.error)
  if (!ready) return <p className="parts-loading">{t.loaded}</p>
  if (!cart.length)
    return (
      <EmptyShop locale={locale} title={t.emptyCart} text={t.emptyCartText} />
    )
  return (
    <div className="parts-flow-page">
      <Link href={`/${locale}/service-parts`} className="parts-back">
        <ArrowLeft size={18} />
        {t.continue}
      </Link>
      <h1>
        {t.cart}
        <span className="parts-heading-count">
          {cart.reduce((total, line) => total + line.quantity, 0)}
        </span>
      </h1>
      <div className="parts-flow-layout">
        <section aria-label={t.orderItems}>
          <ul className="parts-cart-lines">
            {cart.map((line) => {
              const part = getPart(line.id)!
              return (
                <li key={line.id} className="parts-cart-line">
                  <Link
                    href={`/${locale}/service-parts/${part.id}`}
                    className="parts-cart-image"
                  >
                    <PartImage part={part} locale={locale} />
                  </Link>
                  <div className="parts-cart-info">
                    <p className="parts-sku">{part.sku}</p>
                    <h2>
                      <Link href={`/${locale}/service-parts/${part.id}`}>
                        {part.name[locale]}
                      </Link>
                    </h2>
                    <p>
                      {partMoney(part.priceCents, locale)} · {t.tax}
                    </p>
                    <div className="parts-cart-controls">
                      <Quantity
                        locale={locale}
                        name={part.name[locale]}
                        value={line.quantity}
                        max={Math.min(part.stock, 99)}
                        onChange={(value) => change(part.id, value)}
                      />
                      <button
                        className="parts-remove"
                        aria-label={`${t.remove}: ${part.name[locale]}`}
                        onClick={() => change(part.id, 0)}
                      >
                        <Trash2 size={18} />
                        <span>{t.remove}</span>
                      </button>
                    </div>
                  </div>
                  <strong className="parts-line-total">
                    {partMoney(part.priceCents * line.quantity, locale)}
                  </strong>
                </li>
              )
            })}
          </ul>
          {error && (
            <p role="alert" className="parts-error">
              {error}
            </p>
          )}
        </section>
        <PartsSummary locale={locale} subtotal={cartSubtotal(cart)}>
          <Link
            className="button button-orange"
            href={`/${locale}/service-parts/checkout`}
          >
            {t.checkout}
            <ArrowRight size={18} />
          </Link>
        </PartsSummary>
      </div>
    </div>
  )
}
