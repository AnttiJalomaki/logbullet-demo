"use client"
import Link from "next/link"
import { useState } from "react"
import { ArrowLeft, ArrowUpRight, BookOpen } from "lucide-react"
import { type Part, partMoney, parts } from "@/lib/parts"
import type { Locale } from "@/lib/i18n"
import { machines } from "@/lib/catalog"
import { partsCopy } from "@/lib/parts-copy"
import { AddToCart, PartCard, PartImage, Quantity } from "./shop-ui"

export function PartDetail({ part, locale }: { part: Part; locale: Locale }) {
  const t = partsCopy(locale)
  const [quantity, setQuantity] = useState(1)
  const related = parts
    .filter((other) => other.id !== part.id && other.guide === part.guide)
    .slice(0, 3)
  return (
    <div className="parts-detail-page">
      <Link href={`/${locale}/service-parts`} className="parts-back">
        <ArrowLeft size={18} />
        {t.back}
      </Link>
      <div className="parts-product-layout">
        <div className="parts-product-image">
          <PartImage part={part} locale={locale} priority />
        </div>
        <section className="parts-product-info">
          <p className="parts-sku">{part.sku}</p>
          <h1>{part.name[locale]}</h1>
          <p className="parts-product-description">
            {part.description[locale]}
          </p>
          <p className="parts-product-price">
            {partMoney(part.priceCents, locale)}
            <span>{t.tax}</span>
          </p>
          <span
            className={`parts-stock ${part.stock ? "" : "parts-stock-empty"}`}
          >
            <span />
            {part.stock ? t.inStock : t.unavailable}
          </span>
          <div className="parts-product-buy">
            {part.stock > 0 && (
              <Quantity
                value={quantity}
                max={Math.min(99, part.stock)}
                onChange={setQuantity}
                locale={locale}
                name={part.name[locale]}
              />
            )}
            <AddToCart part={part} locale={locale} quantity={quantity} large />
          </div>
          <Link href={`/${locale}/service-parts/cart`} className="text-link">
            {t.viewCart}
            <ArrowUpRight size={18} />
          </Link>
          <dl className="parts-specs">
            <div>
              <dt>{t.partNumber}</dt>
              <dd>{part.sku}</dd>
            </div>
            <div>
              <dt>{t.compatible}</dt>
              <dd>
                {machines
                  .filter((machine) => part.models.includes(machine.id))
                  .map((machine) => machine.name)
                  .join(" · ")}
              </dd>
            </div>
          </dl>
          <h2>{t.details}</h2>
          <p>{part.detail[locale]}</p>
          <p className="parts-price-note">{t.taxDelivery}</p>
        </section>
      </div>
      <aside className="parts-guide-link">
        <BookOpen size={30} strokeWidth={1.4} />
        <div>
          <h2>{t.related}</h2>
          <p>{t.relatedText}</p>
        </div>
        <Link
          href={`/${locale}/manual?guide=${part.guide}`}
          className="text-link"
        >
          {t.readGuide}
          <ArrowUpRight size={18} />
        </Link>
      </aside>
      {related.length > 0 && (
        <section className="parts-related">
          <h2>
            {locale === "fi" ? "Samaan huoltoon." : "For the same service."}
          </h2>
          <div className="parts-grid">
            {related.map((item) => (
              <PartCard key={item.id} part={item} locale={locale} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
