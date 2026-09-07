import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react"
import type { Locale } from "@/lib/i18n"
export function CompanyDetails({ locale }: { locale: Locale }) {
  const fi = locale === "fi"
  return (
    <section className="company-details section-pad">
      <div className="company-details-intro">
        <h2>
          {fi ? "Ihmiset koneiden takana." : "The people behind the machines."}
        </h2>
        <p>
          {fi
            ? "Logbullet-koneet valmistaa Porttivuori Oy Tuusulassa. Suunnittelija ja perustaja Pekka Syvänen yhdistää koneenrakennuksen osaamisen oman metsän käytännön kokemukseen."
            : "Logbullet machines are manufactured by Porttivuori Oy in Tuusula, Finland. Designer and founder Pekka Syvänen brings together mechanical engineering and practical experience in his own forest."}
        </p>
      </div>
      <div className="company-contact-grid">
        <div>
          <h3>Porttivuori Oy</h3>
          <p>{fi ? "Logbulletin valmistaja" : "Manufacturer of Logbullet"}</p>
          <p>
            {fi ? "Yhteyshenkilö" : "Your contact"}
            <br />
            <strong>Pekka Syvänen</strong>
          </p>
        </div>
        <div>
          <h3>{fi ? "Ota yhteyttä" : "Get in touch"}</h3>
          <a href="mailto:info@logbullet.com">
            <Mail size={20} />
            info@logbullet.com
          </a>
          <a href="tel:+358405263806">
            <Phone size={20} />
            +358 40 526 3806
          </a>
          <p>
            {fi
              ? "Koneet, varusteet, varaosat ja huolto — kysy suoraan tekijältä."
              : "Machines, equipment, parts and maintenance — speak directly with the people who build them."}
          </p>
        </div>
        <div>
          <h3>{fi ? "Tule käymään" : "Visit the workshop"}</h3>
          <p>
            <MapPin size={20} />
            Piikivenkuja 3<br />
            04300 Tuusula, {fi ? "Suomi" : "Finland"}
          </p>
          <p>
            {fi
              ? "Sovitaan vierailuaika etukäteen."
              : "Get in touch to arrange your visit."}
          </p>
          <a
            href="https://www.google.com/maps/search/?api=1&query=Piikivenkuja+3+04300+Tuusula+Finland"
            target="_blank"
            rel="noreferrer"
            className="text-link"
          >
            {fi ? "Avaa kartta" : "Get directions"}
            <ArrowUpRight size={18} />
          </a>
        </div>
      </div>
    </section>
  )
}
