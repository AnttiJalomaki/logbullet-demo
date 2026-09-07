"use client"
import Link from "next/link"
import Image from "next/image"
import { useSearchParams } from "next/navigation"
import { useState } from "react"
import {
  ArrowRight,
  ArrowLeft,
  ArrowUpRight,
  BookOpen,
  Check,
  ChevronRight,
  Printer,
  RotateCcw,
} from "lucide-react"
import type { Locale } from "@/lib/i18n"
import {
  findManualTopics,
  maintenanceGuides,
  manualCategories,
  manualTopics,
} from "@/lib/manual"
import { BarSearch } from "./bar-search"
export function ManualContent({ locale }: { locale: Locale }) {
  const fi = locale === "fi"
  const params = useSearchParams()
  const root = `/${locale}/manual`
  const guide = maintenanceGuides.find(
    (item) => item.id === params.get("guide")
  )
  const selectedTopic = manualTopics.find((item) => item.guide === guide?.id)
  const selectedCategory = manualCategories.find(
    (item) =>
      item.id === (guide ? selectedTopic?.category : params.get("category"))
  )
  const query = params.get("q") ?? ""
  const topics = findManualTopics(query, selectedCategory?.id)
  const allLabel = fi ? "Kaikki aiheet" : "All topics"
  function search(value: string) {
    const next = new URLSearchParams(params)
    next.delete("guide")
    if (value) next.set("q", value)
    else next.delete("q")
    window.history.replaceState(
      null,
      "",
      `${root}${next.size ? `?${next}` : ""}`
    )
  }
  function selectCategory(value: string) {
    const next = new URLSearchParams(params)
    next.delete("guide")
    if (value) next.set("category", value)
    else next.delete("category")
    window.history.pushState(null, "", `${root}${next.size ? `?${next}` : ""}`)
  }
  return (
    <div className="manual-workspace">
      <div className="section-toolbar manual-toolbar">
        <Link className="section-toolbar-title" href={root}>
          {fi ? "Käyttöohjeet" : "Manual"}
        </Link>
        <BarSearch
          label={fi ? "Hae ohjeista" : "Search manuals"}
          clearLabel={fi ? "Tyhjennä haku" : "Clear search"}
          value={query}
          onChange={search}
        />
        <nav
          className="section-toolbar-actions"
          aria-label={fi ? "Ohjeiden navigaatio" : "Manual navigation"}
        >
          <Link
            href={root}
            aria-label={allLabel}
            aria-current={
              !guide && !selectedCategory && !query ? "page" : undefined
            }
          >
            <BookOpen size={20} />
            <span className="section-action-label">{allLabel}</span>
          </Link>
        </nav>
      </div>
      <nav
        className="manual-category-nav"
        aria-label={fi ? "Ohjeiden aihealueet" : "Manual categories"}
      >
        <button
          type="button"
          aria-pressed={!selectedCategory}
          onClick={() => selectCategory("")}
        >
          {allLabel}
        </button>
        {manualCategories.map((category) => (
          <button
            type="button"
            key={category.id}
            aria-pressed={selectedCategory?.id === category.id}
            onClick={() => selectCategory(category.id)}
          >
            {category.name[locale]}
          </button>
        ))}
      </nav>
      <div className="manual-page">
        {guide ? (
          <>
            <Link
              className="manual-back"
              href={
                selectedCategory
                  ? `${root}?category=${selectedCategory.id}`
                  : root
              }
            >
              <ArrowLeft size={18} />
              {selectedCategory?.name[locale] ?? allLabel}
            </Link>
            <Guide key={guide.id} guide={guide} locale={locale} />
          </>
        ) : (
          <>
            <h1 className="sr-only">{fi ? "Käyttöohjeet" : "Manual"}</h1>
            <div className="manual-library-summary">
              <p role="status">
                {topics.length}{" "}
                {fi
                  ? topics.length === 1
                    ? "aihe"
                    : "aihetta"
                  : topics.length === 1
                    ? "topic"
                    : "topics"}
                {query && <> · “{query}”</>}
              </p>
              {(query || selectedCategory) && (
                <Link href={root}>
                  {fi ? "Tyhjennä rajaukset" : "Clear filters"}
                </Link>
              )}
            </div>
            <div className="manual-topic-grid">
              {manualCategories.map((category) => {
                const entries = topics.filter(
                  (item) => item.category === category.id
                )
                if (!entries.length) return null
                return (
                  <section
                    className="manual-topic-group"
                    key={category.id}
                    aria-labelledby={`manual-category-${category.id}`}
                  >
                    <h2 id={`manual-category-${category.id}`}>
                      {category.name[locale]}
                    </h2>
                    <ul>
                      {entries.map((topic) => (
                        <li key={topic.id}>
                          {topic.guide ? (
                            <Link
                              className="manual-topic-link"
                              href={`${root}?guide=${topic.guide}`}
                            >
                              <span>{topic.title[locale]}</span>
                              <ChevronRight size={18} />
                            </Link>
                          ) : (
                            <button
                              className="manual-topic-link"
                              type="button"
                              aria-disabled="true"
                            >
                              <span>{topic.title[locale]}</span>
                              <ChevronRight size={18} />
                            </button>
                          )}
                        </li>
                      ))}
                    </ul>
                  </section>
                )
              })}
            </div>
            {!topics.length && (
              <div className="manual-no-results">
                <h2>{fi ? "Aiheita ei löytynyt." : "No matching topics."}</h2>
                <Link className="text-link" href={root}>
                  {allLabel}
                  <ArrowRight size={18} />
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
function Guide({
  guide,
  locale,
}: {
  guide: (typeof maintenanceGuides)[number]
  locale: Locale
}) {
  const fi = locale === "fi"
  const [checked, setChecked] = useState<number[]>([])
  return (
    <article className="manual-article">
      <div className="manual-guide-intro">
        <div>
          <h1>{guide.title[locale]}</h1>
          <p>{guide.intro[locale]}</p>
          <h3>{fi ? "Ota valmiiksi" : "What to have ready"}</h3>
          <ul className="manual-tools">
            {guide.tools[locale].split(" · ").map((tool) => (
              <li key={tool}>{tool}</li>
            ))}
          </ul>
        </div>
        <div className="manual-photo">
          <Image
            src={guide.image}
            alt={guide.alt[locale]}
            fill
            preload
            sizes="(max-width: 850px) 90vw, 50vw"
            className="image-cover"
          />
        </div>
      </div>
      <div className="manual-instructions">
        <div>
          <div className="manual-progress">
            <span role="status">
              {checked.length} / {guide.steps.length}{" "}
              {fi ? "valmis" : "complete"}
            </span>
            <div className="manual-progress-track">
              <span
                style={{
                  width: `${(checked.length / guide.steps.length) * 100}%`,
                }}
              />
            </div>
            <button onClick={() => setChecked([])} disabled={!checked.length}>
              <RotateCcw size={16} />
              {fi ? "Nollaa" : "Reset"}
            </button>
          </div>
          <ol className="manual-steps">
            {guide.steps.map((step, index) => (
              <li
                key={index}
                className={checked.includes(index) ? "is-complete" : ""}
              >
                <label>
                  <input
                    type="checkbox"
                    checked={checked.includes(index)}
                    onChange={(event) =>
                      setChecked(
                        event.target.checked
                          ? [...checked, index]
                          : checked.filter((value) => value !== index)
                      )
                    }
                  />
                  <span className="manual-step-number" aria-hidden="true">
                    {checked.includes(index) ? <Check size={21} /> : index + 1}
                  </span>
                  <span>
                    <strong>{step.title[locale]}</strong>
                    <span>{step.text[locale]}</span>
                  </span>
                </label>
              </li>
            ))}
          </ol>
          <button
            className="manual-print text-link"
            onClick={() => window.print()}
          >
            <Printer size={18} />
            {fi ? "Tulosta ohje" : "Print guide"}
          </button>
        </div>
        <aside className="manual-sidebar">
          <BookOpen size={30} strokeWidth={1.3} />
          <h3>{fi ? "Konekohtaiset tiedot" : "Machine-specific details"}</h3>
          <p>
            {fi
              ? "Öljylaatu, täyttömäärä ja huoltovälit löytyvät oman moottorisi ja kuormaimesi käyttöohjeesta."
              : "Find oil grades, capacities and service intervals in the instructions for your engine and crane."}
          </p>
          <a
            className="text-link"
            href="https://media.kubota.io/uploads/Kubota-Engines%E2%80%9305-Series-Manual.pdf"
            target="_blank"
            rel="noreferrer"
          >
            {fi ? "Kubota 05 -sarja · PDF, EN" : "Kubota 05 series · PDF, EN"}
            <ArrowUpRight size={18} />
          </a>
          <hr />
          <h3>
            {fi ? "Osat valmiiksi huoltoon" : "Get ready for the service"}
          </h3>
          <Link
            className="button button-dark"
            href={`/${locale}/service-parts?category=${guide.category}`}
          >
            {fi ? "Etsi huoltotarvikkeet" : "Find service parts"}
            <ArrowRight size={18} />
          </Link>
          <a href="mailto:info@logbullet.com" className="text-link">
            {fi ? "Kysy huollosta" : "Ask about maintenance"}
            <ArrowUpRight size={18} />
          </a>
        </aside>
      </div>
    </article>
  )
}
