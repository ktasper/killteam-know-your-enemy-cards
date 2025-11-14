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
- `weapons` (array of strings, optional): List of weapon descriptions
- `impactsYou` (array of strings, optional): How this kill team impacts you
- `impactsThem` (array of strings, optional): How this kill team impacts them

