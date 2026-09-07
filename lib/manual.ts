import type { Localized } from "./catalog"
const l = (en: string, fi: string): Localized => ({ en, fi })
export const maintenanceGuides = [
  {
    id: "oil",
    label: l("Oil & filter", "Öljy ja suodatin"),
    title: l(
      "Change the engine oil & filter.",
      "Vaihda moottoriöljy ja suodatin."
    ),
    intro: l(
      "A clean workspace and the right supplies make routine service straightforward.",
      "Puhdas työtila ja oikeat tarvikkeet tekevät määräaikaishuollosta sujuvaa."
    ),
    image: "/media/service/oil-service.png",
    alt: l(
      "Gloved hands replacing a spin-on filter in an open engine bay",
      "Suojakäsineillä varustetut kädet vaihtavat suodatinta avoimessa moottoritilassa"
    ),
    category: "filters",
    tools: l(
      "Drain container · Filter wrench · Gloves · Clean cloths · Correct oil and filter",
      "Keräysastia · Suodatinavain · Suojakäsineet · Puhtaita liinoja · Oikea öljy ja suodatin"
    ),
    steps: [
      {
        title: l("Prepare the machine", "Valmistele kone"),
        text: l(
          "Park level, lower the crane, apply the parking brake and stop the engine. Let hot components cool.",
          "Pysäköi tasaiselle, laske kuormain, kytke seisontajarru ja sammuta moottori. Anna kuumien osien jäähtyä."
        ),
      },
      {
        title: l("Drain the old oil", "Tyhjennä vanha öljy"),
        text: l(
          "Clean around the drain plug. Place a suitable container below it, then drain. Refit the plug to the engine’s instructions.",
          "Puhdista tyhjennystulpan ympäristö. Aseta alle sopiva astia ja valuta öljy. Asenna tulppa moottorin ohjeen mukaan."
        ),
      },
      {
        title: l("Replace the filter", "Vaihda suodatin"),
        text: l(
          "Remove the old filter and gasket. Clean the sealing face. Oil the new gasket and fit as instructed by its manufacturer.",
          "Poista vanha suodatin ja tiiviste. Puhdista tiivistepinta. Öljyä uusi tiiviste ja asenna valmistajan ohjeella."
        ),
      },
      {
        title: l("Refill and check", "Täytä ja tarkista"),
        text: l(
          "Use the engine’s specified oil. Fill gradually and check the dipstick. Keep the level between its marks.",
          "Käytä moottorille määritettyä öljyä. Täytä vähitellen ja tarkista mittatikusta. Pidä pinta merkkien välissä."
        ),
      },
      {
        title: l("Finish the service", "Viimeistele huolto"),
        text: l(
          "Refit guards, check for leaks after a brief run outdoors, then stop and recheck the level. Recycle used oil and filters.",
          "Kiinnitä suojat, tarkista vuodot lyhyen ulkona tehdyn koekäytön jälkeen, sammuta ja tarkista pinta uudelleen. Kierrätä öljy ja suodattimet."
        ),
      },
    ],
  },
  {
    id: "daily",
    label: l("Daily checks", "Päivittäiset tarkistukset"),
    title: l(
      "A walk around before you start.",
      "Tarkistuskierros ennen töitä."
    ),
    intro: l(
      "Take a moment to check the machine before heading into the forest.",
      "Varaa hetki koneen tarkistamiseen ennen metsään lähtöä."
    ),
    image: "/media/logbullet_spare_wheel.jpg",
    alt: l("Logbullet wheel and tyre", "Logbulletin pyörä ja rengas"),
    category: "running",
    tools: l(
      "Clean cloth · Tyre pressure gauge · Service record",
      "Puhdas liina · Rengaspainemittari · Huoltokirja"
    ),
    steps: [
      {
        title: l("Park and look around", "Pysäköi ja katso ympärillesi"),
        text: l(
          "With the machine stopped and the crane lowered, clear branches and debris from steps, guards and the engine area.",
          "Pidä kone sammutettuna ja kuormain laskettuna. Poista oksat ja roskat askelmilta, suojista ja moottorin ympäriltä."
        ),
      },
      {
        title: l("Check tyres and wheels", "Tarkista renkaat ja pyörät"),
        text: l(
          "Look for cuts, embedded objects and loose wheel fasteners. Measure cold tyre pressures against the tyre specification.",
          "Etsi viiltoja, vierasesineitä ja löysiä pyöränkiinnikkeitä. Vertaa kylmän renkaan painetta rengaskohtaiseen arvoon."
        ),
      },
      {
        title: l("Check fluid levels", "Tarkista nestepinnat"),
        text: l(
          "Check the engine dipstick and visible reservoir levels. Open the cooling system only when cold.",
          "Tarkista moottorin mittatikku ja säiliöiden näkyvät pinnat. Avaa jäähdytysjärjestelmä vain kylmänä."
        ),
      },
      {
        title: l(
          "Inspect hoses and connections",
          "Tarkista letkut ja liitokset"
        ),
        text: l(
          "Look for wear and wet patches. Never feel for a hydraulic leak with your hand; arrange repair before use.",
          "Etsi kulumia ja kosteita kohtia. Älä tunnustele hydraulivuotoa kädellä; korjauta vuoto ennen käyttöä."
        ),
      },
      {
        title: l("Check controls before work", "Tarkista hallintalaitteet"),
        text: l(
          "From the operating position, check lights, steering and brakes in a clear area at low speed before starting work.",
          "Tarkista käyttöpaikalta valot, ohjaus ja jarrut esteettömällä alueella hitaasti ennen työn aloittamista."
        ),
      },
    ],
  },
  {
    id: "grease",
    label: l("Greasing", "Rasvaus"),
    title: l(
      "Keep the moving parts moving.",
      "Pidä liikkuvat osat liikkeessä."
    ),
    intro: l(
      "Regular attention to grease points helps care for the crane and its joints.",
      "Rasvauspisteiden säännöllinen voitelu pitää huolta kuormaimesta ja sen nivelistä."
    ),
    image: "/media/service/grease-points.png",
    alt: l(
      "A grease gun connected to a crane pivot grease point",
      "Rasvaprässi kytkettynä kuormaimen nivelen rasvauspisteeseen"
    ),
    category: "lubrication",
    tools: l(
      "Grease gun · Specified grease · Clean cloth · Gloves",
      "Rasvaprässi · Määritetty rasva · Puhdas liina · Suojakäsineet"
    ),
    steps: [
      {
        title: l("Set up for access", "Valmistele työasento"),
        text: l(
          "Park on firm, level ground. Lower the crane fully, secure the machine and stop the engine. Work only at safely accessible points.",
          "Pysäköi tukevalle, tasaiselle alustalle. Laske kuormain, varmista koneen paikallaan pysyminen ja sammuta moottori. Käsittele vain turvallisesti saavutettavia pisteitä."
        ),
      },
      {
        title: l("Clean each grease point", "Puhdista rasvauspisteet"),
        text: l(
          "Use the crane’s lubrication chart to locate each point. Wipe dirt from the nipple and grease-gun coupler before connecting.",
          "Etsi pisteet kuormaimen voitelukaaviosta. Pyyhi lika nipasta ja rasvaprässin suuttimesta ennen liittämistä."
        ),
      },
      {
        title: l("Apply the specified grease", "Lisää määritettyä rasvaa"),
        text: l(
          "Connect the coupler securely. Apply the lubricant and amount given in the component’s lubrication instructions. Stop if the point will not accept grease.",
          "Kiinnitä suutin kunnolla. Käytä osan voiteluohjeen mukaista rasvaa ja määrää. Lopeta, jos piste ei ota rasvaa vastaan."
        ),
      },
      {
        title: l("Clean up and record", "Siisti ja kirjaa"),
        text: l(
          "Remove the coupler, wipe away excess grease and check for damaged nipples. Record the service and machine hours.",
          "Irrota suutin, pyyhi ylimääräinen rasva ja tarkista nippavauriot. Kirjaa huolto ja koneen käyttötunnit."
        ),
      },
    ],
  },
]
