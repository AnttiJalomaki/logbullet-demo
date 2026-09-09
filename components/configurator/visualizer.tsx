"use client"
import Image from "next/image"
import dynamic from "next/dynamic"
import { useCallback, useState } from "react"
import { Box, Camera, RotateCcw, ChevronLeft, ChevronRight } from "lucide-react"
import type { Machine, FocusPart } from "@/lib/catalog"
import type { Dictionary } from "@/lib/dictionaries"
import type { Locale } from "@/lib/i18n"
const MachineScene = dynamic(() => import("./machine-scene"), { ssr: false })
export function Visualizer({
  machine,
  focus,
  focusedOption,
  setFocus,
  selected,
  locale,
  d,
}: {
  machine: Machine
  focus: FocusPart
  focusedOption?: string
  setFocus: (part: FocusPart) => void
  selected: string[]
  locale: Locale
  d: Dictionary
}) {
  const [view, setView] = useState<"photo" | "3d">("photo")
  const [error, setError] = useState(false)
  const [resetKey, setResetKey] = useState(0)
  const [photoIndex, setPhotoIndex] = useState(0)
  const onError = useCallback(() => {
    setError(true)
    setView("photo")
  }, [])
  const optionPhoto = machine.equipment.find(
    (o) => o.id === focusedOption && selected.includes(o.id) && o.image
  )?.image
  const detailPhotos: Record<string, Partial<Record<FocusPart, string>>> = {
    logbullet: {
      cabin: "/media/logbullet_kuskintyotila.jpg",
      crane: "/media/logbullet_lastaa_takaviisto.jpg",
      wheels: "/media/logbullet_takaantaalta.jpg",
      load: "/media/logbullet_loadareaview_1200.jpg",
    },
    superbullet: {
      cabin: "/media/superbullet_minilever.jpg",
      crane: "/media/superbullet_sivulta.jpg",
      wheels: "/media/superbullet_moottori.jpg",
      load: "/media/superbullet_sivulta.jpg",
    },
  }
  const src =
    focus !== "all"
      ? optionPhoto ||
        detailPhotos[machine.id]?.[focus] ||
        machine.images[photoIndex % machine.images.length]
      : machine.images[photoIndex % machine.images.length]
  const parts: FocusPart[] = ["all", "cabin", "crane", "wheels", "load"]
  return (
    <div className={`visualizer ${view === "3d" ? "visualizer-3d" : ""}`}>
      <div className="visualizer-stage">
        <div className="segment-control view-toggle">
          <button
            aria-pressed={view === "photo"}
            onClick={() => setView("photo")}
          >
            <Camera size={15} />
            {d.config.photo}
          </button>
          <button
            aria-pressed={view === "3d"}
            onClick={() => {
              setError(false)
              setView("3d")
            }}
          >
            <Box size={15} />
            {d.config.concept}
          </button>
        </div>
        {view === "3d" ? (
          <>
            <MachineScene
              model={machine.id}
              focus={focus}
              selected={selected}
              resetKey={resetKey}
              onError={onError}
              label={`${machine.name} ${d.config.concept}`}
            />
          </>
        ) : (
          <div className={`config-photo focus-${focus}`}>
            <Image
              key={src}
              src={src}
              alt={
                machine.name +
                " — " +
                (focus !== "all" ? d.config[focus] : machine.tagline[locale])
              }
              fill
              preload
              sizes="(max-width: 800px) 100vw, 65vw"
            />
            {focus === "all" && machine.images.length > 1 && (
              <div className="config-photo-controls">
                <button
                  className="icon-button"
                  aria-label={d.media.previous}
                  onClick={() =>
                    setPhotoIndex(
                      (photoIndex - 1 + machine.images.length) %
                        machine.images.length
                    )
                  }
                >
                  <ChevronLeft size={18} />
                </button>
                <span>
                  {(photoIndex % machine.images.length) + 1} /{" "}
                  {machine.images.length}
                </span>
                <button
                  className="icon-button"
                  aria-label={d.media.next}
                  onClick={() =>
                    setPhotoIndex((photoIndex + 1) % machine.images.length)
                  }
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="visualizer-bottom">
        <div className="focus-parts" aria-label={d.config.focus}>
          {parts.map((part) => (
            <button
              key={part}
              aria-pressed={focus === part}
              onClick={() => setFocus(part)}
            >
              {d.config[part]}
            </button>
          ))}
        </div>
        {(error || view === "3d") && (
          <div className="visualizer-note">
            {error && <span role="status">{d.config.fallback}</span>}
            {view === "3d" && (
              <button
                className="icon-button"
                aria-label={d.config.reset}
                onClick={() => {
                  setFocus("all")
                  setResetKey(resetKey + 1)
                }}
              >
                <RotateCcw size={16} />
              </button>
            )}
          </div>
        )}
        {view === "3d" && <span className="drag-note">{d.config.rotate}</span>}
      </div>
    </div>
  )
}
