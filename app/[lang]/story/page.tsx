import Image from "next/image"
import { notFound } from "next/navigation"
import { ArrowUpRight } from "lucide-react"
import { Header } from "@/components/site/header"
import { Footer } from "@/components/site/footer"
import { isLocale } from "@/lib/i18n"
import { getDictionary } from "@/lib/dictionaries"
export default async function StoryPage({
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
      <main id="main">
        <section className="story-hero section-pad">
          <div>
            <h1 className="preserve-lines">{d.story.title}</h1>
            <p>{d.story.intro}</p>
          </div>
          <div className="story-hero-image">
            <Image
              src="/media/chainsaw_spruce_firstthinning.jpg"
              alt={
                lang === "fi"
                  ? "Metsätyötä suomalaisessa metsässä"
                  : "Working in a Finnish forest"
              }
              fill
              preload
              sizes="(max-width: 800px) 100vw, 50vw"
              className="image-cover"
            />
          </div>
        </section>
        <section className="story-body section-pad">
          <span className="story-years">2011 — 2015</span>
          <div>
            <p>{d.story.text1}</p>
            <p>{d.story.text2}</p>
            <a
              className="text-link"
              href="https://www.logbullet.com/story/"
              target="_blank"
              rel="noreferrer"
            >
              {d.story.source}
              <ArrowUpRight size={17} />
            </a>
          </div>
        </section>
        <section className="story-quote section-pad">
          <span aria-hidden="true">“</span>
          <blockquote>{d.story.quote}</blockquote>
          <p>{d.story.quoteAttribution}</p>
        </section>
        <section className="story-end section-pad">
          <div className="story-end-image">
            <Image
              src="/media/logbullet_farmhouse-1038x576.jpg"
              alt={
                lang === "fi"
                  ? "Alkuperäinen Logbullet maatilalla"
                  : "The original Logbullet at the farmhouse"
              }
              fill
              sizes="(max-width: 800px) 100vw, 50vw"
              loading="lazy"
              className="image-cover"
            />
          </div>
          <div>
            <h2 className="preserve-lines">{d.story.valueTitle}</h2>
            <p>{d.story.valueText}</p>
            <a className="button button-dark" href="mailto:info@logbullet.com">
              {d.story.talk}
              <ArrowUpRight size={17} />
            </a>
          </div>
        </section>
      </main>
      <Footer locale={lang} d={d} />
    </div>
  )
}
