import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowRight, ArrowUpRight, Play } from "lucide-react"
import { Header } from "@/components/site/header"
import { Footer } from "@/components/site/footer"
import { VideoDialog } from "@/components/site/video-dialog"
import { CompareDialog } from "@/components/site/compare-dialog"
import { HeroBackground } from "@/components/site/hero-background"
import { getDictionary } from "@/lib/dictionaries"
import { isLocale, money, number } from "@/lib/i18n"
import { machines, formatPowerValue } from "@/lib/catalog"
export default async function Home({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  if (!isLocale(lang)) notFound()
  const d = getDictionary(lang)
  return (
    <div id="top">
      <Header locale={lang} d={d} overlay />
      <main id="main">
        <section className="home-hero">
          <HeroBackground
            alt={
              lang === "fi"
                ? "Oranssi Logbullet suomalaisessa koivumetsässä"
                : "An orange Logbullet between birch trees in a Finnish forest"
            }
            pauseLabel={d.hero.pauseVideo}
            playLabel={d.hero.playVideo}
          />
          <div className="hero-shade" />
          <div className="hero-content">
            <h1>
              {d.hero.line1}
              <br />
              <span>{d.hero.line2}</span>
            </h1>
            <p className="hero-description">{d.hero.description}</p>
            <div className="hero-buttons">
              <Link
                href={`/${lang}/configure/logbullet`}
                className="button button-orange"
              >
                {d.hero.primary}
                <ArrowUpRight size={18} />
              </Link>
              <VideoDialog
                id="CIsVyuMwSvg"
                title={d.media.filmTitles.CIsVyuMwSvg}
                d={d}
                className="button button-glass"
              >
                <Play size={13} fill="currentColor" />
                {d.hero.secondary}
              </VideoDialog>
            </div>
          </div>
        </section>
        <section className="range-section section-pad" id="machines">
          <div className="section-heading">
            <h2 className="preserve-lines">{d.home.rangeTitle}</h2>
            <CompareDialog locale={lang} d={d} />
          </div>
          <div className="machine-grid">
            {machines.map((m) => (
              <article className="machine-card" key={m.id}>
                <Link
                  href={`/${lang}/models/${m.id}`}
                  className="machine-image"
                >
                  <Image
                    src={m.cardImage}
                    alt={`${m.name} — ${m.tagline[lang]}`}
                    fill
                    sizes="(max-width: 800px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    loading="lazy"
                    className="image-cover"
                  />
                  <span className="machine-open">
                    <ArrowUpRight size={20} />
                  </span>
                </Link>
                <div className="machine-card-title">
                  <h3>
                    <Link href={`/${lang}/models/${m.id}`}>{m.name}</Link>
                  </h3>
                  <span>{m.tagline[lang]}</span>
                </div>
                <div className="machine-specs">
                  <div>
                    <strong>
                      {number(m.payload, lang)} <small>kg</small>
                    </strong>
                    <span>{d.models.payload}</span>
                  </div>
                  <div>
                    <strong>
                      {number(m.width, lang)} <small>m</small>
                    </strong>
                    <span>{d.models.width}</span>
                  </div>
                  <div>
                    <strong>
                      {formatPowerValue(m.power, lang)} <small>kW</small>
                    </strong>
                    <span>{d.models.power}</span>
                  </div>
                </div>
                <div className="machine-card-bottom">
                  <span>
                    {d.home.from} <strong>{money(m.basePrice, lang)}</strong>
                  </span>
                  <Link
                    href={`/${lang}/configure/${m.id}`}
                    className="text-link"
                  >
                    {d.models.configure}
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
        <section className="philosophy-section" id="why-logbullet">
          <div className="philosophy-image">
            <Image
              src="/media/logbullet_fromsidetorear_1200.jpg"
              alt={
                lang === "fi"
                  ? "Logbulletin nosturi ja kuormatila metsässä"
                  : "Logbullet crane and timber load among the trees"
              }
              fill
              sizes="(max-width: 800px) 100vw, 50vw"
              loading="lazy"
              className="image-cover"
            />
          </div>
          <div className="philosophy-copy">
            <h2>
              {d.home.philosophyTitle}
              <br />
              <span>{d.home.philosophyTitle2}</span>
            </h2>
            <p className="philosophy-intro">{d.home.philosophyDescription}</p>
            <div className="philosophy-features">
              {[
                {
                  title: d.home.feature1Title,
                  text: d.home.feature1Text,
                },
                {
                  title: d.home.feature2Title,
                  text: d.home.feature2Text,
                },
                {
                  title: d.home.feature3Title,
                  text: d.home.feature3Text,
                },
              ].map(({ title, text }) => (
                <div key={title}>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="film-section">
          <Image
            src="/media/logbullet_maasto_lastattuna.jpg"
            alt={
              lang === "fi"
                ? "Kuormattu Logbullet puiden keskellä"
                : "A loaded Logbullet at work in the woods"
            }
            fill
            sizes="100vw"
            loading="lazy"
            className="image-cover"
          />
          <div className="film-shade" />
          <div className="film-content">
            <h2 className="preserve-lines">{d.home.filmTitle}</h2>
            <p>{d.home.filmDescription}</p>
            <Link href={`/${lang}/media`} className="text-link">
              {d.home.allFilms}
              <ArrowUpRight size={18} />
            </Link>
          </div>
          <VideoDialog
            id="CIsVyuMwSvg"
            title={d.media.filmTitles.CIsVyuMwSvg}
            d={d}
            className="film-play"
          >
            <span>
              <Play size={28} fill="currentColor" strokeWidth={1} />
            </span>
            {d.home.watch}
          </VideoDialog>
        </section>
        <section className="configure-cta section-pad">
          <h2 className="preserve-lines">{d.home.configureTitle}</h2>
          <p>{d.home.configureText}</p>
          <Link
            href={`/${lang}/configure/logbullet`}
            className="button button-dark"
          >
            {d.home.configureAction}
            <ArrowUpRight size={18} />
          </Link>
        </section>
      </main>
      <Footer locale={lang} d={d} />
    </div>
  )
}
