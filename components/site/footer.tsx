import Link from "next/link"
import { ArrowUp, ArrowUpRight } from "lucide-react"
import { Logo } from "./logo"
import type { Dictionary } from "@/lib/dictionaries"
import type { Locale } from "@/lib/i18n"
import { machines } from "@/lib/catalog"
export function Footer({ locale, d }: { locale: Locale; d: Dictionary }) {
  return (
    <footer className="site-footer" id="contact">
      <div className="footer-main">
        <div className="footer-brand">
          <Logo href={`/${locale}`} />
          <p className="preserve-lines">{d.footer.tagline}</p>
        </div>
        <div className="footer-links">
          <span className="footer-label">{d.footer.machines}</span>
          {machines.map((m) => (
            <Link key={m.id} href={`/${locale}/models/${m.id}`}>
              {m.name}
            </Link>
          ))}
        </div>
        <div className="footer-links">
          <span className="footer-label">{d.footer.discover}</span>
          <Link href={`/${locale}/story`}>{d.nav.story}</Link>
          <Link href={`/${locale}/media`}>{d.nav.media}</Link>
          <Link href={`/${locale}/configure/logbullet`}>{d.nav.configure}</Link>
        </div>
        <div className="footer-contact">
          <h3>{d.footer.contact}</h3>
          <p>{d.footer.contactText}</p>
          <a href="mailto:info@logbullet.com">
            info@logbullet.com <ArrowUpRight size={17} />
          </a>
          <a href="tel:+358405263806">+358 40 526 3806</a>
          <span>{d.footer.location}</span>
        </div>
      </div>
      <div className="footer-bottom">
        <span>
          © {new Date().getFullYear()} {d.footer.rights}
        </span>
        <a href="#top" className="back-top">
          {d.footer.back}
          <ArrowUp size={16} />
        </a>
      </div>
    </footer>
  )
}
