# Kill Team — Know Your Enemy Cards

A small static web tool to create printable "tactical" cards for Warhammer Kill Team kill teams. The app reads simple JS data files and renders short summary cards (Weapons, Impacts You, Impacts Them) which can be exported as text or PDF.

**Quick Start**

- Open `index.html` in a browser to view the app.


**How the app works (big picture)**

- `index.html` loads `killteam-loader.js`, which pulls the files listed in `data/killteams-manifest.js` and sets `window.KILLTEAM_DATA`.
- `app.js` reads `window.KILLTEAM_DATA`, populates the dropdown, and renders a preview card into the page. You can export the card as plain text or PDF.

**Key files**

- `app.js` — main rendering & export logic. Look here to change how cards are displayed or exported.
- `index.html` — app shell and where export libraries (jsPDF/html2canvas) are referenced.
- `data/killteams-manifest.js` — list of kill team data files loaded into the app.
- `data/killteams/*.js` — kill team data files. Each file must set `window.KILLTEAM_DATA` (object or array).

**Data format**

Each kill team object supports the following fields (discoverable by reading `data/killteams/README.md`):

- `id` (string, unique)
- `name` (string)
- `tagline` (string, optional)
- `weapons`, `impactsYou`, `impactsThem` — each field may be one of:
  - An array of strings (legacy/simple format). Example:

```javascript
impactsYou: [
  "Hard to engage this team",
  "Slow but resilient"
]
```

  - Or an object mapping human-readable subsection titles to arrays of strings (new optional subcategory format). Example:

```javascript
weapons: {
  "Individual Operatives": [
    'Blast 2" on sniper',
    'Sniper perma silent'
  ],
  "Faction Rules / Equipment / Ploys": [
    "Consectetur elit...",
  ]
}
```

The frontend (`app.js`) accepts either form. When an object is used, each key becomes a subsection title in the rendered card and in exported text/PDF.

**Adding a new kill team**

1. Create a new file `data/killteams/<your-team>.js` and set `window.KILLTEAM_DATA` to an object or array as described above.
2. Add the new file path to `data/killteams-manifest.js` so it will be loaded by the site.

**Development notes & conventions**

- The project is intentionally minimal and uses plain JavaScript (no build step). Edit `app.js` for UI/behavior changes and `styles.css` for visual tweaks.
- Exports: text export produces a readable, indented plain-text format; PDF export uses html2canvas + jsPDF and currently creates one page per section/subcategory to keep layouts clean.