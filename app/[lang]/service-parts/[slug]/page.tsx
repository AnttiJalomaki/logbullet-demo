import { notFound } from "next/navigation"
import { PartDetail } from "@/components/store/part-detail"
import { getPart, parts } from "@/lib/parts"
import { isLocale } from "@/lib/i18n"
export function generateStaticParams() {
  return parts.map((part) => ({ slug: part.id }))
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>
}) {
  const { lang, slug } = await params
  const part = getPart(slug)
  return { title: part?.name[lang === "fi" ? "fi" : "en"] ?? "Logbullet" }
}
export default async function PartPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>
}) {
  const { lang, slug } = await params
  const part = getPart(slug)
  if (!isLocale(lang) || !part) notFound()
  return <PartDetail part={part} locale={lang} />
}
