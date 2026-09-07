"use client"
import { useState } from "react"
import { Dialog } from "@base-ui/react/dialog"
import { Play, X, ArrowUpRight } from "lucide-react"
import type { Dictionary } from "@/lib/dictionaries"
export function VideoDialog({
  id,
  title,
  d,
  className = "",
  children,
}: {
  id: string
  title: string
  d: Dictionary
  className?: string
  children?: React.ReactNode
}) {
  const [open, setOpen] = useState(false)
  const playlist = id.startsWith("playlist:")
  const src = playlist
    ? `https://www.youtube-nocookie.com/embed/videoseries?list=${encodeURIComponent(id.slice(9))}&autoplay=1`
    : `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?autoplay=1&rel=0`
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger className={className}>
        {children || (
          <>
            <Play size={15} fill="currentColor" />
            {d.home.watch}
          </>
        )}
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop className="modal-backdrop" />
        <Dialog.Popup className="video-modal">
          <div className="modal-heading">
            <Dialog.Title>{title}</Dialog.Title>
            <Dialog.Close className="icon-button" aria-label={d.media.close}>
              <X />
            </Dialog.Close>
          </div>
          <Dialog.Description className="sr-only">
            {d.media.youtube}
          </Dialog.Description>
          {open && (
            <iframe
              src={src}
              title={title}
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
            />
          )}
          <a
            href={
              playlist
                ? `https://www.youtube.com/playlist?list=${id.slice(9)}`
                : `https://www.youtube.com/watch?v=${id}`
            }
            target="_blank"
            rel="noreferrer"
          >
            {d.media.external}
            <ArrowUpRight size={16} />
          </a>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
