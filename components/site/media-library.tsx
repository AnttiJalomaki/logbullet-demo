"use client"
import Image from "next/image"
import { useState } from "react"
import { Dialog } from "@base-ui/react/dialog"
import { ArrowUpRight, ChevronLeft, ChevronRight, Play, X } from "lucide-react"
import type { Dictionary } from "@/lib/dictionaries"
import type { Locale } from "@/lib/i18n"
import { machines } from "@/lib/catalog"
import { VideoDialog } from "./video-dialog"
export type MediaPhoto = {
  path: string
  source: string
  filename: string
  pages: string[]
  alt: string
}
export type MediaVideo = { id: string; pages: string[]; url: string }
function category(pages: string[]) {
  if (pages.some((p) => p.includes("superbullet"))) return "superbullet"
  if (pages.some((p) => p.includes("megamax"))) return "megamax"
  if (pages.includes("accessories")) return "accessories"
  return "logbullet"
}
function photoTitle(photo: MediaPhoto, locale: Locale) {
  const labels: Record<string, [string, string]> = {
    "superbullet_etuviisto.jpg": [
      "Superbullet, ready for work",
      "Superbullet valmiina työhön",
    ],
    "superbullet_sivulta.jpg": [
      "The Superbullet profile",
      "Superbullet sivulta",
    ],
    "superbullet_moottori.jpg": [
      "Kubota power, up close",
      "Kubotan voimaa läheltä",
    ],
    "superbullet_minilever.jpg": [
      "Everything within reach",
      "Kaikki käden ulottuvilla",
    ],
    "superbullet_ilmastointi.jpg": [
      "Comfort in the cabin",
      "Mukavuutta ohjaamoon",
    ],
    "superbullet_valot.jpg": [
      "Ready for the long days",
      "Valmiina pitkiin päiviin",
    ],
    "superbullet_valotyolla.jpg": [
      "When the sun goes down",
      "Kun aurinko laskee",
    ],
    "logbullet_maastossa.jpg": [
      "At home between the trees",
      "Kotona puiden välissä",
    ],
    "logbullet_8x8_1200.jpg": [
      "The original Logbullet",
      "Alkuperäinen Logbullet",
    ],
    "logbullet_takingloadrear_1200.jpg": [
      "A little lift goes a long way",
      "Nosto kerrallaan eteenpäin",
    ],
    "dji_0910-scaled.jpg": ["Megamax in its element", "Megamax elementissään"],
    "dji_0910-1-scaled.jpg": ["Megamax in the woods", "Megamax metsässä"],
    "logbullet_fromsidetorear_1200.jpg": [
      "A closer connection to the forest",
      "Lähempänä metsää",
    ],
    "logbullet_maasto_lastattuna.jpg": [
      "Bringing the timber home",
      "Puut matkalla kotiin",
    ],
    "cropped-logbullet_logo_1240.jpg": [
      "The original Logbullet identity",
      "Alkuperäinen Logbullet-ilme",
    ],
    "chainsaw_spruce_firstthinning.jpg": [
      "Where the work begins",
      "Mistä työ alkaa",
    ],
    "20240506_152651-scaled.jpg": [
      "From the Finnish workshop",
      "Suomalaiselta verstaalta",
    ],
    "kansilehti.jpg": ["Out in the Finnish forest", "Suomalaisessa metsässä"],
  }
  const label = labels[photo.filename]
  if (label) return label[locale === "fi" ? 1 : 0]
  const equipment = machines
    .flatMap((machine) => machine.equipment)
    .find((item) => item.image === photo.path)
  if (equipment) return equipment.name[locale]
  const kind = category(photo.pages)
  return `${kind === "superbullet" ? "Superbullet" : kind === "megamax" ? "Megamax" : "Logbullet"} · ${locale === "fi" ? (kind === "accessories" ? "Varusteet ja yksityiskohdat" : "Metsästä verstaalle") : kind === "accessories" ? "Equipment & details" : "From workshop to woodland"}`
}
export function MediaLibrary({
  photos,
  videos,
  locale,
  d,
}: {
  photos: MediaPhoto[]
  videos: MediaVideo[]
  locale: Locale
  d: Dictionary
}) {
  const [type, setType] = useState("all")
  const [model, setModel] = useState("all")
  const [limit, setLimit] = useState(12)
  const [active, setActive] = useState<number | null>(null)
  const filteredPhotos = photos.filter(
    (p) => model === "all" || category(p.pages) === model
  )
  const filteredVideos = videos.filter(
    (v) => model === "all" || category(v.pages) === model
  )
  const activePhoto = active === null ? null : filteredPhotos[active]
  return (
    <>
      <div className="media-filters">
        <div className="segment-control" aria-label={d.media.collection}>
          {[
            ["all", d.media.all],
            ["photos", d.media.photos],
            ["videos", d.media.videos],
          ].map(([value, label]) => (
            <button
              key={value}
              aria-pressed={type === value}
              onClick={() => {
                setType(value)
                setLimit(12)
              }}
            >
              {label}
            </button>
          ))}
        </div>
        <label className="filter-select">
          <span className="sr-only">{d.nav.models}</span>
          <select
            value={model}
            onChange={(e) => {
              setModel(e.target.value)
              setLimit(12)
              setActive(null)
            }}
          >
            {[
              ["all", d.media.allModels],
              ["logbullet", "Logbullet"],
              ["superbullet", "Superbullet"],
              ["megamax", "Megamax"],
              ["accessories", d.media.accessories],
            ].map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
      </div>
      {type !== "photos" && filteredVideos.length > 0 && (
        <section className="media-videos">
          <div className="media-section-label">
            <h2>{d.media.videos}</h2>
            <span>{String(filteredVideos.length).padStart(2, "0")}</span>
          </div>
          <div className="video-grid">
            {filteredVideos
              .slice(0, type === "all" ? 3 : undefined)
              .map((video, index) => {
                const key = video.id.startsWith("playlist:")
                  ? "playlist"
                  : video.id
                const title =
                  d.media.filmTitles[key as keyof typeof d.media.filmTitles] ||
                  (locale === "fi"
                    ? "Logbullet metsässä"
                    : "Logbullet in the forest")
                const kind = category(video.pages)
                const src =
                  kind === "superbullet"
                    ? "/media/superbullet_sivulta.jpg"
                    : kind === "megamax"
                      ? "/media/dji_0910-scaled.jpg"
                      : [
                          "/media/logbullet_maasto_lastattuna.jpg",
                          "/media/logbullet_takingloadrear_1200.jpg",
                          "/media/logbullet_maastossa.jpg",
                          "/media/logbullet_fromsidetorear_1200.jpg",
                        ][index % 4]
                return (
                  <VideoDialog
                    key={video.id}
                    id={video.id}
                    title={title}
                    d={d}
                    className="video-card"
                  >
                    <span className="video-thumbnail">
                      <Image
                        src={src}
                        alt=""
                        fill
                        sizes="(max-width: 600px) 100vw, (max-width: 1000px) 50vw, 33vw"
                        loading="lazy"
                        className="image-cover"
                      />
                      <span className="video-card-play">
                        <Play size={19} fill="currentColor" />
                      </span>
                      <span className="video-card-source">LOGBULLET FILMS</span>
                    </span>
                    <span className="video-card-caption">
                      {title}
                      <ArrowUpRight size={17} />
                    </span>
                  </VideoDialog>
                )
              })}
          </div>
          {type === "all" && filteredVideos.length > 3 && (
            <button
              className="text-link media-all-films"
              onClick={() => setType("videos")}
            >
              {d.media.allFilms} ({filteredVideos.length})
              <ArrowUpRight size={17} />
            </button>
          )}
        </section>
      )}
      {type !== "videos" && filteredPhotos.length > 0 && (
        <section>
          <div className="media-section-label">
            <h2>{d.media.photos}</h2>
            <span>{String(filteredPhotos.length).padStart(2, "0")}</span>
          </div>
          <div className="photo-grid">
            {filteredPhotos.slice(0, limit).map((photo, index) => (
              <button
                key={photo.source}
                className="photo-card"
                onClick={() => setActive(index)}
              >
                <span className="photo-thumbnail">
                  <Image
                    src={photo.path}
                    alt={photoTitle(photo, locale)}
                    fill
                    sizes="(max-width: 600px) 100vw, (max-width: 1000px) 50vw, 33vw"
                    loading="lazy"
                    className="image-cover"
                  />
                  <span className="photo-expand">
                    <ArrowUpRight size={18} />
                  </span>
                </span>
                <span>{photoTitle(photo, locale)}</span>
              </button>
            ))}
          </div>
          {limit < filteredPhotos.length && (
            <div className="media-more">
              <button
                className="button button-outline"
                onClick={() => setLimit(limit + 12)}
              >
                {d.media.loadMore}
                <span>
                  {Math.min(limit, filteredPhotos.length)} /{" "}
                  {filteredPhotos.length}
                </span>
              </button>
            </div>
          )}
        </section>
      )}
      <Dialog.Root
        open={activePhoto !== null}
        onOpenChange={(open) => {
          if (!open) setActive(null)
        }}
      >
        <Dialog.Portal>
          <Dialog.Backdrop className="modal-backdrop" />
          <Dialog.Popup
            className="photo-modal"
            onKeyDown={(e) => {
              if (e.key === "ArrowRight")
                setActive((value) => ((value ?? 0) + 1) % filteredPhotos.length)
              if (e.key === "ArrowLeft")
                setActive(
                  (value) =>
                    ((value ?? 0) - 1 + filteredPhotos.length) %
                    filteredPhotos.length
                )
            }}
          >
            {activePhoto && (
              <>
                <div className="modal-heading">
                  <Dialog.Title>{photoTitle(activePhoto, locale)}</Dialog.Title>
                  <Dialog.Close
                    className="icon-button"
                    aria-label={d.media.close}
                  >
                    <X />
                  </Dialog.Close>
                </div>
                <Dialog.Description className="sr-only">
                  {d.media.photograph}
                </Dialog.Description>
                <div className="photo-full">
                  <Image
                    src={activePhoto.path}
                    alt={photoTitle(activePhoto, locale)}
                    fill
                    sizes="90vw"
                    style={{ objectFit: "contain" }}
                  />
                </div>
                <div className="photo-modal-bottom">
                  <button
                    className="icon-button"
                    aria-label={d.media.previous}
                    onClick={() =>
                      setActive(
                        ((active ?? 0) - 1 + filteredPhotos.length) %
                          filteredPhotos.length
                      )
                    }
                  >
                    <ChevronLeft />
                  </button>
                  <span>
                    {(active ?? 0) + 1} / {filteredPhotos.length}
                  </span>
                  <button
                    className="icon-button"
                    aria-label={d.media.next}
                    onClick={() =>
                      setActive(((active ?? 0) + 1) % filteredPhotos.length)
                    }
                  >
                    <ChevronRight />
                  </button>
                  <a href={activePhoto.path} target="_blank" rel="noreferrer">
                    {d.media.source}
                    <ArrowUpRight size={16} />
                  </a>
                </div>
              </>
            )}
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  )
}
