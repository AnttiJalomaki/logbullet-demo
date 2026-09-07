"use client"
import { Dialog } from "@base-ui/react/dialog"
import Link from "next/link"
import { ArrowRight, SlidersHorizontal, X } from "lucide-react"
import { machines, formatPowerValue } from "@/lib/catalog"
import { type Locale, money, number } from "@/lib/i18n"
import type { Dictionary } from "@/lib/dictionaries"
export function CompareDialog({
  locale,
  d,
}: {
  locale: Locale
  d: Dictionary
}) {
  const specs = [
    {
      label: d.models.payload,
      value: (m: (typeof machines)[number]) =>
        `${number(m.payload, locale)} kg`,
    },
    {
      label: d.models.width,
      value: (m: (typeof machines)[number]) => `${number(m.width, locale)} m`,
    },
    {
      label: d.models.power,
      value: (m: (typeof machines)[number]) =>
        `${formatPowerValue(m.power, locale)} kW`,
    },
    {
      label: d.models.weight,
      value: (m: (typeof machines)[number]) =>
        `~${number(m.weight, locale)} kg`,
    },
    {
      label: d.models.reach,
      value: (m: (typeof machines)[number]) =>
        m.reach ? `${number(m.reach, locale)} m` : d.models.confirm,
    },
  ]
  return (
    <Dialog.Root>
      <Dialog.Trigger className="text-link compare-button">
        <SlidersHorizontal size={17} />
        {d.home.compare}
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop className="modal-backdrop" />
        <Dialog.Popup className="compare-modal">
          <div className="modal-heading">
            <div>
              <Dialog.Title>{d.models.compareTitle}</Dialog.Title>
            </div>
            <Dialog.Close className="icon-button" aria-label={d.nav.close}>
              <X />
            </Dialog.Close>
          </div>
          <Dialog.Description>{d.models.compareDescription}</Dialog.Description>
          <div className="comparison-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">
                    <span className="sr-only">{d.models.specifications}</span>
                  </th>
                  {machines.map((m) => (
                    <th key={m.id} scope="col">
                      <span>{m.name}</span>
                      <small>{money(m.basePrice, locale)}</small>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {specs.map((s) => (
                  <tr key={s.label}>
                    <th scope="row">{s.label}</th>
                    {machines.map((m) => (
                      <td key={m.id}>{s.value(m)}</td>
                    ))}
                  </tr>
                ))}
                <tr>
                  <th scope="row">{d.models.configure}</th>
                  {machines.map((m) => (
                    <td key={m.id}>
                      <Link
                        className="text-link"
                        href={`/${locale}/configure/${m.id}`}
                      >
                        {m.name}
                        <ArrowRight size={16} />
                      </Link>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
