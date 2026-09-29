# BMXTOOLS — Dev Notes

## Current state (as of last working session)

### Stack
- Static HTML/CSS/JS, hosted via GitHub Pages (presumably)
- Supabase for auth + user data (maps, training plans, favorites)
- Leaflet + OpenStreetMap tiles for all maps (migrated from static image + lat/lng math)
- No build step — plain files, CDN-loaded libraries

### Pages and what they do
- `index.html` — Map Creator. Click map → drop pin. Save to localStorage or Supabase. Uses Leaflet.
- `maps.html` — BMX Maps. Browse curated seed maps (40 states in `maps-data.js`) + user-saved maps. Read-only for seeds.
- `training.html` — Training plan builder. Wizard → sessions → drag workouts from library. Supabase-backed.
- `challenges.html` — Reaction Time + Memory Pairs games. localStorage for scores/leaderboard.
- `resources.html` — Curated links by category (Motivation, Nutritional, Exercises, Videos). Favorites saved to Supabase.
- `coaching.html` — Placeholder "Coming Soon" page.
- `login.html` / `signup.html` — Supabase email/password auth.

### Key technical decisions
- **Maps use Leaflet, not static images.** Pin positions are real lat/lng. Pins are draggable and can be placed by clicking the map.
- **`MAP_BOUNDS` and the old lat/lng→% math are gone** — Leaflet handles this natively.
- **`maps-data.js` holds the 40 seed state maps** (~200 tracks) as `BMXTools_SEED_MAPS`. Each pin has `{ lat, lng, title, kind: 'track', ... }`.
- **User maps are stored as JSON blobs** in the Supabase `maps` table (`pins` column). No schema change needed for pin structure changes.
- **Age groups**: classes are Novice / Intermediate / Expert / Boys Cruiser / Girls Cruiser. Novice, Intermediate, Expert all share the standard age list. Stored as `ageList` on each race pin (`'novice'`, `'intermediate'`, `'expert'`, `'boysCruiser'`, `'girlsCruiser'`). Legacy `'standard'` values are normalized to `'novice'`.
- **Header layout**: `.site-header` uses `flex-wrap: nowrap` on desktop, wraps on mobile. `#navAuth` is right-aligned with `margin-left: auto`.
- **Two-column layout**: `.board-layout` is CSS grid — `minmax(0, 1fr) 340px`, collapsing to one column at 1100px.

### Known issues / pending work
- 10 states missing from `maps-data.js`: Alabama, Arkansas, Connecticut, Delaware, Hawaii, Kentucky, Maine, New Hampshire, Rhode Island, West Virginia.
- Phone numbers / websites are missing from many track pins. Populating them by hand from USA BMX is slow.
- Duplicate sessions may appear in a training plan if "add missing" was clicked more than once — clean up in Supabase or rebuild the plan.
- Track-name lookup feature was attempted via a Supabase Edge Function proxying Nominatim. **Nominatim blocked the request (403) because the User-Agent wasn't acceptable, and the Edge Function was deleted.** Don't re-add without a proper proxy that sets a contact email in User-Agent.

### Files and their purposes
- `supabase-client.js` — creates the shared Supabase client, exposes `window.BMX.sb`.
- `auth.js` — auth helpers, `window.BMX.auth.*`, renders `#navAuth`, exposes `window.BMX.authReady`.
- `script.js` — everything for map pages (creator + maps). Leaflet init, pin CRUD, popups, save/load.
- `training.js` — training plan wizard, sessions, library, past plans.
- `challenges.js` — reaction time + memory games, leaderboard.
- `resources.js` — resource tabs, categories, favorites.
- `maps-data.js` — seed map data.
- `resources-data.js` — resource link data.

### Constants to know
- Map centers default to `[39.5, -98.35]` at zoom 4 (continental US).
- Zoom controls are Leaflet's default (top-left).
- Pin icon SVG is generated in `makePinIcon()`, colored by `PIN_COLORS`.
- Popups use `L.popup({ autoPan: true })` with the popup HTML as an inline `.pin-popup.pin-popup-inline` block inside Leaflet's popup wrapper.
