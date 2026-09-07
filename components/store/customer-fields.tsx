"use client"
import { useId } from "react"
import { machines } from "@/lib/catalog"
import { partsCopy } from "@/lib/parts-copy"
import type { Locale } from "@/lib/i18n"
import type { Customer } from "@/lib/parts-order"

export function CustomerFields({
  locale,
  customer,
  onChange,
  requireAddress = true,
}: {
  locale: Locale
  customer: Customer
  onChange: (customer: Customer) => void
  requireAddress?: boolean
}) {
  const t = partsCopy(locale)
  const id = useId()
  const field = (
    key: keyof Customer,
    label: string,
    autocomplete: string,
    required = false,
    type = "text"
  ) => (
    <label
      className={key === "address" ? "parts-field-wide" : ""}
      htmlFor={`${id}-${key}`}
    >
      {label}
      {required && <span aria-hidden="true"> *</span>}
      <input
        id={`${id}-${key}`}
        name={key}
        type={type}
        autoComplete={autocomplete}
        required={required}
        pattern={required && type === "text" ? ".*\\S.*" : undefined}
        maxLength={200}
        value={customer[key]}
        onChange={(event) =>
          onChange({ ...customer, [key]: event.target.value })
        }
      />
    </label>
  )
  return (
    <>
      <fieldset className="parts-form-section">
        <legend>{t.contact}</legend>
        <div className="parts-form-grid">
          {field("name", t.fullName, "name", true)}
          {field("email", t.email, "email", true, "email")}
          {field("phone", t.phone, "tel", false, "tel")}
          {field("company", t.company, "organization")}
        </div>
      </fieldset>
      <fieldset className="parts-form-section">
        <legend>{t.deliveryAddress}</legend>
        <div className="parts-form-grid">
          {field("address", t.address, "street-address", requireAddress)}
          {field("postalCode", t.postalCode, "postal-code", requireAddress)}
          {field("city", t.city, "address-level2", requireAddress)}
          <label htmlFor={`${id}-country`}>
            {t.country}
            {requireAddress && <span aria-hidden="true"> *</span>}
            <input
              id={`${id}-country`}
              name="country"
              autoComplete="country-name"
              list={`${id}-countries`}
              maxLength={100}
              value={customer.country}
              required={requireAddress}
              pattern={requireAddress ? ".*\\S.*" : undefined}
              onChange={(event) =>
                onChange({ ...customer, country: event.target.value })
              }
            />
            <datalist id={`${id}-countries`}>
              {(locale === "fi"
                ? [
                    "Suomi",
                    "Ruotsi",
                    "Norja",
                    "Viro",
                    "Saksa",
                    "Ranska",
                    "Iso-Britannia",
                  ]
                : [
                    "Finland",
                    "Sweden",
                    "Norway",
                    "Estonia",
                    "Germany",
                    "France",
                    "United Kingdom",
                  ]
              ).map((country) => (
                <option key={country} value={country} />
              ))}
            </datalist>
          </label>
        </div>
      </fieldset>
      <fieldset className="parts-form-section">
        <legend>{t.machineDetails}</legend>
        <p>{t.machineHint}</p>
        <div className="parts-form-grid">
          <label htmlFor={`${id}-model`}>
            {t.model}
            <select
              id={`${id}-model`}
              name="model"
              value={customer.model}
              onChange={(event) =>
                onChange({ ...customer, model: event.target.value })
              }
            >
              <option value="">{t.optional}</option>
              {machines.map((machine) => (
                <option key={machine.id} value={machine.id}>
                  {machine.name}
                </option>
              ))}
            </select>
          </label>
          {field("serial", t.serial, "off")}
        </div>
      </fieldset>
    </>
  )
}
