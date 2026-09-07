import type { Metadata } from "next"
import { Inter, Geist_Mono } from "next/font/google"
import { notFound } from "next/navigation"
import { isLocale, locales } from "@/lib/i18n"
import { getDictionary } from "@/lib/dictionaries"
import "../globals.css"
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})
const mono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
})
export function generateStaticParams() {
  return locales.map((lang) => ({ lang }))
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  if (!isLocale(lang)) return {}
  const d = getDictionary(lang)
  return {
    title: {
      default: "Logbullet — " + d.hero.line1 + " " + d.hero.line2,
      template: "%s | Logbullet",
    },
    description: d.hero.description,
    robots: { index: false, follow: false },
  }
}
export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  if (!isLocale(lang)) notFound()
  return (
    <html
      lang={lang}
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${mono.variable}`}
    >
      <body>{children}</body>
    </html>
  )
}
