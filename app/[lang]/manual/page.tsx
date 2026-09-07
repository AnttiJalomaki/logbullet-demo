import { Suspense } from "react"
import { notFound } from "next/navigation"
import { Header } from "@/components/site/header"
import { Footer } from "@/components/site/footer"
import { ManualContent } from "@/components/site/manual-content"
import { getDictionary } from "@/lib/dictionaries"
import { isLocale } from "@/lib/i18n"
import "@/components/site/support-pages.css"
import "@/components/site/section-bar.css"
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  return {
    title: lang === "fi" ? "Käyttöohjeet ja huolto" : "Manual & maintenance",
  }
}
export default async function ManualPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  if (!isLocale(lang)) notFound()
  const d = getDictionary(lang)
  return (
    <div id="top" className="manual-site">
      <Header locale={lang} d={d} />
      <main id="main">
        <Suspense
          fallback={
            <p className="section-pad">
              {lang === "fi" ? "Ladataan ohjeita…" : "Loading guides…"}
            </p>
          }
        >
          <ManualContent locale={lang} />
        </Suspense>
      </main>
      <Footer locale={lang} d={d} />
    </div>
  )
}
