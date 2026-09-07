"use client"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  Link2,
  Plus,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/site/header"
import {
  machines,
  getMachine,
  calculateEstimate,
  toggleOption,
  normalizeOptions,
  type FocusPart,
  type ModelId,
} from "@/lib/catalog"
import { type Locale, money } from "@/lib/i18n"
import type { Dictionary } from "@/lib/dictionaries"
import { emptyContact, ORDER_STORAGE_KEY, type DemoOrder } from "@/lib/order"
import { Visualizer } from "./visualizer"
import { OrderForm } from "./order-form"
export function Configurator({
  model,
  locale,
  d,
  initialOptions,
  initialStep,
}: {
  model: ModelId
  locale: Locale
  d: Dictionary
  initialOptions: string[]
  initialStep: number
}) {
  const machine = getMachine(model)!
  const router = useRouter()
  const [step, setStep] = useState(initialStep)
  const [selected, setSelected] = useState(() =>
    normalizeOptions(machine, initialOptions)
  )
  const [focus, setFocus] = useState<FocusPart>("all")
  const [focusedOption, setFocusedOption] = useState<string>()
  const [contact, setContact] = useState(emptyContact)
  const [error, setError] = useState("")
  const [saving, setSaving] = useState(false)
  const [shareStatus, setShareStatus] = useState("")
  const estimate = calculateEstimate(machine, selected)
  function syncUrl(options: string[], nextStep: number) {
    const url = new URL(window.location.href)
    if (options.length) url.searchParams.set("options", options.join(","))
    else url.searchParams.delete("options")
    url.searchParams.set("step", String(nextStep))
    window.history.replaceState(null, "", url)
  }
  function changeStep(value: number) {
    setStep(value)
    setFocus("all")
    setFocusedOption(undefined)
    syncUrl(selected, value)
    document
      .querySelector(".config-sidebar")
      ?.scrollTo({ top: 0, behavior: "instant" })
    if (window.innerWidth <= 800)
      document
        .querySelector(".config-sidebar")
        ?.scrollIntoView({ behavior: "smooth", block: "start" })
  }
  function changeOption(id: string) {
    const options = toggleOption(machine, selected, id)
    setSelected(options)
    setFocusedOption(id)
    syncUrl(options, step)
    setFocus(machine.equipment.find((item) => item.id === id)?.focus ?? "all")
  }
  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setShareStatus(d.config.copied)
    } catch {
      setShareStatus(d.config.copyError)
    }
  }
  function saveOrder(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")
    if (
      !contact.name.trim() ||
      !contact.email.trim() ||
      !contact.country ||
      (contact.country === "other" && !contact.customCountry.trim())
    ) {
      setError(d.config.validation)
      return
    }
    setSaving(true)
    const order: DemoOrder = {
      version: 1,
      id: `LB-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
      createdAt: new Date().toISOString(),
      locale,
      model: machine.id,
      options: selected,
      estimate: estimate.total,
      unpriced: estimate.unpriced,
      status: "demo-saved",
      contact: {
        name: contact.name.trim(),
        email: contact.email.trim(),
        phone: contact.phone.trim(),
        company: contact.company.trim(),
        country:
          contact.country === "other"
            ? contact.customCountry.trim()
            : contact.country,
        notes: contact.notes.trim(),
      },
    }
    try {
      localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(order))
      router.push(`/${locale}/order`)
    } catch {
      setError(d.config.saveError)
      setSaving(false)
    }
  }
  return (
    <div className="configurator-page" id="top">
      <Header locale={locale} d={d} compact />
      <main id="main">
        <div className="config-subnav">
          <Link
            href={`/${locale}#machines`}
            className="text-link"
            aria-label={d.config.back}
          >
            <ArrowLeft size={15} />
            <span>{d.config.back}</span>
          </Link>
          <nav className="config-steps" aria-label={d.config.title}>
            {d.config.steps.map((label, index) => (
              <button
                key={label}
                onClick={() => changeStep(index)}
                aria-current={step === index ? "step" : undefined}
              >
                <span
                  className={`step-number ${step > index ? "complete" : ""}`}
                >
                  {step > index ? <Check size={12} /> : index + 1}
                </span>
                <span>{label}</span>
              </button>
            ))}
          </nav>
          <button
            className="config-share icon-button"
            aria-label={d.config.share}
            onClick={copyLink}
          >
            <Link2 size={18} />
          </button>
        </div>
        {shareStatus && (
          <div className="share-notification" role="status">
            {shareStatus}
            <button onClick={() => setShareStatus("")} aria-label={d.nav.close}>
              ×
            </button>
          </div>
        )}
        <div className="config-layout">
          <Visualizer
            machine={machine}
            focus={focus}
            focusedOption={focusedOption}
            setFocus={(part) => {
              setFocus(part)
              setFocusedOption(undefined)
            }}
            selected={selected}
            locale={locale}
            d={d}
          />
          <section className="config-sidebar" aria-label={d.config.steps[step]}>
            <div className="config-section-heading">
              <h1>
                {step === 0
                  ? d.config.chooseModel
                  : step === 1
                    ? d.config.equipmentTitle
                    : d.config.requestTitle}
              </h1>
              <p>
                {step === 0
                  ? d.config.chooseModelText
                  : step === 1
                    ? d.config.equipmentText
                    : d.config.requestText}
              </p>
            </div>
            {step === 0 && (
              <>
                <div className="config-model-list">
                  {machines.map((m) => (
                    <button
                      key={m.id}
                      className={`config-model-option ${m.id === machine.id ? "selected" : ""}`}
                      onClick={() => {
                        if (m.id !== machine.id)
                          router.push(`/${locale}/configure/${m.id}`)
                      }}
                      aria-pressed={m.id === machine.id}
                    >
                      <span className="option-radio">
                        {m.id === machine.id && <span />}
                      </span>
                      <span className="config-model-info">
                        <strong>{m.name}</strong>
                        <span>{m.tagline[locale]}</span>
                        <span className="config-model-price">
                          {d.home.from} {money(m.basePrice, locale)}
                        </span>
                      </span>
                      <Image
                        src={m.cardImage}
                        alt=""
                        width={78}
                        height={64}
                        className="model-option-image"
                      />
                    </button>
                  ))}
                </div>
                <div className="standard-equipment">
                  <h3>{d.config.standard}</h3>
                  {machine.standard.map((item) => (
                    <div key={item.en}>
                      <Check size={14} />
                      <span>{item[locale]}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
            {step === 1 && (
              <>
                <details className="config-included">
                  <summary>
                    {d.config.standard}
                    <span>
                      {d.config.included}
                      <ChevronDown size={15} />
                    </span>
                  </summary>
                  <div>
                    {machine.standard.map((item) => (
                      <p key={item.en}>
                        <Check size={13} />
                        {item[locale]}
                      </p>
                    ))}
                  </div>
                </details>
                <h2 className="options-label">
                  {d.config.optional}
                  <span>{selected.length}</span>
                </h2>
                <div className="equipment-options">
                  {machine.equipment.map((item) => {
                    const active = selected.includes(item.id)
                    return (
                      <button
                        key={item.id}
                        aria-pressed={active}
                        className={`equipment-option ${active ? "selected" : ""}`}
                        onClick={() => changeOption(item.id)}
                      >
                        <span className="equipment-option-head">
                          <span>{item.name[locale]}</span>
                          <span className="option-check">
                            {active ? <Check size={13} /> : <Plus size={13} />}
                          </span>
                        </span>
                        <span className="equipment-option-description">
                          {item.description[locale]}
                        </span>
                        <span className="equipment-option-price">
                          {item.price === null
                            ? d.config.quote
                            : `+ ${money(item.price, locale)}`}
                          {active && <span>{d.config.added}</span>}
                        </span>
                      </button>
                    )
                  })}
                </div>
                {selected.includes("crane42") && (
                  <p className="dependency-note">{d.config.dependency}</p>
                )}
              </>
            )}
            {step === 2 && (
              <>
                <div className="order-summary">
                  <div className="order-summary-heading">
                    <h2>{d.config.summary}</h2>
                    <button onClick={() => changeStep(1)}>
                      {d.config.edit}
                    </button>
                  </div>
                  <div className="summary-line">
                    <strong>{machine.name}</strong>
                    <span>{money(machine.basePrice, locale)}</span>
                  </div>
                  {estimate.equipment.map((item) => (
                    <div className="summary-line" key={item.id}>
                      <span>{item.name[locale]}</span>
                      <span>
                        {item.price === null
                          ? d.config.quote
                          : money(item.price, locale)}
                      </span>
                    </div>
                  ))}
                  <div className="summary-line summary-total">
                    <strong>{d.config.total}</strong>
                    <strong>{money(estimate.total, locale)}</strong>
                  </div>
                  {estimate.unpriced && (
                    <p className="fine-print">{d.config.unpriced}</p>
                  )}
                  <div className="summary-line summary-muted">
                    <span>{d.config.vat}</span>
                    <span>{d.config.confirmed}</span>
                  </div>
                  <div className="summary-line summary-muted">
                    <span>{d.config.delivery}</span>
                    <span>{d.config.confirmed}</span>
                  </div>
                </div>
                <OrderForm
                  contact={contact}
                  onChange={setContact}
                  onSubmit={saveOrder}
                  d={d}
                  locale={locale}
                  error={error}
                />
              </>
            )}
          </section>
        </div>
        <div className="config-bottom-bar">
          <div className="config-bottom-model">
            <span className="eyebrow">{d.config.model}</span>
            <strong>{machine.name}</strong>
          </div>
          <div className="config-total" aria-live="polite" aria-atomic="true">
            <div>
              <span>{d.config.estimate}</span>
              <strong>
                {money(estimate.total, locale)}
                {estimate.unpriced && <small> +</small>}
              </strong>
            </div>
            <p>
              {d.config.excluding}
              {estimate.unpriced ? ` · ${d.config.unpriced}` : ""}
            </p>
          </div>
          <div className="config-bottom-actions">
            {step > 0 && (
              <button
                className="config-back-button icon-button"
                aria-label={d.config.previous}
                onClick={() => changeStep(step - 1)}
              >
                <ArrowLeft size={18} />
              </button>
            )}
            {step < 2 ? (
              <Button
                key="advance-step"
                type="button"
                className="config-continue"
                onClick={() => changeStep(step + 1)}
              >
                {step === 0 ? d.config.continue : d.config.review}
                <ArrowRight size={18} />
              </Button>
            ) : (
              <Button
                key="submit-order"
                type="submit"
                form="order-request"
                className="config-continue"
                disabled={saving}
              >
                {saving ? d.config.submitting : d.config.submit}
                <ArrowRight size={18} />
              </Button>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
