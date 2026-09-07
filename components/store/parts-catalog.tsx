"use client"
import { useSearchParams } from "next/navigation"
import { useId } from "react"
import { Search, SlidersHorizontal, X } from "lucide-react"
import type { Locale } from "@/lib/i18n"
import { machines } from "@/lib/catalog"
import { partCategories, searchParts, type PartCategory } from "@/lib/parts"
import { partsCopy } from "@/lib/parts-copy"
import { PartCard, ShopSupport } from "./shop-ui"

export function PartsCatalog({ locale }: { locale: Locale }) {
  const t = partsCopy(locale)
  const params = useSearchParams()
  const query = params.get("q") ?? ""
  const category = params.get("category") ?? ""
  const model = params.get("model") ?? ""
  const stock = params.get("stock") === "1"
  const sort = params.get("sort") ?? "relevance"
  function update(key: string, value: string) {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}${next.size ? `?${next}` : ""}`
    )
  }
  function clear() {
    window.history.replaceState(null, "", window.location.pathname)
  }
  const result = searchParts(query).filter(
    (part) =>
      (!category ||
        !(category in partCategories) ||
        part.category === category) &&
      (!model ||
        !machines.some((machine) => machine.id === model) ||
        part.models.some((value) => value === model)) &&
      (!stock || part.stock > 0)
  )
  if (sort === "price-asc") result.sort((a, b) => a.priceCents - b.priceCents)
  if (sort === "price-desc") result.sort((a, b) => b.priceCents - a.priceCents)
  if (sort === "name")
    result.sort((a, b) => a.name[locale].localeCompare(b.name[locale], locale))
  const active = !!(query || category || model || stock)
  return (
    <>
      <h1 className="sr-only">{t.shop}</h1>
      <div className="parts-catalog-layout">
        <aside className="parts-filters-desktop">
          <CatalogFilters
            locale={locale}
            category={category}
            model={model}
            stock={stock}
            update={update}
          />
          <button className="parts-reset" onClick={clear} disabled={!active}>
            {t.clear}
          </button>
        </aside>
        <section className="parts-results" aria-label={t.shop}>
          <h2 className="sr-only">{t.shop}</h2>
          <details className="parts-filters-mobile">
            <summary>
              <SlidersHorizontal size={20} />
              {t.filters}
              {(category || model || stock) && (
                <span className="parts-filter-dot" />
              )}
            </summary>
            <CatalogFilters
              locale={locale}
              category={category}
              model={model}
              stock={stock}
              update={update}
            />
            <button className="parts-reset" onClick={clear} disabled={!active}>
              {t.clear}
            </button>
          </details>
          <div className="parts-results-toolbar">
            <p role="status">
              {result.length} {result.length === 1 ? t.singlePart : t.results}
            </p>
            <label>
              {t.sort}
              <select
                value={sort}
                onChange={(event) => update("sort", event.target.value)}
              >
                <option value="relevance">{t.relevance}</option>
                <option value="price-asc">{t.priceAsc}</option>
                <option value="price-desc">{t.priceDesc}</option>
                <option value="name">{t.name}</option>
              </select>
            </label>
          </div>
          {active && (
            <div className="parts-filter-chips">
              {query && (
                <button
                  onClick={() => update("q", "")}
                  aria-label={`${t.remove}: ${query}`}
                >
                  “{query}”<X size={16} />
                </button>
              )}
              {category in partCategories && (
                <button onClick={() => update("category", "")}>
                  {partCategories[category as PartCategory][locale]}
                  <X size={16} />
                </button>
              )}
              {machines
                .filter((machine) => machine.id === model)
                .map((machine) => (
                  <button key={machine.id} onClick={() => update("model", "")}>
                    {machine.name}
                    <X size={16} />
                  </button>
                ))}
              {stock && (
                <button onClick={() => update("stock", "")}>
                  {t.stockOnly}
                  <X size={16} />
                </button>
              )}
            </div>
          )}
          {result.length ? (
            <div className="parts-grid">
              {result.map((part) => (
                <PartCard key={part.id} part={part} locale={locale} />
              ))}
            </div>
          ) : (
            <div className="parts-no-results">
              <Search size={32} />
              <h2>{t.noResults}</h2>
              <p>{t.noResultsText}</p>
              <button className="button button-dark" onClick={clear}>
                {t.clear}
              </button>
            </div>
          )}
          <p className="parts-price-note">{t.taxDelivery}</p>
        </section>
      </div>
      <ShopSupport locale={locale} />
    </>
  )
}
function CatalogFilters({
  locale,
  category,
  model,
  stock,
  update,
}: {
  locale: Locale
  category: string
  model: string
  stock: boolean
  update: (key: string, value: string) => void
}) {
  const t = partsCopy(locale)
  const id = useId()
  return (
    <div className="parts-facets">
      <fieldset>
        <legend>{t.categories}</legend>
        <button
          type="button"
          aria-pressed={!category}
          onClick={() => update("category", "")}
        >
          {t.allCategories}
        </button>
        {Object.entries(partCategories).map(([key, name]) => (
          <button
            type="button"
            key={key}
            aria-pressed={category === key}
            onClick={() => update("category", category === key ? "" : key)}
          >
            {name[locale]}
          </button>
        ))}
      </fieldset>
      <label className="parts-model-filter" htmlFor={`${id}-model`}>
        {t.machine}
        <select
          id={`${id}-model`}
          value={model}
          onChange={(event) => update("model", event.target.value)}
        >
          <option value="">{t.allMachines}</option>
          {machines.map((machine) => (
            <option key={machine.id} value={machine.id}>
              {machine.name}
            </option>
          ))}
        </select>
      </label>
      <label className="parts-checkbox">
        <input
          type="checkbox"
          checked={stock}
          onChange={(event) => update("stock", event.target.checked ? "1" : "")}
        />
        {t.stockOnly}
      </label>
    </div>
  )
}
