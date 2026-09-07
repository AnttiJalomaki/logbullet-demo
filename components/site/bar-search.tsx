"use client"
import { useId, useRef } from "react"
import { Search, X } from "lucide-react"

export function BarSearch({
  label,
  clearLabel,
  value,
  onChange,
  onSubmit,
  disabled = false,
}: {
  label: string
  clearLabel: string
  value: string
  onChange?: (value: string) => void
  onSubmit?: () => void
  disabled?: boolean
}) {
  const id = useId()
  const input = useRef<HTMLInputElement>(null)
  return (
    <form
      className="section-bar-search"
      role="search"
      aria-label={label}
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit?.()
      }}
    >
      <button type="submit" aria-label={label} disabled={disabled}>
        <Search size={21} />
      </button>
      <label className="sr-only" htmlFor={id}>
        {label}
      </label>
      <input
        ref={input}
        id={id}
        type="search"
        value={value}
        placeholder={`${label}…`}
        onChange={(event) => onChange?.(event.target.value)}
        autoComplete="off"
        maxLength={120}
        disabled={disabled}
      />
      {value && (
        <button
          type="button"
          aria-label={clearLabel}
          onClick={() => {
            onChange?.("")
            input.current?.focus()
          }}
        >
          <X size={18} />
        </button>
      )}
    </form>
  )
}
