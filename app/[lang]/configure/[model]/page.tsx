import { notFound } from "next/navigation"
import { getMachine } from "@/lib/catalog"
import { isLocale } from "@/lib/i18n"
import { getDictionary } from "@/lib/dictionaries"
import { Configurator } from "@/components/configurator/configurator"
export default async function ConfigurePage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string; model: string }>
  searchParams: Promise<{ options?: string; step?: string }>
}) {
  const { lang, model } = await params
  const machine = getMachine(model)
  if (!isLocale(lang) || !machine) notFound()
  const search = await searchParams
  const step = Number(search.step ?? 0)
  return (
    <Configurator
      key={`${lang}-${model}`}
      model={machine.id}
      locale={lang}
      d={getDictionary(lang)}
      initialOptions={
        typeof search.options === "string" ? search.options.split(",") : []
      }
      initialStep={Number.isInteger(step) && step >= 0 && step <= 2 ? step : 0}
    />
  )
}
