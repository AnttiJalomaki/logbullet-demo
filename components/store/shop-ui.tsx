"use client"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useState } from "react"
import {
  ArrowRight,
  Check,
  Minus,
  Plus,
  ShoppingBag,
  UserRound,
} from "lucide-react"
import type { Locale } from "@/lib/i18n"
import { partMoney, type Part } from "@/lib/parts"
import { partsCopy } from "@/lib/parts-copy"
import { addPart, usePartsState } from "./parts-state"

export function ShopBar({ locale }: { locale: Locale }) {
  const t = partsCopy(locale)
  const pathname = usePathname()
  const { cart } = usePartsState()
  const count = cart.reduce((total, line) => total + line.quantity, 0)
  const root = `/${locale}/service-parts`
  return (
    <nav className="parts-bar" aria-label={t.shop}>
      <Link
        href={root}
        className="parts-bar-title"
        aria-current={pathname === root ? "page" : undefined}
      >
        {t.shop}
      </Link>
      <div>
        <Link
          href={`${root}/account`}
          aria-label={t.account}
          aria-current={pathname === `${root}/account` ? "page" : undefined}
        >
          <UserRound size={20} />
          <span>{t.account}</span>
        </Link>
        <Link
          href={`${root}/cart`}
          aria-current={pathname === `${root}/cart` ? "page" : undefined}
        >
          <ShoppingBag size={20} />
          <span>{t.cart}</span>
          <span className="parts-cart-count">{count}</span>
        </Link>
      </div>
    </nav>
  )
}
export function PartImage({
  part,
  locale,
  priority = false,
}: {
  part: Part
  locale: Locale
  priority?: boolean
}) {
  return (
    <Image
      src={part.image}
      alt={part.name[locale]}
      fill
      sizes="(max-width: 600px) 90vw, (max-width: 1000px) 45vw, 30vw"
      preload={priority}
      className={`parts-image ${part.image.endsWith(".svg") ? "parts-illustration" : ""}`}
    />
  )
}
export function AddToCart({
  part,
  locale,
  quantity = 1,
  large = false,
}: {
  part: Part
  locale: Locale
  quantity?: number
  large?: boolean
}) {
  const t = partsCopy(locale)
  const [feedback, setFeedback] = useState("")
  const { cart } = usePartsState()
  const existing = cart.find((line) => line.id === part.id)?.quantity ?? 0
  const maxed = existing + quantity > Math.min(part.stock, 99)
  return (
    <div className={`parts-add-wrap ${large ? "parts-add-large" : ""}`}>
      <button
        className="parts-add"
        disabled={!part.stock || maxed}
        onClick={() =>
          setFeedback(addPart(part.id, quantity) ? t.added : t.error)
        }
        title={maxed && part.stock > 0 ? t.maxQuantity : undefined}
      >
        {feedback === t.added ? <Check size={18} /> : <Plus size={18} />}
        {!part.stock ? t.unavailable : feedback === t.added ? t.added : t.add}
      </button>
      <span
        role="status"
        className={feedback === t.error ? "parts-error" : "sr-only"}
      >
        {feedback ? `${part.name[locale]}: ${feedback}` : ""}
      </span>
    </div>
  )
}
export function PartCard({ part, locale }: { part: Part; locale: Locale }) {
  const t = partsCopy(locale)
  return (
    <article className="parts-card">
      <Link
        href={`/${locale}/service-parts/${part.id}`}
        className="parts-card-image"
        tabIndex={-1}
        aria-hidden="true"
      >
        <PartImage part={part} locale={locale} />
      </Link>
      <div className="parts-card-content">
        <p className="parts-sku">{part.sku}</p>
        <h3>
          <Link href={`/${locale}/service-parts/${part.id}`}>
            {part.name[locale]}
          </Link>
        </h3>
        <p className="parts-card-fit">
          {part.models
            .map((model) =>
              model === "logbullet"
                ? "Logbullet"
                : model === "superbullet"
                  ? "Superbullet"
                  : "Megamax"
            )
            .join(" · ")}
        </p>
        <div className="parts-card-price">
          <strong>{partMoney(part.priceCents, locale)}</strong>
          <span>{t.tax}</span>
        </div>
        <span
          className={`parts-stock ${part.stock ? "" : "parts-stock-empty"}`}
        >
          <span />
          {part.stock ? t.inStock : t.unavailable}
        </span>
        <AddToCart part={part} locale={locale} />
      </div>
    </article>
  )
}
export function Quantity({
  value,
  max,
  onChange,
  locale,
  name,
}: {
  value: number
  max: number
  onChange: (value: number) => void
  locale: Locale
  name: string
}) {
  const t = partsCopy(locale)
  return (
    <div
      className="parts-quantity"
      role="group"
      aria-label={`${t.quantity}: ${name}`}
    >
      <button
        type="button"
        disabled={value <= 1}
        onClick={() => onChange(value - 1)}
        aria-label={`${t.decrease}: ${name}`}
      >
        <Minus size={16} />
      </button>
      <input
        type="number"
        aria-label={`${t.quantity}: ${name}`}
        min={1}
        max={max}
        value={value}
        onChange={(event) => {
          if (event.target.value)
            onChange(
              Math.min(
                max,
                Math.max(1, Math.floor(Number(event.target.value)) || 1)
              )
            )
        }}
      />
      <button
        type="button"
        disabled={value >= max}
        onClick={() => onChange(value + 1)}
        aria-label={`${t.increase}: ${name}`}
      >
        <Plus size={16} />
      </button>
    </div>
  )
}
export function ShopSupport({ locale }: { locale: Locale }) {
  const t = partsCopy(locale)
  return (
    <aside className="parts-support">
      <div>
        <h2>{t.support}</h2>
        <p>{t.supportText}</p>
      </div>
      <a className="text-link" href="mailto:info@logbullet.com">
        {t.supportAction}
        <ArrowRight size={20} />
      </a>
    </aside>
  )
}
export function EmptyShop({
  title,
  text,
  locale,
  account = false,
}: {
  title: string
  text: string
  locale: Locale
  account?: boolean
}) {
  const t = partsCopy(locale)
  return (
    <div className="parts-empty">
      <ShoppingBag size={36} strokeWidth={1.3} />
      <h1>{title}</h1>
      <p>{text}</p>
      <Link
        href={`/${locale}/service-parts${account ? "/account" : ""}`}
        className="button button-dark"
      >
        {account ? t.accountLink : t.continue}
        <ArrowRight size={18} />
      </Link>
    </div>
  )
}
