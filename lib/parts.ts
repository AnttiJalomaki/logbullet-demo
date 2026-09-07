import type { Localized, ModelId } from "./catalog"
import type { Locale } from "./i18n"

const l = (en: string, fi: string): Localized => ({ en, fi })
export const partCategories = {
  filters: l("Filters & service kits", "Suodattimet ja huoltosarjat"),
  lubrication: l("Oils & grease", "Öljyt ja rasvat"),
  running: l("Wheels & bearings", "Pyörät ja laakerit"),
  electrical: l("Electrical", "Sähköosat"),
  crane: l("Crane & hydraulics", "Kuormain ja hydrauliikka"),
}
export type PartCategory = keyof typeof partCategories
export type Part = {
  id: string
  sku: string
  name: Localized
  description: Localized
  detail: Localized
  category: PartCategory
  models: ModelId[]
  priceCents: number
  stock: number
  image: string
  aliases: string[]
  guide: string
}
const allModels: ModelId[] = ["logbullet", "superbullet", "megamax"]

// Fixture catalogue for the UX prototype. Sources and assumptions: docs/service-parts.md.
export const parts: Part[] = [
  {
    id: "engine-filter-set",
    sku: "LB-FLT-001",
    category: "filters",
    models: ["logbullet"],
    priceCents: 17500,
    stock: 12,
    name: l("Engine filter set", "Moottorin suodatinsarja"),
    description: l(
      "The essentials for your next service.",
      "Kaikki tarpeellinen seuraavaan huoltoon."
    ),
    detail: l(
      "Includes four engine oil filters, one fuel filter, one air filter and one hydraulic return filter for the original Logbullet.",
      "Sisältää neljä moottoriöljyn suodatinta, polttoainesuodattimen, ilmansuodattimen ja hydrauliikan paluusuodattimen alkuperäiseen Logbulletiin."
    ),
    image: "/media/logbullet_filters.jpg",
    aliases: ["service kit", "oil filter", "huoltosarja", "HH160-32093"],
    guide: "oil",
  },
  {
    id: "sealed-bearing",
    sku: "LB-BRG-002",
    category: "running",
    models: allModels,
    priceCents: 2900,
    stock: 24,
    name: l("Sealed bearing", "Tiivistetty laakeri"),
    description: l(
      "A fresh start for a well-used pivot.",
      "Uutta liikettä kovassa käytössä olleeseen niveleen."
    ),
    detail: l(
      "Sealed replacement bearing, supplied individually. Include your machine serial number with the request to match the installation position.",
      "Tiivistetty vaihtolaakeri, toimitetaan yksittäin. Lisää pyyntöön koneen sarjanumero asennuspaikan mukaista valintaa varten."
    ),
    image: "/media/parts/bearing.svg",
    aliases: ["ball bearing", "laakeri"],
    guide: "daily",
  },
  {
    id: "grease-cartridge",
    sku: "LB-LUB-003",
    category: "lubrication",
    models: allModels,
    priceCents: 1490,
    stock: 48,
    name: l("Grease cartridge · 400 g", "Rasvapatruuna · 400 g"),
    description: l(
      "Everyday care for hardworking joints.",
      "Päivittäistä huolenpitoa kuormittuville nivelille."
    ),
    detail: l(
      "A 400 g cartridge for a manual grease gun. Keep one with your service tools for regular lubrication of the machine’s grease points.",
      "400 gramman patruuna käsikäyttöiseen rasvaprässiin. Pidä patruuna huoltotarvikkeiden mukana koneen rasvauspisteiden säännölliseen voiteluun."
    ),
    image: "/media/parts/grease.svg",
    aliases: ["lubricant", "greasing", "rasva", "voitelu"],
    guide: "grease",
  },
  {
    id: "engine-oil",
    sku: "LB-LUB-004",
    category: "lubrication",
    models: allModels,
    priceCents: 4500,
    stock: 20,
    name: l("Engine oil · 5 L", "Moottoriöljy · 5 l"),
    description: l(
      "Ready for the next oil change.",
      "Valmiina seuraavaan öljynvaihtoon."
    ),
    detail: l(
      "A 5 litre service container. The oil specification is matched to the engine identified in your order request.",
      "Viiden litran huoltopakkaus. Öljyn luokitus valitaan tilauspyynnössä ilmoitetun moottorin mukaan."
    ),
    image: "/media/parts/oil.svg",
    aliases: ["motor oil", "diesel", "öljy"],
    guide: "oil",
  },
  {
    id: "wheel-and-tyre",
    sku: "LB-WHL-005",
    category: "running",
    models: ["logbullet"],
    priceCents: 22000,
    stock: 6,
    name: l("Wheel & tyre assembly", "Pyörä ja rengas"),
    description: l(
      "A complete spare, ready when needed.",
      "Täydellinen varapyörä tarpeen varalle."
    ),
    detail: l(
      "Wheel and tyre assembly for the original Logbullet. Supplied as a complete spare wheel.",
      "Pyörän ja renkaan yhdistelmä alkuperäiseen Logbulletiin. Toimitetaan täydellisenä varapyöränä."
    ),
    image: "/media/logbullet_spare_wheel.jpg",
    aliases: ["tire", "tyres", "spare wheel", "rengas", "varapyörä"],
    guide: "daily",
  },
  {
    id: "fuel-filter",
    sku: "LB-FLT-006",
    category: "filters",
    models: ["logbullet"],
    priceCents: 3800,
    stock: 16,
    name: l("Fuel filter", "Polttoainesuodatin"),
    description: l(
      "Clean fuel. Consistent running.",
      "Puhdasta polttoainetta. Tasaista käyntiä."
    ),
    detail: l(
      "Replacement fuel filter for the original Logbullet’s Kubota engine. Reference 15221-43170.",
      "Vaihtopolttoainesuodatin alkuperäisen Logbulletin Kubota-moottoriin. Viite 15221-43170."
    ),
    image: "/media/parts/fuel-filter.svg",
    aliases: ["diesel filter", "15221-43170", "dieselsuodatin"],
    guide: "daily",
  },
  {
    id: "hydraulic-return-filter",
    sku: "LB-HYD-007",
    category: "crane",
    models: allModels,
    priceCents: 5900,
    stock: 9,
    name: l("Hydraulic return filter", "Hydrauliikan paluusuodatin"),
    description: l(
      "Care for the system that does the lifting.",
      "Huolenpitoa nostotyötä tekevälle järjestelmälle."
    ),
    detail: l(
      "Replacement return-filter element. Include the reference printed on your filter housing to match the correct element.",
      "Vaihdettava paluusuodatinelementti. Lisää pyyntöön suodatinkotelon viitenumero oikean elementin valintaa varten."
    ),
    image: "/media/parts/hydraulic-filter.svg",
    aliases: ["hydraulics", "hydrauliikkasuodatin", "return element"],
    guide: "daily",
  },
  {
    id: "ecu-control-unit",
    sku: "LB-ECU-008",
    category: "electrical",
    models: ["superbullet", "megamax"],
    priceCents: 39000,
    stock: 0,
    name: l("ECU control unit", "ECU-ohjainyksikkö"),
    description: l(
      "The control at the heart of your machine.",
      "Koneen ohjauksen ytimessä."
    ),
    detail: l(
      "Electronic control unit. Your machine serial number and existing unit reference identify the required software and connector arrangement.",
      "Elektroninen ohjainyksikkö. Koneen sarjanumero ja nykyisen yksikön viitenumero määrittävät tarvittavan ohjelmiston ja liitännät."
    ),
    image: "/media/parts/ecu.svg",
    aliases: ["electronics", "computer", "controller", "ohjain"],
    guide: "daily",
  },
  {
    id: "led-work-light",
    sku: "LB-LED-009",
    category: "electrical",
    models: allModels,
    priceCents: 6900,
    stock: 14,
    name: l("LED work light", "LED-työvalo"),
    description: l(
      "A clearer view of the work ahead.",
      "Selkeämpi näkymä työhön."
    ),
    detail: l(
      "Compact work light with an adjustable mounting bracket. Include the mounting position and machine model with your request.",
      "Kompakti työvalo säädettävällä kiinnikkeellä. Ilmoita pyynnössä asennuspaikka ja konemalli."
    ),
    image: "/media/parts/light.svg",
    aliases: ["lamp", "headlight", "valaisin", "lamppu"],
    guide: "daily",
  },
  {
    id: "crane-pivot-bushing",
    sku: "LB-CRN-010",
    category: "crane",
    models: allModels,
    priceCents: 3900,
    stock: 18,
    name: l("Crane pivot bushing", "Kuormaimen nivelholkki"),
    description: l(
      "Keep movement smooth and controlled.",
      "Pidä liike tasaisena ja hallittuna."
    ),
    detail: l(
      "Replacement wear bushing for a crane pivot. Supply the crane model and pivot position to select the correct fit.",
      "Vaihdettava kulutusholkki kuormaimen niveleen. Ilmoita kuormaimen malli ja nivelen sijainti oikean koon valintaa varten."
    ),
    image: "/media/parts/bushing.svg",
    aliases: ["sleeve", "bush", "holkki", "nosturi"],
    guide: "grease",
  },
]
export const getPart = (id: string) => parts.find((part) => part.id === id)
export const partMoney = (cents: number, locale: Locale) =>
  new Intl.NumberFormat(locale === "fi" ? "fi-FI" : "en-IE", {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100)

export const normalizeSearch = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
// Damerau–Levenshtein: adjacent transpositions count as one typo.
export function editDistance(a: string, b: string): number {
  const rows = Array.from({ length: a.length + 1 }, (_, i) =>
    Array.from({ length: b.length + 1 }, (_, j) =>
      i === 0 ? j : j === 0 ? i : 0
    )
  )
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++) {
      rows[i][j] = Math.min(
        rows[i - 1][j] + 1,
        rows[i][j - 1] + 1,
        rows[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      )
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1])
        rows[i][j] = Math.min(rows[i][j], rows[i - 2][j - 2] + 1)
    }
  return rows[a.length][b.length]
}
export function searchParts(query: string): Part[] {
  const normalized = normalizeSearch(query).slice(0, 120)
  if (!normalized) return parts
  const tokens = normalized.split(" ").filter(Boolean)
  const compact = normalized.replaceAll(" ", "")
  return parts
    .map((part) => {
      const names = normalizeSearch(`${part.name.en} ${part.name.fi}`)
      const aliases = normalizeSearch(
        `${part.sku} ${part.aliases.join(" ")} ${part.models.join(" ")}`
      )
      const words = `${names} ${aliases}`.split(" ")
      const skuMatch = [part.sku, ...part.aliases].some((value) =>
        normalizeSearch(value).replaceAll(" ", "").includes(compact)
      )
      let score = skuMatch ? 100 : names.includes(normalized) ? 80 : 0
      for (const token of tokens) {
        const match = Math.max(
          ...words.map((word) =>
            word === token
              ? 20
              : word.startsWith(token)
                ? 14
                : token.length >= 4 &&
                    Math.abs(word.length - token.length) <= 2 &&
                    editDistance(token, word) <= (token.length >= 6 ? 2 : 1)
                  ? 5
                  : 0
          )
        )
        if (!match && !skuMatch) return { part, score: 0 }
        score += match
      }
      return { part, score }
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ part }) => part)
}
