# Service parts, company and maintenance

## Prototype scope

The parts store has ten bilingual catalogue entries, category/model/stock filters, typo-tolerant search, sorting, dynamic product pages, a persistent cart, delivery or workshop collection, customer details, saved requests, text downloads and reordering. Search and filters are represented in the URL. Parts search shares the compact bar with the account and cart controls; from a product, account or cart page, submitting the search opens the catalogue results. Both parts and manual pages omit the former introductory headings and search hint. No extra dependencies or environment variables are needed.

`lib/parts.ts` contains the catalogue and search adapter. `lib/parts-copy.ts` contains typed English/Finnish UI strings. Prices use integer euro cents. Search normalizes accents, recognizes compact SKUs and aliases, and uses bounded Damerau–Levenshtein matching for misspellings. Short tokens require exact or prefix matches. All query tokens must match. The current in-memory search is appropriate for these ten items; replace this adapter with a paginated search service and server-provided facets when importing a large catalogue.

Customer profiles are a local account workspace, without authentication or passwords. The versioned `logbullet-parts-v1` localStorage record holds the cart, optionally saved contact details and the 20 newest requests. Browser storage is shared across English/Finnish routes and synchronized between tabs. It is separate from the machine configurator’s saved order. Cart writes validate IDs and quantities. Saved requests retain product names, SKUs and price snapshots. Saving a request and clearing the cart happen in one storage write; a failed write preserves the cart and displays an error. Account details and requests can be cleared through the UI.

No order or customer data is transmitted. There is no payment transaction; the flow collects an order request and describes payment as arranged separately. The customer UI intentionally has no demo notices and never claims a request was sent or accepted. Production needs authenticated sessions, server-side customer/order storage and pricing, verified stock and fitment, tax/shipping calculation, and the agreed external payment workflow. Do not reuse localStorage as production authentication.

## Catalogue fixtures and source facts

All stock counts, catalogue SKUs and model compatibility assignments are sample data for UI exploration. The bearing, grease, oil, individual fuel filter, hydraulic filter, ECU, light and bushing prices are invented fixture prices. The product illustrations are generic, not technical fitment drawings. Confirm specifications before replacing the production catalogue.

Two original Logbullet entries reuse published prices and photos:

- Engine filter set: €175 excluding VAT. Contents: four engine oil filters, one fuel filter, one air filter and one hydraulic return filter. Source: [Logbullet accessories](https://www.logbullet.com/fi/lisavarusteet/). Original photo: `public/media/logbullet_filters.jpg`.
- Wheel and tyre assembly: €220 excluding VAT. Same source. Original photo: `public/media/logbullet_spare_wheel.jpg`.
- The original-engine fuel filter reference 15221-43170 is published with the service kit. Its individual €38 price in this catalogue is a fixture.

The eight new product illustrations are editable SVG assets under `public/media/parts/`: `bearing.svg`, `grease.svg`, `oil.svg`, `fuel-filter.svg`, `hydraulic-filter.svg`, `ecu.svg`, `light.svg` and `bushing.svg`. They are code-native vector art using the existing orange and charcoal palette.

## Company information

The existing story content is preserved at `/[lang]/company`; `/[lang]/story` redirects there. The homepage’s `why-logbullet` content remains intact. The header now links to Machines, Company, Media, Service parts and Manual.

Manufacturer Porttivuori Oy and founder/designer Pekka Syvänen: [company source](https://www.logbullet.com/company/). Contact email/phone: [Logbullet media page](https://www.logbullet.com/media/). Workshop Piikivenkuja 3, 04300 Tuusula: [Finnish accessories page](https://www.logbullet.com/fi/lisavarusteet/). Retrieved 7 September 2026. No business ID, opening hours or delivery times were invented.

## Maintenance content and imagery

`lib/manual.ts` contains a library of 24 bilingual topics across six categories. Oil/filter, daily-check and greasing topics open the existing illustrated guides; the other 21 are intentionally inactive layout placeholders, with no empty pages or placeholder notices. A compact search bar matches the parts-shop account/cart bar, with horizontal category navigation beneath it. Topic search and category selections are stored in the URL. Guides have interactive step completion, print styles and links to relevant catalogue filters. The checkmarks are a session checklist, not a durable machine service record.

Instructions intentionally omit unverified capacities, oil grades, torque values and intervals. The page links to the manufacturer’s [Kubota 05-series operator manual](https://media.kubota.io/uploads/Kubota-Engines%E2%80%9305-Series-Manual.pdf), which includes V1505 variants. The generic maintenance outline should receive a machine-specific engineering review before production use. Images illustrate the UI and do not identify exact service points on a production Logbullet.

Two photos were generated with the built-in Codex image-generation tool on 7 September 2026 (`image_gen.imagegen`, brand-new images, no references):

- `public/media/service/oil-service.png` — 1536 × 1024, oil filter service.
- `public/media/service/grease-points.png` — 1536 × 1024, crane pivot lubrication.

Prompt specifications:

1. **Oil service:** Photorealistic, natural wide 3:2 tutorial shot of a gloved mechanic replacing a small diesel spin-on oil filter in the accessible open engine bay of an orange and charcoal compact forestry forwarder. Stopped and cool engine; drain tray and rag; soft Nordic workshop daylight; realistic metal and rubber; no face, text, logos or watermark; no running machinery or unsafe positions.
2. **Crane lubrication:** Photorealistic, natural wide 3:2 shot of a gloved hand using a grease gun connected to an accessible crane pivot grease nipple on a stationary orange and charcoal compact forestry forwarder. Crane lowered; no suspended load or person underneath; workshop daylight with a softly blurred forest; realistic steel textures; no text, logos or watermark.

Original generated PNGs remain in `/home/antti/.codex/generated_images/01a07c02-3e02-7a91-b919-3c0b4146164f/` as `exec-227164ab-96e6-4254-97ba-6b9ce9598d43.png` and `exec-77884d76-6272-4d2e-a1ee-14ea509a8cfc.png`. The website uses the repository copies through Next.js responsive image optimization.

## Validation

Six additional tests cover typo/part-number/Finnish search, quantity caps and unavailable items, integer-cent totals, request snapshots, invalid stored data and stored-price totals. Existing machine configurator tests remain intact. Browser checks cover search → product → cart → request → account/reorder, persistence after reload, language changes, and mobile layouts. The QA request uses an isolated local preview origin so the normal development preview’s customer data is unaffected.
