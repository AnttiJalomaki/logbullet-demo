# Content notes

Retrieved from Logbullet.com on 7 September 2026. This repository keeps source URLs and original media in `lib/content/media-manifest.json`.

The header and footer reuse the current site's [company logo](https://www.logbullet.com/wp-content/uploads/2015/06/cropped-Logbullet_Logo_1240.jpg) without redrawing it. The browser icon reuses the site's [192 px icon](https://www.logbullet.com/wp-content/uploads/2015/09/cropped-Logbullet_1000_1000-192x192.png), stored as `app/icon.png`.

| Item                        | Demo value            | Source / qualification                                                                                       |
| --------------------------- | --------------------- | ------------------------------------------------------------------------------------------------------------ |
| Brand orange                | `#f17b3f`             | Existing website’s inline theme CSS                                                                          |
| Brand charcoal              | `#2b2b2b`             | Existing website’s inline theme CSS                                                                          |
| Logbullet base price        | €34,900, VAT excluded | https://www.logbullet.com/accessories/                                                                       |
| Superbullet base price      | €54,000, VAT excluded | https://www.logbullet.com/superbullet/                                                                       |
| Megamax forwarder           | €78,000, VAT excluded | English and Finnish Megamax pages; indicative                                                                |
| Megamax combi               | €98,000, VAT excluded | English and Finnish Megamax pages; head to be confirmed                                                      |
| Megamax harvester           | €96,000, VAT excluded | English Megamax page only; confirmation needed                                                               |
| Megamax engine power        | 48.6–55.4 kW          | English: Kubota V2403, 48.6 kW. Finnish: Deutz TCD 2.2, 55.4 kW; displayed as a range at the owner's request |
| Megamax crane reach         | Unconfirmed           | No confirmed outreach was found in the reviewed specifications                                               |
| Logbullet width             | 1.58 m                | Technical-features page; other source copy rounds to 1.5 or 1.6 m                                            |
| Original 4.2 m crane        | +€648                 | Requires upgraded manual (+€450) or electric (+€1,695) controls                                              |
| Electric controls           | +€1,695               | Includes two hydraulic outputs; separate output is removed to avoid double billing                           |
| Superbullet crane choices   | Price on request      | Farma 4.2 / Palms 2.42 listed; option pricing not published                                                  |
| Superbullet AC and lighting | Price on request      | Pictured/described on source pages; inclusion, availability and price must be confirmed                      |
| Delivery                    | Confirmed separately  | Source prices exclude transportation from Finland                                                            |

The demo uses one consistent catalog across languages. Translations do not independently select conflicting source specifications. Machine dimensions, capacities, weights and starting prices remain indicative.

## Original-model availability

On 6 July 2026, Logbullet published an [announcement that original-model deliveries were being stopped](https://www.youtube.com/watch?v=Cuz5zW8q9uU). Its description attributes this to a disagreement over machinery requirements. This is the manufacturer's account, not a legal assessment. The older website still publishes the original model and its prices.

The requested three-model concept is preserved, with no availability or demo notices in the customer-facing interface or saved receipt. The original's €34,900 starting price is a previously published reference. Confirm this model's status directly before enabling live order requests. This finding does not establish the availability of Superbullet or Megamax.

## Media and visualization

The homepage uses `public/media/logbullet-hero.mp4`, a silent 54-second derivative of `logbullet-demo-montage.mp4` (1280 × 720, 25 fps, H.264, 4.8 MB). It retains the requested cuts from YouTube videos `xafrUxlwOGc` (00:00–00:13, 01:30–01:35, 01:58–02:20) and `PMIGr72UnxA` (00:16–00:30). The full montage remains available separately.

The current photo loads first and stays for at least three seconds. Video loading begins after the photo loads; the small clip downloads completely before playback to avoid interruptions on slow connections, then crossfades over 900 ms after a decoded frame. The hero loops silently, pauses offscreen or in a hidden tab, offers a pause control, and returns to the photo if playback fails. Autoplay, the crossfade, and the pause control remain available with reduced motion enabled.

To regenerate the background copy from the montage:

```sh
ffmpeg -i public/media/logbullet-demo-montage.mp4 -map 0:v:0 -an \
  -vf 'fps=25,scale=1280:720:flags=lanczos,setsar=1' \
  -c:v libx264 -preset slow -crf 25 -maxrate 700k -bufsize 1400k \
  -profile:v high -level:v 3.1 -pix_fmt yuv420p -g 50 -keyint_min 50 \
  -sc_threshold 0 -x264-params 'nal-hrd=vbr:force-cfr=1:ref=3:bframes=2' \
  -color_range tv -colorspace bt709 -color_primaries bt709 -color_trc bt709 \
  -movflags +faststart -map_metadata -1 public/media/logbullet-hero.mp4
```

Photos and source footage are authentic. New page copy is rewritten in English and Finnish. The original media page permits photography in Logbullet-related stories: https://www.logbullet.com/media/. Full source files remain available in the archive, including earlier orange machines and newer charcoal machines.

Sources reviewed include the homepage, both Megamax pages, both Superbullet pages, the Finnish Original HD page, accessories, media, videos, story, company, and the four English Logbullet feature pages. The manifest is a snapshot of these pages, not a crawl of every translated page or future website update.

The Three.js scene is an illustrative model. Its proportions, crane geometry, cabin frame and accessory placement must not be treated as an engineering representation. An approved CAD-to-GLB asset for each machine is needed before replacing the real-photo default.
