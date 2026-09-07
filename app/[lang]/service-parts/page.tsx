import { Suspense } from "react"
import { notFound } from "next/navigation"
import { PartsCatalog } from "@/components/store/parts-catalog"
import { isLocale } from "@/lib/i18n"
import { partsCopy } from "@/lib/parts-copy"
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  return { title: lang === "fi" ? "Varaosat" : "Service parts" }
}
export default async function PartsPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  if (!isLocale(lang)) notFound()
  return (
    <Suspense
      fallback={
        <p className="parts-loading">{partsCopy(lang).catalogLoading}</p>
      }
    >
      <PartsCatalog locale={lang} />
    </Suspense>
  )
}
