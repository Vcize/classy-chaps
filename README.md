# Classy Chaps Summit Club

A cinematic expedition microsite for the Kings Canyon / Sequoia 40th-birthday hiking trip
(June 18–21, 2026). Built with React + Vite from the Claude Design handoff bundle in
`design/classy-chaps-40th-hiking-trip/`.

## Run it

```bash
npm install
npm run dev      # dev server at http://localhost:5173
npm run build    # production build → dist/
npm run preview  # serve the production build locally
```

## Deploy

The build output in `dist/` is fully static — drop it on Vercel, Netlify, or any static
host. Both platforms auto-detect Vite: just point them at this folder (build command
`npm run build`, output directory `dist`).

## Editing trip content

Everything — names, flights, lodging, trails, packing list, quotes — lives in
[`src/data.js`](src/data.js). Swap flight times, add the missing chaps' flights, or edit
quotes there; no component changes needed.

**Photos:** drop images into `public/assets/photos/` and point to them from the `photos:`
block (and each trail's `photo:` field) in `src/data.js`. Any slot set to `null` shows a
labeled "add photo" placeholder. Still open: a full-crew group shot (`photos.crewGroup`).

## Structure

| File | What's in it |
|---|---|
| `src/data.js` | All trip content (the only file you should need to edit) |
| `src/ui.jsx` | Shared kit: Reveal, SectionHead, Photo, topo texture, motion engine (parallax, count-up, scroll progress) |
| `src/icons.jsx` | Lucide icon registry (string-name API, tree-shaken) |
| `src/sections-a.jsx` | Nav, parallax Hero + countdown, Mission, Crew patches |
| `src/sections-b.jsx` | Flight Board, Base Camp, Itinerary timeline |
| `src/sections-c.jsx` | Trail Intel (route traces, elevation charts), Expedition Stats |
| `src/sections-d.jsx` | Packing checklist (persists to localStorage), Food, Safety, campfire Quote Wall, Footer |
| `src/extras.jsx` | Floating expedition progress tracker, Achievement badges |
| `src/styles/` | `tokens.css` (design-system tokens) + `app.css` (expedition skin & motion) |

All motion respects `prefers-reduced-motion`.
