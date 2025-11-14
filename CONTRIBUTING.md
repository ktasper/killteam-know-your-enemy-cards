
# Contributing (short)

Thanks — this repo is intentionally small and uses plain JS/CSS/HTML. Keep contributions focused and easy to review.

Key points
- Small PRs: one change per PR (feature/bugfix/docs).
- No build step: test locally with a static server (see Quick Start in `README.md`).

Formatting
- The project enforces single quotes for strings. Run `npm run format` or rely on the pre-commit hook to apply formatting.

Setup formatting hooks (one-time)

1. Install dev dependencies locally:

```powershell
npm ci
```

2. The `prepare` script runs automatically and installs Husky hooks. If you need to reinstall hooks manually, run:

```powershell
npx husky install
```

3. Format files locally:

```powershell
npm run format        # auto-format files
npm run format:check  # check formatting (CI uses this)
```

Marking important items

- When you want the item to stand out on the card, use the item object format in data files:

```js
{ text: 'Sniper perma silent', important: true }
```

Data files
- Add kill team files to `data/killteams/` and list them in `data/killteams-manifest.js`.
- Each file must set `window.KILLTEAM_DATA` (object or array). See `data/killteams/README.md` for schema.

PR checklist
- [ ] Tested locally (start a static server and verify preview + exports)
- [ ] Updated `data/killteams-manifest.js` (if adding files)
- [ ] Documented schema changes in `data/killteams/README.md` (if applicable)

If you prefer not to install dev deps, it's fine — CI will still run the format check on PRs.
