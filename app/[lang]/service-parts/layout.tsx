import { notFound } from "next/navigation"
import { Header } from "@/components/site/header"
import { Footer } from "@/components/site/footer"
import { ShopBar } from "@/components/store/shop-ui"
import { isLocale } from "@/lib/i18n"
import { getDictionary } from "@/lib/dictionaries"
import "@/components/store/store.css"

export default async function PartsLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  if (!isLocale(lang)) notFound()
  const d = getDictionary(lang)
  return (
    <div id="top" className="parts-site">
      <Header locale={lang} d={d} />
      <ShopBar locale={lang} />
      <main id="main" className="parts-main">
        {children}
      </main>
      <Footer locale={lang} d={d} />
    </div>
  )
}
