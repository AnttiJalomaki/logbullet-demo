# Logbullet demo

A bilingual, photography-led website and guided machine configurator built with the existing Next.js 16.2.6, React 19, Tailwind 4, shadcn/Base UI and Bun starter. Ready for a standard Next.js deployment on Vercel.

## Run locally

```sh
bun install --frozen-lockfile
bun run dev
```

Open http://localhost:3000/en or http://localhost:3000/fi. The root URL chooses English or Finnish from the language cookie and browser preference.

## Explore

- `/en` — cinematic forest homepage
- `/en/models/logbullet` — model details; also `superbullet` and `megamax`
- `/en/configure/logbullet` — machine → equipment → order request
- `/en/media` — the original photo and film collection
- `/en/company` — the story, people and contact details behind Logbullet (`/en/story` redirects here)
- `/en/service-parts` — searchable parts catalogue, product pages and cart
- `/en/service-parts/account` — saved customer details and request history
- `/en/manual` — illustrated maintenance guides and checklists
- `/en/order` — the most recent request saved in this browser

Every route also exists under `/fi`. Language switching preserves the current route, equipment query parameters and configurator step. Equipment selections are shareable in the URL. Unsubmitted contact fields stay in memory and reset on reload or language changes.

## What works

The configurator has machine-specific equipment, estimates, mutually exclusive choices, and the original machine’s crane/control-valve dependency. Prices without a published source are marked as requiring a quote. Photos switch to the selected equipment or machine area. The lazy-loaded Three.js concept supports orbit, zoom, focus transitions and selected accessory visibility, with a photography fallback when WebGL fails. The renderer stops issuing frames when the scene is idle.

Order requests are **demo-only**. Submitting saves one request to `localStorage`, opens a confirmation, and enables a text download or deletion. Nothing is sent to Logbullet and no payment is collected. The newest saved request replaces the previous one. Production needs a real server-side order service and durable storage.

The service-parts shop adds ten bilingual products, typo-tolerant search, category/model/stock filters, sorting, product details, a quantity-aware cart, delivery/collection choices and a customer workspace. Parts requests support saved history, downloads and reordering; payment remains off-site. These profiles and requests use a separate localStorage record and do not implement authentication. See [service-parts implementation notes](docs/service-parts.md) for fixture data, assets and the production integration boundary.

## Content and accuracy

Original media is stored in `public/media`. `lib/content/media-manifest.json` preserves 49 image references, 16 YouTube video/playlist entries, 15 source-page references, original URLs and the retrieval date. The collection includes a few duplicate views and brand assets. The header and footer use the company logo from the current Logbullet.com header. Images use Next.js responsive optimization; videos connect to YouTube only after an explicit play action.

Published data and translated equipment descriptions live in `lib/catalog.ts`; UI translations live in `lib/dictionaries/`. Add a locale to `lib/i18n.ts` and provide a complete typed dictionary to expand the demo.

Megamax displays an engine power range of 48.6–55.4 kW, using the published English-page Kubota and Finnish-page Deutz values. Power values use the selected language's number formatting in the machine cards, comparison and specifications. All displayed prices exclude VAT and delivery. Source differences and original-model availability research remain in [content notes](docs/content-notes.md).

The interface uses 18px body copy, controls of at least 16px, and smoky translucent navigation over the forest image. Customer-facing pages and order downloads omit demo labels and availability disclaimers. Confirmation describes the saved request without claiming it was sent or accepted.

The 3D machine is a procedural illustration for validating the interaction, **not a production CAD model**. Real GLB assets and confirmed equipment attachment points are the next step toward an accurate commercial configurator.

## Checks

```sh
bun run test
bun run lint
bun run typecheck
bun run build
```

Fifteen tests cover pricing, equipment compatibility, mutually exclusive options, unknown query options, unpriced equipment, fuzzy part search, cart quantities, saved-price snapshots and saved-order parsing. Browser checks cover desktop and mobile layouts, configuration, price changes, camera focus, language switching, order saving/download/deletion and media interactions.

## Vercel

Import this repository as a Next.js project. Use `bun install --frozen-lockfile` for installation and `bun run build` for the build command. No environment variables or external backend are required for this demo. All routes use standard Next.js runtimes; no Bun-specific server APIs are required. The demo is set to `noindex` so it does not compete with the live Logbullet site.

## Next discussions

See [demo direction](docs/demo-direction.md) for the selected forest design, production boundaries and the next design decisions.
