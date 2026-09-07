import { Suspense } from "react"
import { notFound } from "next/navigation"
import { PartsAccount } from "@/components/store/parts-account"
import { isLocale } from "@/lib/i18n"
import { partsCopy } from "@/lib/parts-copy"
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  return { title: lang === "fi" ? "Oma tili" : "My account" }
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
      <PartsAccount locale={lang} />
    </Suspense>
  )
}
