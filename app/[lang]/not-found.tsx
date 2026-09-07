"use client"
import Link from "next/link"
import { useParams } from "next/navigation"
import { ArrowLeft } from "lucide-react"
export default function NotFound() {
  const params = useParams()
  const fi = params.lang === "fi"
  return (
    <main className="empty-order section-pad">
      <p className="eyebrow">LOGBULLET / 404</p>
      <h1>{fi ? "Tämä polku päättyi tähän." : "This trail ends here."}</h1>
      <p>
        {fi
          ? "Etsimääsi sivua ei löytynyt. Palataan koneiden pariin."
          : "We couldn’t find that page. Let’s get you back to the machines."}
      </p>
      <Link className="button button-dark" href={fi ? "/fi" : "/en"}>
        <ArrowLeft size={17} />
        {fi ? "Takaisin etusivulle" : "Back to the forest"}
      </Link>
    </main>
  )
}
