import { notFound } from "next/navigation"
import { isLocale } from "@/lib/i18n"
import { getDictionary } from "@/lib/dictionaries"
import { Header } from "@/components/site/header"
import { Footer } from "@/components/site/footer"
import { MediaLibrary } from "@/components/site/media-library"
import manifest from "@/lib/content/media-manifest.json"
export default async function MediaPage({
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
      <main id="main" className="media-page section-pad">
        <div className="page-intro">
          <h1>{d.media.title}</h1>
          <p>{d.media.description}</p>
        </div>
        <MediaLibrary
          photos={manifest.images.map(
            ({ path, source, filename, pages, alt }) => ({
              path,
              source,
              filename,
              pages,
              alt,
            })
          )}
          videos={manifest.videos}
          locale={lang}
          d={d}
        />
      </main>
      <Footer locale={lang} d={d} />
    </div>
  )
}
