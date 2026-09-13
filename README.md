# BTI — Between The Irons — Website

This is your site's code, split into normal files so you can edit it in VS Code.

## Structure

```
bti-site/
├── index.html        ← page content/structure (all sections: hero, about, services, how-it-works, process, contact)
├── css/
│   └── style.css     ← all styling (colors, spacing, layout, fonts)
├── images/
│   └── image-1.jpg … ← photos used across the site (extracted from the original file)
└── js/                ← empty for now — add a script.js here later if you want interactivity (accordions, animations, etc.)
```

The original file had everything (HTML, CSS, and images) crammed into one giant file. It now works exactly the same, just split into pieces that are much easier to find and edit.

## How to open and preview it

1. Open the `bti-site` folder in VS Code (File → Open Folder).
2. Install the **Live Server** extension (search "Live Server" in the Extensions panel — it's free, by Ritwick Dey).
3. Right-click `index.html` → **Open with Live Server**. It'll open in your browser and auto-refresh whenever you save a change.

## Where to make common edits

- **Text content** (headlines, pricing, descriptions): edit `index.html` directly — search for the text you want to change.
- **Colors, spacing, fonts**: edit `css/style.css`. The color variables are near the top:
  ```css
  :root{--red:#df202b;--bg:#050607;--panel:#0d1013;--line:#282d33;--text:#f4f4f1;--muted:#a5abb1}
  ```
  Change `--red` to shift the whole site's accent color, for example.
- **Photos**: swap files in `images/` (keep the same filename, or update the `src="images/..."` path in `index.html`).

## Sections in index.html (search for these `id`s)

- `id="home"` — hero section
- `id="about"` — "I've seen the game from both sides"
- `id="services"` — pricing/services cards
- `id="how-it-works"` — step-by-step process per service
- `id="process"` — Review → Analyze → Deliver → Improve
- `id="contact"` — final CTA / contact section

## Next steps (from our earlier conversation)

- Fix the spacing/gutters in the three-column "playing/teaching/analyzing" section
- Move to a circles-and-line style for the per-service step process (matches the Process section already)
- Consider splitting Services into its own page per service once ready
