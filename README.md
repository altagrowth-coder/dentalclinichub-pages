# dentalclinichub-pages

Static landing pages served at **go.dentalclinichub.com** via Vercel (auto-deploys on push to `main`).

## Structure

```
/index.html              → go.dentalclinichub.com          (AltaDent Free Revenue Leak Audit)
/assets/                 → shared logos & images
/{client-offer}/index.html → go.dentalclinichub.com/{client-offer}
```

Each client offer is a folder with its own `index.html`, e.g. `/marlow-implants/index.html` → `go.dentalclinichub.com/marlow-implants`.

## Placeholders

- `BOOKING_LINK` — zcal booking URL (both CTA buttons on the root page).
- ActiveCampaign form embed + site tracking snippet — marked spots in HTML comments.

Maintained by Viktor. Ask in Slack to add or edit a page.
