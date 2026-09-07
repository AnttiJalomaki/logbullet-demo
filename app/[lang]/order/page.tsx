import { notFound } from "next/navigation"
import { Header } from "@/components/site/header"
import { Footer } from "@/components/site/footer"
import { OrderConfirmation } from "@/components/configurator/order-confirmation"
import { isLocale } from "@/lib/i18n"
import { getDictionary } from "@/lib/dictionaries"
export default async function OrderPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  if (!isLocale(lang)) notFound()
  const d = getDictionary(lang)
  return (
    <div id="top">
      <Header locale={lang} d={d} />
      <OrderConfirmation locale={lang} d={d} />
      <Footer locale={lang} d={d} />
    </div>
  )
}
