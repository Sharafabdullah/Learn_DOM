# Learn DOM (Interactive DOM Tutorial)

Interactive tutorial for learning HTML DOM manipulation with live CodeMirror editors, sandboxed iframe previews, and a D3 force‑directed visualization of the resulting DOM tree.

## Current Modular Structure

```
css/
  base.css          # Variables, resets, typography
  layout.css        # Layout, nav, grids
  theme.css         # Components, animations, styling
js/
  app.js            # Bootstrap + UI (nav toggle, smooth scroll, dark mode, section reveal)
  editors.js        # Editor lifecycle, preview iframe, DOM tree toggle, default code map, CONFIG
  dom-visualization.js # D3 graph creation & rendering
src/
  index.html        # Landing page
  tutorial.html     # Main interactive tutorial (loads modules)
dom_website.html    # (LEGACY) Original monolithic page – safe to delete after validation
styles.css          # (LEGACY) Original monolithic stylesheet – superseded by css/*.css
README.md
```

## Running

Just open `src/tutorial.html` (or `index.html` then click through) in a modern browser with internet access (CDN scripts for D3 & CodeMirror).

## Key Features

- Per‑editor Run button + DOM tree visibility toggle
- Sandboxed iframe execution (isolated environment)
- Live DOM graph (document / element / attribute / text nodes)
- Dark / light mode toggle
- Animated section reveal & active nav highlighting

## Default Code Management

All default example snippets are stored in a `Map` inside `editors.js` (merged from the previous separate default-code module to reduce JS file count).

## Refactor Notes

- Legacy `dom_website.html` retained temporarily for comparison.
- Once parity is confirmed, delete: `dom_website.html` and `styles.css`.

## Next Possible Enhancements

1. Port remaining legacy sections (Animations, Events, etc.) if still desired.
2. Add accessibility improvements (ARIA landmarks for nav/sections).
3. Add persistence (localStorage) for edited code per editor id.
4. Optional: Build script to inline assets for offline use.

## Dependencies (via CDN)

- D3.js v7
- CodeMirror 5.x (htmlmixed mode + dependencies)
- Font Awesome (icons)

## License

Educational / instructional use.
