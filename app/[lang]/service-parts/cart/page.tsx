import { Suspense } from "react"
import { notFound } from "next/navigation"
import { PartsCart } from "@/components/store/parts-cart"
import { isLocale } from "@/lib/i18n"
import { partsCopy } from "@/lib/parts-copy"
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  return { title: lang === "fi" ? "Ostoskori" : "Cart" }
}
export default async function Page({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  if (!isLocale(lang)) notFound()
  return (
    <Suspense
      fallback={<p className="parts-loading">{partsCopy(lang).loaded}</p>}
    >
      <PartsCart locale={lang} />
    </Suspense>
  )
}
