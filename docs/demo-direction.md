# Demo direction

## Selected homepage

**Forest** (`/en`): real Finnish woodland fills the first screen. The machine stays in context. The message leads with compact capability and the connection to the forest.

The forest homepage is the selected direction. Use Logbullet's current company logo and original orange/charcoal color theme. There is one homepage experience in both languages.

The slogan is “Small footprint. Big productivity.” Keep the interface direct: no decorative eyebrow slogans, coordinates, arbitrary numbering or ornaments. Use clear headings, useful information and actions.

Use readable 18px body copy and at least 16px controls, with smoky translucent glass behind navigation on the forest image. Machine cards share three statistics: payload, width and engine power. Megamax displays 48.6–55.4 kW in both languages, with localized decimal separators.

Useful research questions:

- Can a first-time visitor explain the difference between the three machines after one minute?
- Does the forest image communicate the size of the machine clearly enough?
- Do visitors prefer to start with machine comparison or go straight into configuration?
- Does the 3D camera focus make an equipment choice easier to understand?
- Are price-on-request options clear enough without breaking the flow?
- Does an order request followed by off-site payment match the way customers want to buy?

## The ordering journey

1. Choose the machine. Compare published starting prices and what comes as standard.
2. Choose equipment. Show the relevant area, maintain compatibility and update the estimate.
3. Review the configuration and provide contact/delivery-country information. Submit a request on the site. Payment is arranged separately after configuration and delivery are confirmed.

The demo uses a local saved request. It deliberately does not claim that an email has been sent or an order accepted. The receipt can be downloaded or cleared. Guest ordering keeps the initial journey simple.

Keep demo labels and disclaimers out of the customer-facing experience, including the order confirmation and downloaded request. Use a plain `LB-…` reference and neutral saved-request wording.

## Production work after the demo

- Confirm a single product catalog with current availability, specifications, base equipment, optional equipment, dependencies, prices and delivery terms. In particular, resolve the original-model delivery pause announced in July 2026 and the conflicting Megamax engine specifications; see [content notes](content-notes.md).
- Replace the procedural scene with optimized, approved GLB assets for all three machines. Include named parts, attachment locations, camera targets, materials and levels of detail. Keep the photo fallback and reduced-motion support.
- Add durable server-side order storage, catalog-based price validation, idempotent submissions and a staff review workflow. Connect a confirmed order destination only after it is chosen.
- Define the off-site payment handoff and distinguish request received, confirmed, awaiting payment and paid states. The site should never infer payment from a redirect alone.
- Agree which additional languages to launch. The old site includes Swedish, German, Estonian and French, but this demo starts with complete English and Finnish dictionaries.
- Have native speakers and the manufacturer review translations and technical language.
- Add the actual privacy notice, sales terms, warranty/support content and an accessible contact workflow before enabling live submissions.

The existing Bun/shadcn/Next.js repository remains the deployment unit. The demo needs no CMS, commerce service, account, API key or payment integration to run on Vercel.
