"use client"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useRef, useState } from "react"
import { NavigationMenu } from "@base-ui/react/navigation-menu"
import { ArrowUpRight, ChevronDown, Globe2, Menu, X } from "lucide-react"
import { Logo } from "./logo"
import type { Dictionary } from "@/lib/dictionaries"
import { locales, languageNames, type Locale } from "@/lib/i18n"
import { machines } from "@/lib/catalog"
export function Header({
  locale,
  d,
  overlay = false,
  compact = false,
}: {
  locale: Locale
  d: Dictionary
  overlay?: boolean
  compact?: boolean
}) {
  const [open, setOpen] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const router = useRouter()
  const pathname = usePathname()
  function changeLanguage(value: Locale) {
    document.cookie = `logbullet-locale=${value}; path=/; max-age=31536000; SameSite=Lax`
    router.push(
      pathname.replace(/^\/[^/]+/, `/${value}`) +
        window.location.search +
        window.location.hash
    )
    setOpen(false)
  }
  const links = [
    { href: `/${locale}/company`, text: d.nav.company },
    { href: `/${locale}/media`, text: d.nav.media },
    { href: `/${locale}/service-parts`, text: d.nav.parts },
    { href: `/${locale}/manual`, text: d.nav.manual },
  ]
  return (
    <>
      <a className="skip-link" href="#main">
        {d.nav.skip}
      </a>
      <header
        className={`site-header ${overlay ? "header-overlay" : ""} ${compact ? "header-compact" : ""}`}
        onKeyDown={(event) => {
          if (event.key === "Escape" && open) {
            setOpen(false)
            menuButtonRef.current?.focus()
          }
        }}
      >
        <Logo href={`/${locale}`} />
        {!compact && (
          <NavigationMenu.Root
            className="desktop-nav"
            aria-label={d.nav.primary}
            delay={100}
            closeDelay={180}
          >
            <NavigationMenu.List className="desktop-nav-list">
              <NavigationMenu.Item value="machines">
                <NavigationMenu.Trigger className="machines-menu-trigger">
                  {d.nav.models}
                  <ChevronDown size={16} />
                </NavigationMenu.Trigger>
                <NavigationMenu.Content>
                  <ul className="machines-menu-links">
                    {machines.map((machine) => {
                      const href = `/${locale}/models/${machine.id}`
                      return (
                        <li key={machine.id}>
                          <NavigationMenu.Link
                            render={<Link href={href} />}
                            className="machines-menu-link"
                            active={pathname === href}
                            closeOnClick
                          >
                            {machine.name}
                          </NavigationMenu.Link>
                        </li>
                      )
                    })}
                  </ul>
                </NavigationMenu.Content>
              </NavigationMenu.Item>
              {links.map((link) => (
                <NavigationMenu.Item key={link.href}>
                  <NavigationMenu.Link
                    render={<Link href={link.href} />}
                    active={pathname === link.href}
                    closeOnClick
                  >
                    {link.text}
                  </NavigationMenu.Link>
                </NavigationMenu.Item>
              ))}
            </NavigationMenu.List>
            <NavigationMenu.Portal>
              <NavigationMenu.Positioner
                className="machines-menu-positioner"
                align="start"
                sideOffset={8}
                collisionPadding={16}
              >
                <NavigationMenu.Popup
                  className={`machines-menu-popup ${overlay ? "machines-menu-overlay" : ""}`}
                  aria-label={d.nav.models}
                >
                  <NavigationMenu.Viewport />
                </NavigationMenu.Popup>
              </NavigationMenu.Positioner>
            </NavigationMenu.Portal>
          </NavigationMenu.Root>
        )}
        <div className="header-actions">
          <label className="language-select">
            <Globe2 size={16} />
            <span className="sr-only">{d.nav.language}</span>
            <select
              value={locale}
              onChange={(e) => changeLanguage(e.target.value as Locale)}
            >
              {locales.map((language) => (
                <option key={language} value={language}>
                  {languageNames[language]}
                </option>
              ))}
            </select>
            <span aria-hidden="true">{locale.toUpperCase()}</span>
            <ChevronDown size={12} />
          </label>
          {!compact && (
            <Link
              href={`/${locale}/configure/logbullet`}
              className="header-cta"
            >
              {d.nav.configure}
              <ArrowUpRight size={16} />
            </Link>
          )}
          {!compact && (
            <button
              ref={menuButtonRef}
              className="mobile-menu-button icon-button"
              aria-label={open ? d.nav.close : d.nav.menu}
              aria-expanded={open}
              aria-controls="mobile-navigation"
              onClick={() => setOpen(!open)}
            >
              {open ? <X /> : <Menu />}
            </button>
          )}
        </div>
        {open && (
          <nav
            id="mobile-navigation"
            className="mobile-navigation"
            aria-label={d.nav.primary}
          >
            <details className="mobile-machines">
              <summary>
                {d.nav.models}
                <ChevronDown size={18} />
              </summary>
              <ul className="mobile-machine-links">
                {machines.map((machine) => {
                  const href = `/${locale}/models/${machine.id}`
                  return (
                    <li key={machine.id}>
                      <Link
                        href={href}
                        aria-current={pathname === href ? "page" : undefined}
                        onClick={() => setOpen(false)}
                      >
                        {machine.name}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </details>
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
              >
                {link.text}
                <ArrowUpRight size={20} />
              </Link>
            ))}
          </nav>
        )}
      </header>
    </>
  )
}
