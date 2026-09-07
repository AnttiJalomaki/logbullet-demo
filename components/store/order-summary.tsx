import type { ReactNode } from "react"
import { partsCopy } from "@/lib/parts-copy"
import { partMoney } from "@/lib/parts"
import type { Locale } from "@/lib/i18n"
export function PartsSummary({
  locale,
  subtotal,
  collection = false,
  children,
}: {
  locale: Locale
  subtotal: number
  collection?: boolean
  children?: ReactNode
}) {
  const t = partsCopy(locale)
  return (
    <aside className="parts-summary">
      <h2>{t.summary}</h2>
      <dl>
        <div className="parts-summary-total">
          <dt>{t.subtotal}</dt>
          <dd>{partMoney(subtotal, locale)}</dd>
        </div>
        <div>
          <dt>{t.deliveryLabel}</dt>
          <dd>{collection ? t.collection : t.deliveryQuote}</dd>
        </div>
        <div>
          <dt>{t.vat}</dt>
          <dd>{t.vatQuote}</dd>
        </div>
      </dl>
      <div className="parts-payment">
        <h3>{t.payment}</h3>
        <p>{t.paymentText}</p>
      </div>
      {children}
    </aside>
  )
}
