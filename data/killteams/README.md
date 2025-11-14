# Kill Team Files

You can add kill team files here in two ways:

## Option 1: Single Kill Team per File

Create a file like `data/killteams/my-team.js`:

```javascript
window.KILLTEAM_DATA = {
  id: "my-team",
  name: "My Team Name",
  tagline: "Optional tagline",
  weapons: [
    "Weapon 1 description",
    "Weapon 2 description",
  ],
  impactsYou: [
    "Impact 1",
    "Impact 2",
  ],
  impactsThem: [
    "Impact 1",
    "Impact 2",
  ],
};
```

## Option 2: Multiple Kill Teams per File

Create a file like `data/killteams/multiple-teams.js`:

```javascript
window.KILLTEAM_DATA = [
  {
    id: "team-1",
    name: "Team 1",
    // ... kill team data
  },
  {
    id: "team-2",
    name: "Team 2",
    // ... kill team data
  },
];
```

## Adding New Kill Teams

1. Create your kill team file(s) in `data/killteams/` directory
2. Add the file path to `data/killteams-manifest.js`:
   ```javascript
   window.KILLTEAM_FILES = [
     'data/killteams/killteams.js',
     'data/killteams/my-new-team.js', // Add your new file here
   ];
   ```
3. That's it! No need to edit index.html or app.js

## File Structure

Each kill team object should have:
- `id` (string, unique): Used internally to identify the kill team
- `name` (string): Display name shown in the dropdown
- `tagline` (string, optional): Shown above the kill team name
- `weapons` (array of strings, optional) OR object of subcategories: List of weapon descriptions.
  - Legacy: an array of strings (each a bullet).
  - New (optional): an object where keys are subcategory titles and values are arrays of strings. Example:

```javascript
weapons: {
  "Individual Operatives": [
    "Operative-specific note 1",
    "Operative-specific note 2"
  ],
  "Faction Rules / Equipment / Ploys": [
    "Faction rule or equipment note",
  ]
}
```

- `impactsYou` (array of strings, optional) OR object of subcategories: How this kill team impacts you
- `impactsThem` (array of strings, optional) OR object of subcategories: How this kill team impacts them

- `updated` (string, optional): Date describing when this kill team data was last reviewed/updated. Recommended ISO format `YYYY-MM-DD` but free-form human-readable strings are accepted (e.g. `June 2025`).

Additional item format:
- Items in arrays (or subcategory arrays) may be either plain strings or objects when you need extra metadata:

```javascript
{ text: "Cant actually die", important: true }
```

When `important: true` is set the web UI will highlight the item on the rendered card and the text export will prefix the bullet with `!! ` to denote importance.

Notes:
- The frontend (`app.js`) accepts either arrays (legacy) or objects (new) for these fields. When an object is provided, each key becomes a subsection title in the rendered card and in exported text/PDF.

