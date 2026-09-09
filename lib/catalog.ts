import { number, type Locale } from "./i18n"
export type Localized = Record<Locale, string>
export type ModelId = "logbullet" | "superbullet" | "megamax"
export type FocusPart = "all" | "cabin" | "crane" | "wheels" | "load"
export type Equipment = {
  id: string
  name: Localized
  description: Localized
  price: number | null
  focus: FocusPart
  image?: string
  group?: string
}
export type Machine = {
  id: ModelId
  name: string
  tagline: Localized
  description: Localized
  basePrice: number
  payload: number
  width: number
  length: number
  height: number
  weight: number
  power: number | [number, number]
  engine: string
  reach: number | null
  image: string
  cardImage: string
  images: string[]
  video: string
  source: Record<Locale, string>
  standard: Localized[]
  equipment: Equipment[]
}
const l = (en: string, fi: string): Localized => ({ en, fi })
const media = (name: string) => `/media/${name}.jpg`
export const machines: Machine[] = [
  {
    id: "logbullet",
    name: "Logbullet",
    tagline: l("Small and agile", "pieni ja ketterä"),
    description: l(
      "The original compact forwarder. Simple to operate, easy to transport, and at home between the trees.",
      "Alkuperäinen pienajokone. Helppo käyttää ja kuljettaa, kuin kotonaan puiden välissä."
    ),
    basePrice: 34900,
    payload: 2400,
    width: 1.58,
    length: 5,
    height: 2.16,
    weight: 2000,
    power: 18.2,
    engine: "Kubota V1505",
    reach: 3.8,
    image: media("logbullet_8x8_1200"),
    cardImage: media("logbullet_8x8_1200"),
    images: [
      media("logbullet_8x8_1200"),
      media("logbullet_fromsidetorear_1200"),
      media("logbullet_takingloadrear_1200"),
      media("logbullet_loadareaview_1200"),
    ],
    video: "CIsVyuMwSvg",
    source: {
      en: "https://www.logbullet.com/logbullet/technical-features/",
      fi: "https://www.logbullet.com/fi/original-hd/",
    },
    standard: [
      l("8×8 hydrostatic drive", "Hydrostaattinen 8×8-veto"),
      l("Kubota V1505 diesel engine", "Kubota V1505 -dieselmoottori"),
      l("Farma 3.8 m crane", "Farma 3,8 m -nosturi"),
      l("Hydraulic support legs", "Hydrauliset tukijalat"),
    ],
    equipment: [
      {
        id: "crane42",
        name: l("Farma 4.2 m crane", "Farma 4,2 m -nosturi"),
        description: l(
          "Extra reach with a hydraulic extension. Requires upgraded controls.",
          "Lisää ulottumaa hydraulisella jatkeella. Vaatii päivitetyn venttiilin."
        ),
        price: 648,
        focus: "crane",
        image: media("extensionbeam_farma42"),
      },
      {
        id: "manual",
        name: l("Upgraded manual controls", "Päivitetty manuaaliventtiili"),
        description: l(
          "Modular 2+4 controls for the extended crane.",
          "Lohkorakenteinen 2+4-venttiili jatkopuomille."
        ),
        price: 450,
        focus: "cabin",
        group: "controls",
        image: media("farma_kahdeksantoimintoa"),
      },
      {
        id: "electric",
        name: l("Electric joystick controls", "Sähköiset hallintalaitteet"),
        description: l(
          "Two joysticks with buttons for the grapple and extension. Two hydraulic outputs included.",
          "Kaksi joystickia, painikkeet kouralle ja jatkeelle. Kaksi hydrauliikkalähtöä sisältyy."
        ),
        price: 1695,
        focus: "cabin",
        group: "controls",
        image: media("logbullet_electricextravalve"),
      },
      {
        id: "torque",
        name: l("Torque box", "Torque box"),
        description: l(
          "Half the travel speed, twice the torque. Operated with an electrical switch.",
          "Puolet ajonopeudesta, kaksinkertainen vääntö. Käyttö sähkökytkimellä."
        ),
        price: 1135,
        focus: "wheels",
        image: media("torquebox"),
      },
      {
        id: "extension",
        name: l("Load area extension", "Kuormatilan jatke"),
        description: l(
          "For longer timber, up to 5.5 m. Includes two bent wood holders.",
          "Pidemmälle, enintään 5,5 metrin puutavaralle. Sisältää kaksi taivutettua pankkoa."
        ),
        price: 345,
        focus: "load",
        image: media("logbullet_lavanjatke"),
      },
      {
        id: "winch",
        name: l("Farma RW600 winch", "Farma RW600 -vinssi"),
        description: l(
          "A helping hand when felling. Nominal pull up to 600 kg; working pull varies.",
          "Apua puunkaatoon. Nimellisvetovoima enintään 600 kg; käytännön vetovoima vaihtelee."
        ),
        price: 1670,
        focus: "crane",
        image: media("logbulletvinssi"),
      },
      {
        id: "lights",
        name: l("Crane work light", "Nosturin työvalo"),
        description: l(
          "Light where you need it on the crane boom.",
          "Valoa sinne, missä sitä tarvitset — nosturin puomille."
        ),
        price: 195,
        focus: "crane",
        image: media("logbullet_puomivalot"),
      },
      {
        id: "chainsaw",
        name: l("Chainsaw holder", "Moottorisahateline"),
        description: l(
          "Keep your saw close at hand and securely stowed.",
          "Pidä saha käden ulottuvilla ja tukevasti paikallaan."
        ),
        price: 95,
        focus: "cabin",
        image: media("logbullet_chainsawholder"),
      },
      {
        id: "storage",
        name: l("Aluminium storage box", "Alumiininen säilytyslaatikko"),
        description: l(
          "A practical place for your lunch and supplies.",
          "Käytännöllinen paikka eväille ja tarvikkeille."
        ),
        price: 210,
        focus: "cabin",
        image: media("lunchbox"),
      },
      {
        id: "support",
        name: l("Hand support", "Käsituki"),
        description: l(
          "Support for relaxed, precise valve operation.",
          "Tukea rentoon ja tarkkaan venttiilin käyttöön."
        ),
        price: 95,
        focus: "cabin",
        image: media("handsupport"),
      },
      {
        id: "hydraulics",
        name: l("Extra hydraulic output", "Lisähydrauliikkalähtö"),
        description: l(
          "An additional hydraulic valve. Already included with electric controls.",
          "Lisähydrauliikkaventtiili. Sisältyy jo sähköisiin hallintalaitteisiin."
        ),
        price: 395,
        focus: "crane",
        image: media("logbulletlis-hydrauliikka"),
      },
      {
        id: "bumper",
        name: l("Front bumper", "Etupuskuri"),
        description: l(
          "Added protection while retaining access for maintenance.",
          "Lisäsuojaa ilman huollon vaikeuttamista."
        ),
        price: 195,
        focus: "wheels",
        image: media("bumber"),
      },
      {
        id: "brackets",
        name: l("Non-slip brackets, pair", "Liukuesteet, pari"),
        description: l(
          "Help keep your logs in place. Mounting U-bolts included.",
          "Auttavat pitämään puut paikoillaan. Kiinnityspultit sisältyvät."
        ),
        price: 104,
        focus: "load",
        image: media("logholders"),
      },
      {
        id: "spare",
        name: l("Spare wheel & rim", "Varapyörä ja vanne"),
        description: l(
          "A spare ready for the unexpected.",
          "Varapyörä valmiina yllätyksiä varten."
        ),
        price: 220,
        focus: "wheels",
        image: media("logbullet_spare_wheel"),
      },
      {
        id: "bucket",
        name: l("Grapple bucket inserts", "Kouran lisäkelevyt"),
        description: l(
          "Turn the grapple into a practical material bucket.",
          "Tee kourasta käytännöllinen materiaalikauha."
        ),
        price: 295,
        focus: "crane",
        image: media("farmalis-kelevyt"),
      },
      {
        id: "energy",
        name: l(
          "Energy wood grapple upgrade",
          "Energiapuukoura vakion tilalle"
        ),
        description: l(
          "Farma 0.12 G2.1 in place of the standard grapple.",
          "Farma 0.12 G2.1 vakiokouran tilalle."
        ),
        price: 380,
        focus: "crane",
        group: "grapple",
        image: media("energygrapple"),
      },
      {
        id: "energy-extra",
        name: l(
          "Additional energy wood grapple",
          "Energiapuukoura vakiokouran lisäksi"
        ),
        description: l(
          "Keep the standard grapple and add a Farma 0.12 G2.1.",
          "Säilytä vakiokoura ja lisää Farma 0.12 G2.1."
        ),
        price: 795,
        focus: "crane",
        group: "grapple",
        image: media("energygrapple"),
      },
      {
        id: "holders",
        name: l("Additional bent wood holder", "Lisäpankko, taivutettu"),
        description: l(
          "One additional holder. The load extension already includes two.",
          "Yksi lisäpankko. Kuormatilan jatke sisältää jo kaksi."
        ),
        price: 64,
        focus: "load",
        image: media("logbullet_lavanjatke"),
      },
      {
        id: "filters",
        name: l("Logbullet filter set", "Logbullet-suodatinsarja"),
        description: l(
          "Four engine oil filters, plus diesel, air and hydraulic oil filters.",
          "Neljä moottoriöljynsuodatinta sekä polttoaine-, ilma- ja hydrauliikkaöljynsuodatin."
        ),
        price: 175,
        focus: "wheels",
        image: media("logbullet_filters"),
      },
    ],
  },
  {
    id: "superbullet",
    name: "Superbullet",
    tagline: l("Weather protection and efficiency", "säänsuojaa ja tehokkuutta"),
    description: l(
      "Compact outside. Comfortable inside. A closed cabin, intuitive mini levers and more power for your everyday forestry.",
      "Kompakti ulkoa. Mukava sisältä. Umpiohjaamo, kätevät minivivut ja lisää voimaa päivittäisiin metsätöihin."
    ),
    basePrice: 54000,
    payload: 2400,
    width: 1.6,
    length: 5.2,
    height: 2.55,
    weight: 2500,
    power: 33,
    engine: "Kubota V1505-CR-TE5",
    reach: 4.2,
    image: media("superbullet_etuviisto"),
    cardImage: media("superbullet_sivulta"),
    images: [
      media("superbullet_etuviisto"),
      media("superbullet_sivulta"),
      media("superbullet_minilever"),
      media("superbullet_moottori"),
      media("superbullet_ilmastointi"),
      media("superbullet_valot"),
    ],
    video: "dzreIzrfRXE",
    source: {
      en: "https://www.logbullet.com/superbullet/",
      fi: "https://www.logbullet.com/fi/superbullet/",
    },
    standard: [
      l("Closed operator cabin", "Umpiohjaamo"),
      l("33 kW Kubota Stage V engine", "33 kW Kubota Stage V -moottori"),
      l(
        "Electric proportional mini-lever controls",
        "Sähköiset proportionaaliset minivivut"
      ),
      l("4.2 m crane outreach", "Nosturin ulottuma 4,2 m"),
    ],
    equipment: [
      {
        id: "farma",
        name: l("Farma 4.2 crane", "Farma 4.2 -nosturi"),
        description: l(
          "Specify the Farma crane option. Confirmed with your request.",
          "Valitse Farma-nosturi. Vahvistetaan pyynnön yhteydessä."
        ),
        price: null,
        focus: "crane",
        group: "crane",
      },
      {
        id: "palms",
        name: l("Palms 2.42 crane", "Palms 2.42 -nosturi"),
        description: l(
          "Specify the alternative Palms crane. Confirmed with your request.",
          "Valitse vaihtoehtoinen Palms-nosturi. Vahvistetaan pyynnön yhteydessä."
        ),
        price: null,
        focus: "crane",
        group: "crane",
      },
      {
        id: "ac",
        name: l("Cabin air conditioning", "Ohjaamon ilmastointi"),
        description: l(
          "Request air conditioning for warmer working days. Adds to overall height.",
          "Pyydä ilmastointi lämpimiin työpäiviin. Lisää kokonaiskorkeutta."
        ),
        price: null,
        focus: "cabin",
        image: media("superbullet_ilmastointi"),
      },
      {
        id: "lights",
        name: l("Additional work lighting", "Lisätyövalot"),
        description: l(
          "Discuss the right lighting setup for your working hours.",
          "Suunnitellaan työaikoihisi sopiva valaistus."
        ),
        price: null,
        focus: "cabin",
        image: media("superbullet_valot"),
      },
    ],
  },
  {
    id: "megamax",
    name: "Megamax",
    tagline: l(
      "The most powerful harvester or tractor",
      "voimakkain harvesteri tai traktori"
    ),
    description: l(
      "The biggest member of the family. More carrying capacity, a spacious cabin and the versatility to take on bigger work.",
      "Perheen suurin. Lisää kantavuutta, tilava ohjaamo ja monipuolisuutta isompiin töihin."
    ),
    basePrice: 78000,
    payload: 3000,
    width: 1.9,
    length: 6,
    height: 2.55,
    weight: 3000,
    power: [48.6, 55.4],
    engine: "Kubota V2403 / Deutz TCD 2.2",
    reach: null,
    image: media("dji_0910-scaled"),
    cardImage: media("dji_0910-scaled"),
    images: [media("dji_0910-scaled")],
    video: "mcjxLKU9LQM",
    source: {
      en: "https://www.logbullet.com/megamax/",
      fi: "https://www.logbullet.com/fi/megamax/",
    },
    standard: [
      l("3,000 kg payload", "Hyötykuorma 3 000 kg"),
      l("Enclosed operator cabin", "Umpiohjaamo"),
      l("Eight hub drive motors", "Kahdeksan napavetomoottoria"),
      l("Over 400 mm ground clearance", "Yli 400 mm maavara"),
    ],
    equipment: [
      {
        id: "combi",
        name: l("Combi configuration", "Combi-kokoonpano"),
        description: l(
          "Forwarding and harvesting in one machine.",
          "Puunajoa ja hakkuuta samalla koneella."
        ),
        price: 20000,
        focus: "crane",
        group: "version",
      },
      {
        id: "harvester",
        name: l("Harvester configuration", "Harvesteri-kokoonpano"),
        description: l(
          "A dedicated configuration for harvesting timber.",
          "Puutavaran hakkuuseen suunniteltu kokoonpano."
        ),
        price: 18000,
        focus: "crane",
        group: "version",
      },
    ],
  },
]
export function getMachine(id: string) {
  return machines.find((machine) => machine.id === id)
}
export function formatPowerValue(power: Machine["power"], locale: Locale) {
  return Array.isArray(power)
    ? power.map((value) => number(value, locale)).join("–")
    : number(power, locale)
}
export function normalizeOptions(machine: Machine, options: string[]) {
  const valid = [...new Set(options)].filter((id) =>
    machine.equipment.some((item) => item.id === id)
  )
  const groups = new Set<string>()
  const selected = valid.filter((id) => {
    const item = machine.equipment.find((entry) => entry.id === id)!
    if (!item.group) return true
    if (groups.has(item.group)) return false
    groups.add(item.group)
    return true
  })
  if (machine.id === "logbullet") {
    if (selected.includes("electric")) {
      const index = selected.indexOf("hydraulics")
      if (index >= 0) selected.splice(index, 1)
    }
    if (
      selected.includes("crane42") &&
      !selected.includes("manual") &&
      !selected.includes("electric")
    )
      selected.push("manual")
  }
  return selected
}
export function toggleOption(machine: Machine, current: string[], id: string) {
  const option = machine.equipment.find((item) => item.id === id)
  if (!option) return normalizeOptions(machine, current)
  let next = current.includes(id)
    ? current.filter((value) => value !== id)
    : [
        ...current.filter(
          (value) =>
            !option.group ||
            machine.equipment.find((item) => item.id === value)?.group !==
              option.group
        ),
        id,
      ]
  if (machine.id === "logbullet" && id === "hydraulics" && next.includes(id))
    next = next.filter((value) => value !== "electric")
  return normalizeOptions(machine, next)
}
export function calculateEstimate(machine: Machine, selected: string[]) {
  const equipment = machine.equipment.filter((item) =>
    normalizeOptions(machine, selected).includes(item.id)
  )
  return {
    total:
      machine.basePrice +
      equipment.reduce((total, item) => total + (item.price ?? 0), 0),
    unpriced: equipment.some((item) => item.price === null),
    equipment,
  }
}
