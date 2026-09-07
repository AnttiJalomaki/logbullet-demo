import Image from "next/image"
import Link from "next/link"
export function Logo({ href = "/en" }: { href?: string }) {
  return (
    <Link href={href} className="wordmark" aria-label="Logbullet">
      <Image
        src="/media/cropped-logbullet_logo_1240.jpg"
        alt=""
        width={1260}
        height={240}
        sizes="220px"
        className="logo-image"
      />
    </Link>
  )
}
