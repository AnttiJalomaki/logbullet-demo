"use client"

import Image from "next/image"
import { Pause, Play } from "lucide-react"
import { useEffect, useRef, useState } from "react"

const PHOTO_HOLD_MS = 3_000

export function HeroBackground({
  alt,
  pauseLabel,
  playLabel,
}: {
  alt: string
  pauseLabel: string
  playLabel: string
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const toggleRef = useRef<(() => void) | null>(null)
  const [visible, setVisible] = useState(false)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    const elements = {
      container: containerRef.current,
      image: imageRef.current,
      video: videoRef.current,
    }
    if (!elements.container || !elements.image || !elements.video) return
    const { container, image, video } = elements

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)")
    const connection = (
      navigator as Navigator & { connection?: { saveData?: boolean } }
    ).connection
    let photoReady = false
    let holdComplete = false
    let inView = false
    let userPaused = false
    let disposed = false
    let starting = false
    let holdTimer: ReturnType<typeof setTimeout> | undefined
    let frameCallback: number | undefined
    let downloadController: AbortController | undefined
    let objectUrl: string | undefined

    const motionAllowed = () => !reducedMotion.matches && !connection?.saveData
    const shouldPlay = () =>
      holdComplete &&
      inView &&
      !document.hidden &&
      !userPaused &&
      motionAllowed()

    function cancelReveal() {
      if (frameCallback !== undefined) {
        video.cancelVideoFrameCallback(frameCallback)
        frameCallback = undefined
      }
    }

    function tryPlay() {
      if (disposed || !shouldPlay() || video.error || starting) return
      if (!video.paused || video.readyState < HTMLMediaElement.HAVE_FUTURE_DATA) {
        return
      }
      starting = true
      video
        .play()
        .catch(() => {
          // Autoplay can be blocked by browser or battery-saving settings.
          if (!disposed) setVisible(false)
        })
        .finally(() => {
          starting = false
        })
    }

    function loadVideo() {
      if (!photoReady || !motionAllowed() || downloadController) return
      downloadController = new AbortController()
      // Native preload can stop early. Download the small file completely so
      // background playback never depends on the connection keeping up.
      fetch("/media/logbullet-hero.mp4", { signal: downloadController.signal })
        .then(async (response) => {
          if (!response.ok) throw new Error("Hero video unavailable")
          const blob = await response.blob()
          if (disposed) return
          objectUrl = URL.createObjectURL(blob)
          video.src = objectUrl
          video.load()
        })
        .catch(() => {
          if (!disposed) setVisible(false)
        })
    }

    function onPhotoReady() {
      if (photoReady) return
      photoReady = true
      // Count from the loaded photo, so slow image loads still get the full hold.
      holdTimer = setTimeout(() => {
        holdComplete = true
        tryPlay()
      }, PHOTO_HOLD_MS)
      loadVideo()
    }

    function onPlaying() {
      if (!shouldPlay()) {
        video.pause()
        return
      }
      cancelReveal()
      const reveal = () => {
        frameCallback = undefined
        if (disposed || !shouldPlay() || video.paused) return
        setVisible(true)
        setPlaying(true)
      }
      // Reveal a decoded frame, keeping the photo beneath the fade throughout.
      if ("requestVideoFrameCallback" in video) {
        frameCallback = video.requestVideoFrameCallback(reveal)
      } else {
        reveal()
      }
    }

    function onPause() {
      setPlaying(false)
    }

    function showPhoto() {
      cancelReveal()
      video.pause()
      setVisible(false)
    }

    function syncPlayback() {
      if (!motionAllowed()) {
        showPhoto()
        return
      }
      loadVideo()
      if (shouldPlay()) {
        tryPlay()
      } else {
        cancelReveal()
        video.pause()
      }
    }

    toggleRef.current = () => {
      userPaused = !video.paused
      if (userPaused) video.pause()
      else tryPlay()
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting
        syncPlayback()
      },
      { threshold: 0 }
    )
    observer.observe(container)
    image.addEventListener("load", onPhotoReady)
    image.addEventListener("error", onPhotoReady)
    video.addEventListener("canplay", tryPlay)
    video.addEventListener("canplaythrough", tryPlay)
    video.addEventListener("progress", tryPlay)
    video.addEventListener("playing", onPlaying)
    video.addEventListener("pause", onPause)
    video.addEventListener("waiting", showPhoto)
    video.addEventListener("error", showPhoto)
    document.addEventListener("visibilitychange", syncPlayback)
    reducedMotion.addEventListener("change", syncPlayback)
    if (image.complete) onPhotoReady()

    return () => {
      disposed = true
      downloadController?.abort()
      clearTimeout(holdTimer)
      cancelReveal()
      observer.disconnect()
      toggleRef.current = null
      image.removeEventListener("load", onPhotoReady)
      image.removeEventListener("error", onPhotoReady)
      video.removeEventListener("canplay", tryPlay)
      video.removeEventListener("canplaythrough", tryPlay)
      video.removeEventListener("progress", tryPlay)
      video.removeEventListener("playing", onPlaying)
      video.removeEventListener("pause", onPause)
      video.removeEventListener("waiting", showPhoto)
      video.removeEventListener("error", showPhoto)
      document.removeEventListener("visibilitychange", syncPlayback)
      reducedMotion.removeEventListener("change", syncPlayback)
      video.pause()
      video.removeAttribute("src")
      video.load()
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [])

  return (
    <>
      <div className="hero-image" ref={containerRef}>
        <Image
          ref={imageRef}
          src="/media/logbullet_maastossa.jpg"
          alt={alt}
          fill
          preload
          sizes="100vw"
          className="image-cover"
        />
        <video
          ref={videoRef}
          className="hero-background-video"
          data-visible={visible}
          width={1280}
          height={720}
          muted
          loop
          playsInline
          preload="auto"
          disablePictureInPicture
          aria-hidden="true"
          tabIndex={-1}
        />
      </div>
      <button
        type="button"
        className="button button-glass hero-video-toggle"
        hidden={!visible}
        aria-label={playing ? pauseLabel : playLabel}
        onClick={() => toggleRef.current?.()}
      >
        {playing ? <Pause size={16} /> : <Play size={16} />}
      </button>
    </>
  )
}
