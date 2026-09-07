"use client"
import Link from "next/link"
import Image from "next/image"
import { useSearchParams } from "next/navigation"
import { useState } from "react"
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Check,
  Printer,
  RotateCcw,
} from "lucide-react"
import type { Locale } from "@/lib/i18n"
import { maintenanceGuides } from "@/lib/manual"
export function ManualContent({ locale }: { locale: Locale }) {
  const fi = locale === "fi"
  const params = useSearchParams()
  const guide =
    maintenanceGuides.find((item) => item.id === params.get("guide")) ??
    maintenanceGuides[0]
  return (
    <div className="manual-page">
      <section className="manual-hero">
        <h1>
          {fi
            ? "Tunne koneesi.\nPidä se töissä."
            : "Know your machine.\nKeep it working."}
        </h1>
        <p>
          {fi
            ? "Selkeät ohjeet tavallisiin huoltotöihin ja päivittäisiin tarkistuksiin."
            : "Straightforward guides for routine maintenance and everyday checks."}
        </p>
      </section>
      <nav
        className="manual-guide-nav"
        aria-label={fi ? "Huolto-ohjeet" : "Maintenance guides"}
      >
        {maintenanceGuides.map((item) => (
          <Link
            href={`/${locale}/manual?guide=${item.id}`}
            scroll={false}
            key={item.id}
            aria-current={guide.id === item.id ? "page" : undefined}
          >
            {item.label[locale]}
          </Link>
        ))}
      </nav>
      <Guide key={guide.id} guide={guide} locale={locale} />
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
          <h2>{guide.title[locale]}</h2>
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
