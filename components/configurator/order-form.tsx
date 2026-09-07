"use client"
import type { ContactDetails } from "@/lib/order"
import type { Dictionary } from "@/lib/dictionaries"
import type { Locale } from "@/lib/i18n"
export function OrderForm({
  contact,
  onChange,
  onSubmit,
  d,
  locale,
  error,
}: {
  contact: ContactDetails
  onChange: (contact: ContactDetails) => void
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
  d: Dictionary
  locale: Locale
  error: string
}) {
  const countryNames = new Intl.DisplayNames([locale], { type: "region" })
  const countries = [
    "FI",
    "SE",
    "NO",
    "DK",
    "EE",
    "DE",
    "FR",
    "GB",
    "IE",
    "NL",
    "BE",
    "AT",
    "CH",
    "PL",
    "US",
    "CA",
  ]
  const field = (key: keyof ContactDetails, value: string) =>
    onChange({ ...contact, [key]: value })
  return (
    <form id="order-request" onSubmit={onSubmit} className="order-form">
      <h3>{d.config.yourDetails}</h3>
      <label>
        {d.config.name}
        <input
          name="name"
          autoComplete="name"
          required
          minLength={2}
          maxLength={100}
          value={contact.name}
          onChange={(e) => field("name", e.target.value)}
        />
      </label>
      <label>
        {d.config.email}
        <input
          type="email"
          name="email"
          autoComplete="email"
          required
          maxLength={254}
          value={contact.email}
          onChange={(e) => field("email", e.target.value)}
        />
      </label>
      <label>
        {d.config.country}
        <select
          name="country"
          required
          autoComplete="country"
          value={contact.country}
          onChange={(e) => field("country", e.target.value)}
        >
          <option value="" disabled>
            {d.config.selectCountry}
          </option>
          {countries.map((code) => (
            <option key={code} value={code}>
              {countryNames.of(code)}
            </option>
          ))}
          <option value="other">{d.config.customCountry}</option>
        </select>
      </label>
      {contact.country === "other" && (
        <label>
          {d.config.countryName}
          <input
            name="customCountry"
            required
            maxLength={100}
            value={contact.customCountry}
            onChange={(e) => field("customCountry", e.target.value)}
          />
        </label>
      )}
      <label>
        {d.config.phone}
        <input
          type="tel"
          name="phone"
          autoComplete="tel"
          maxLength={40}
          value={contact.phone}
          onChange={(e) => field("phone", e.target.value)}
        />
      </label>
      <label>
        {d.config.company}
        <input
          name="company"
          autoComplete="organization"
          maxLength={150}
          value={contact.company}
          onChange={(e) => field("company", e.target.value)}
        />
      </label>
      <label>
        {d.config.notes}
        <textarea
          name="notes"
          rows={3}
          maxLength={2000}
          placeholder={d.config.notesPlaceholder}
          value={contact.notes}
          onChange={(e) => field("notes", e.target.value)}
        />
      </label>
      {error && (
        <p role="alert" className="form-error">
          {error}
        </p>
      )}
    </form>
  )
}
