import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, ArrowUpRight, Check } from "lucide-react"
import { getMachine, machines, formatPowerValue } from "@/lib/catalog"
import { isLocale, locales, money, number } from "@/lib/i18n"
import { getDictionary } from "@/lib/dictionaries"
import { Header } from "@/components/site/header"
import { Footer } from "@/components/site/footer"
import { VideoDialog } from "@/components/site/video-dialog"
import { MediaLibrary } from "@/components/site/media-library"
import manifest from "@/lib/content/media-manifest.json"
export function generateStaticParams() {
  return locales.flatMap((lang) => machines.map((m) => ({ lang, model: m.id })))
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; model: string }>
}): Promise<Metadata> {
  const { lang, model } = await params
  const m = getMachine(model)
  return m && isLocale(lang)
    ? {
        title: m.name,
        description: m.description[lang],
        alternates: {
          languages: { en: `/en/models/${model}`, fi: `/fi/models/${model}` },
        },
      }
    : {}
}
export default async function ModelPage({
  params,
}: {
  params: Promise<{ lang: string; model: string }>
}) {
  const { lang, model } = await params
  const m = getMachine(model)
  if (!isLocale(lang) || !m) notFound()
  const d = getDictionary(lang)
  const specs = [
    { label: d.models.payload, value: `~${number(m.payload, lang)} kg` },
    { label: d.models.width, value: `${number(m.width, lang)} m` },
    { label: d.models.length, value: `~${number(m.length, lang)} m` },
    { label: d.models.height, value: `~${number(m.height, lang)} m` },
    { label: d.models.weight, value: `~${number(m.weight, lang)} kg` },
    {
      label: d.models.power,
      value: `${formatPowerValue(m.power, lang)} kW`,
    },
    { label: d.models.engine, value: m.engine },
    {
      label: d.models.reach,
      value: m.reach ? `${number(m.reach, lang)} m` : d.models.confirm,
    },
  ]
  const photos = manifest.images.filter((p) => m.images.includes(p.path))
  return (
    <div id="top">
      <Header locale={lang} d={d} />
      <main id="main">
        <section className="model-hero">
          <div className="model-hero-copy">
            <Link className="text-link model-back" href={`/${lang}#machines`}>
              <ArrowLeft size={15} />
              {d.config.back}
            </Link>
            <h1>{m.name}</h1>
            <h2>{m.tagline[lang]}</h2>
            <p className="model-description">{m.description[lang]}</p>
            <div className="model-price">
              <span>{d.home.from}</span>
              <strong>{money(m.basePrice, lang)}</strong>
              <small>{d.home.tax}</small>
            </div>
            <div className="model-actions">
              <Link
                className="button button-orange"
                href={`/${lang}/configure/${m.id}`}
              >
                {d.nav.configure}
                <ArrowUpRight size={18} />
              </Link>
              <VideoDialog
                id={m.video}
                title={m.name}
                d={d}
                className="button button-outline"
              />
            </div>
          </div>
          <div className="model-hero-image">
            <Image
              src={m.image}
              alt={`${m.name} — ${m.tagline[lang]}`}
              fill
              preload
              sizes="(max-width: 800px) 100vw, 60vw"
              className="image-cover"
            />
          </div>
        </section>
        <section className="model-details section-pad">
          <div>
            <h2>{d.models.specifications}</h2>
            <a
              className="text-link"
              href={m.source[lang]}
              target="_blank"
              rel="noreferrer"
            >
              {d.models.viewSource}
              <ArrowUpRight size={15} />
            </a>
          </div>
          <dl className="spec-list">
            {specs.map((s) => (
              <div key={s.label}>
                <dt>{s.label}</dt>
                <dd>{s.value}</dd>
              </div>
            ))}
          </dl>
        </section>
        <section className="model-included section-pad">
          <div>
            <h2>{d.config.standard}</h2>
            <p>{d.config.equipmentText}</p>
            <Link
              className="text-link"
              href={`/${lang}/configure/${m.id}?step=1`}
            >
              {d.models.available}
              <ArrowUpRight size={17} />
            </Link>
          </div>
          <ul>
            {m.standard.map((item) => (
              <li key={item.en}>
                <Check size={18} />
                {item[lang]}
              </li>
            ))}
          </ul>
        </section>
        <section className="model-gallery section-pad">
          <h2>{d.models.gallery}</h2>
          <MediaLibrary photos={photos} videos={[]} locale={lang} d={d} />
        </section>
      </main>
      <Footer locale={lang} d={d} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: m.name,
            description: m.description[lang],
            image: m.images,
            brand: { "@type": "Brand", name: "Logbullet" },
            manufacturer: { "@type": "Organization", name: "Porttivuori Oy" },
            additionalProperty: specs.map((s) => ({
              "@type": "PropertyValue",
              name: s.label,
              value: s.value,
            })),
          }).replace(/</g, "\\u003c"),
        }}
      />
    </div>
  )
}
