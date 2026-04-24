# Font-switcher implementation plan

## Context

The site has scaffolded two font-picker UIs — a desktop "chip" group in `UnderStrip` (landing page only) and a mobile list inside the hamburger menu — but they do not actually switch fonts yet, and they do not share state with each other. Today:

- `app/_components/font-picker.tsx` owns a private `useState` and mirrors it to `<html data-type-pair>`. Rendered once, on the landing page, inside `UnderStrip`.
- `app/_components/nav.tsx` (lines 144–162) renders its own mobile-only pairing buttons that import `PAIRINGS`. Two bugs: the "active" comparison uses the nav's tab-label prop (`p.id === active`) instead of the current pairing id, and the click handler is `() => {}`.
- `app/layout.tsx` hard-codes `data-type-pair="geist-instrumentserif"` on `<html>` and loads all four Google fonts there (Geist, Geist Mono, Instrument Serif, IBM Plex Mono).
- `PAIRINGS` in `font-picker.tsx` has exactly one entry. No persistence, and no CSS that re-maps font variables per pairing.

A subtler issue, discovered during planning: the current `globals.css` uses `@theme inline`, which **resolves the mapping at build time**. A post-build inspection of `.next/static/chunks/02dnvvs7_w47o.css` shows utilities compile to `.font-sans{font-family:var(--font-geist-sans)}` — so overriding `--font-sans` at runtime under `html[data-type-pair=…]` would do nothing. The switcher would *look* like it works (attribute flips, chip highlights update) while fonts silently stay the same. This has to be restructured as part of the fix. There is also a latent name collision on `--font-serif` — `next/font/google`'s Instrument Serif injects it and Tailwind's `@theme` key uses it; today the mapping accidentally becomes `--font-serif: var(--font-serif)` (self-referential) and only works because the next/font variable is declared on `<html>` via className.

The goal of this plan is to turn the scaffold into a real, working switcher: a single source of truth shared by both pickers, persistence across visits without a flash of default fonts on reload, and CSS plumbing where adding a pairing is a purely declarative change (load fonts → add `PAIRINGS` entry → add one CSS block).

Non-goals:
- This plan does not decide *which* second font pairing to ship. The scaffold's comment ("a second option will be introduced when there's something worth comparing against") is a design decision the user holds. The mechanism ships first; a concrete second pairing is a follow-up.
- Desktop reach is unchanged: `FontPicker` stays in `UnderStrip` (landing-page only). On desktop, the switcher is only reachable from `/`. Mobile already has it site-wide via the hamburger nav. Lifting the desktop chips into the nav is explicitly deferred until the feature has real stakes (i.e., a second pairing exists).

## Design

### How it works end-to-end

1. **Source of truth**: a `TypePairProvider` (new client component) holds `activePair: string` in React state. Both the desktop `FontPicker` and the mobile nav call the same `useTypePair()` hook to read and update it.
2. **DOM side-effect**: whenever `activePair` changes, the provider writes it to `document.documentElement.dataset.typePair`. CSS in `globals.css` keys off `html[data-type-pair="…"]` to remap font CSS variables for non-default pairings.
3. **Persistence**: on change, the provider writes to `localStorage["type-pair"]`. On first client render, the provider reads from localStorage and syncs React state.
4. **No FOUC on reload**: a small synchronous inline `<script>` in `<head>` runs before hydration, reads `localStorage["type-pair"]`, and sets `document.documentElement.dataset.typePair`. `<html>` gets `suppressHydrationWarning` because the script legitimately mutates the attribute the server rendered. `next/script strategy="beforeInteractive"` is **not** used — per Next 16 docs, it explicitly does not block hydration, so it can't prevent FOUC.
5. **Fonts still load via `next/font/google`** in `layout.tsx`. Every pairing's fonts are loaded at build time; the switch is purely CSS variable remapping — instant and layout-shift-free.

### CSS restructure (the load-bearing part)

**Problem** confirmed by build inspection: `@theme inline` inlines values, so `.font-sans` compiles to `var(--font-geist-sans)`, not `var(--font-sans)`.

**Fix**: split the current `@theme inline` block. Colors stay `inline` (they correctly reference runtime-reactive `--ch-*` variables). Fonts move into a regular `@theme` block, which makes Tailwind compile `.font-sans { font-family: var(--font-sans); }` — then overriding `--font-sans` on `html[data-type-pair=…]` cascades through every utility. While we're here, rename the `next/font/google` variables so Tailwind theme keys (`--font-serif`, `--font-mono-editorial`) no longer collide with source-font variables:

```tsx
// app/layout.tsx — rename variable: keys
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",   // was "--font-serif"
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});
const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",          // was "--font-mono-editorial"
  subsets: ["latin"],
  weight: ["400", "500"],
});
```

```css
/* app/globals.css — split @theme blocks */

@theme inline {
  /* Colors stay inline — utilities like .bg-eigengrau compile to
     var(--ch-eigengrau), which is runtime-reactive via :root overrides. */
  --color-eigengrau: var(--ch-eigengrau);
  --color-titanium: var(--ch-titanium);
  --color-mute: var(--ch-mute);
  --color-rule: var(--ch-rule);
  --color-gold: var(--ch-gold);
}

@theme {
  /* Fonts are NOT inline, so utilities like .font-sans compile to
     var(--font-sans) — which we can override per pairing below. */
  --font-sans: var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif;
  --font-mono: var(--font-geist-mono), ui-monospace, SFMono-Regular, monospace;
  --font-serif: var(--font-instrument-serif), Didot, "Bodoni 72", serif;
  --font-mono-editorial: var(--font-plex-mono), ui-monospace, monospace;
}

/* Per-pairing overrides. The default pairing "geist-instrumentserif" matches
   the @theme defaults and needs no block. To add a pairing:
     1. load its fonts in layout.tsx (next/font/google)
     2. add a PAIRINGS entry in font-picker.tsx
     3. add one block here.
   Example (commented out until a real alternate exists):
   html[data-type-pair="ibmplex-cormorant"] {
     --font-sans: var(--font-ibm-plex-sans), ui-sans-serif, sans-serif;
     --font-serif: var(--font-cormorant), Didot, serif;
   }
*/
```

Also update `globals.css`:50 (body font fallback) — the `body { font-family: var(--font-geist-sans), … }` line should switch to `var(--font-sans)` so the body itself reacts to pairing changes, not just utility-classed children.

And `globals.css`:88 (drop cap) — `font-family: var(--font-serif), Didot, …` already works since `--font-serif` is now the theme variable we're remapping.

### State shape and sharing

A thin Context provider. This is two consumers and one string — a library is overkill.

```tsx
// app/_components/type-pair-provider.tsx  (new, "use client")
const TypePairContext = createContext<{
  active: string;
  setActive: (id: string) => void;
} | null>(null);

export function TypePairProvider({
  children,
  defaultPair,
}: {
  children: ReactNode;
  defaultPair: string;
}) {
  const [active, setActiveState] = useState(defaultPair);

  // On mount, sync React state with whatever the <head> script already wrote
  // to the DOM. The DOM is ahead of React here — correct, and by design.
  useEffect(() => {
    const stored = typeof window !== "undefined"
      ? window.localStorage.getItem("type-pair")
      : null;
    if (stored && stored !== active) setActiveState(stored);
  }, []);

  const setActive = useCallback((id: string) => {
    setActiveState(id);
    document.documentElement.dataset.typePair = id;
    try { localStorage.setItem("type-pair", id); } catch {}
  }, []);

  return (
    <TypePairContext.Provider value={{ active, setActive }}>
      {children}
    </TypePairContext.Provider>
  );
}

export function useTypePair() {
  const ctx = useContext(TypePairContext);
  if (!ctx) throw new Error("useTypePair must be used within TypePairProvider");
  return ctx;
}
```

### Pre-hydration FOUC script

In `app/layout.tsx`, render a `<head>` inside `<html>`, and place a plain inline `<script>` using React's normal "inject raw HTML" prop. The content is a static build-time string — no user data, no XSS surface. (During this planning session a security linter flagged the prop name; the implementer can ignore it here, or silence with `// biome-ignore lint/security/noDangerouslySetInnerHtml`. Do not use string-concat obfuscation tricks — they survive past the lint warning and confuse future readers.)

Script body (compact on purpose, runs before hydration):

```
try {
  var p = localStorage.getItem('type-pair');
  if (p) document.documentElement.dataset.typePair = p;
} catch (e) {}
```

Add `suppressHydrationWarning` to the `<html>` element so React doesn't complain about the attribute divergence.

### Fixes to existing components

1. **`font-picker.tsx`**: replace the local `useState`/`useEffect` with `useTypePair()`. Keep markup. Add `aria-pressed={on}` on each chip.
2. **`nav.tsx`**:
   - Read font-pair state via `useTypePair()`, not the nav's `active` prop.
   - Rename the inner variable `on`/`active` used in the font-button map so it doesn't collide with the nav's `active` tab prop — that name collision is the root cause of the `p.id === active` bug.
   - Wire the empty `onClick={() => {}}` (line 152) to `setActive(p.id)`.
   - Add `aria-pressed`.
3. **Keep `PAIRINGS` as the single registry** exported from `font-picker.tsx` — both call sites already import from there.

### Why a Context rather than a DOM-observer hook

A `useSyncExternalStore` around a `MutationObserver` on `<html>` would also work and wouldn't need a provider. I'm not recommending it: Context is idiomatic React, easier for any future contributor to reason about, and the write-side still needs a persistence side-effect, so we'd end up with a custom setter anyway. One small provider file is the smaller change.

## Files to change

| File | Change |
|---|---|
| `app/_components/type-pair-provider.tsx` | **New.** Client component exporting `TypePairProvider` and `useTypePair`. |
| `app/layout.tsx` | Rename `Instrument_Serif` variable to `--font-instrument-serif` and `IBM_Plex_Mono` variable to `--font-plex-mono` (update the className on `<html>` accordingly). Wrap `{children}` with `TypePairProvider`. Render `<head>` with the inline FOUC script. Add `suppressHydrationWarning` to `<html>`. |
| `app/globals.css` | Split `@theme inline` into two blocks (colors `inline`, fonts plain). Include full font stacks with fallbacks. Update `body` selector (:50) to use `var(--font-sans)`. Add a commented template for per-pairing override blocks. |
| `app/_components/font-picker.tsx` | Replace local state with `useTypePair()`. Add `aria-pressed`. Keep `PAIRINGS` export. |
| `app/_components/nav.tsx` | Fix mobile font-button `on` calc and `onClick` via `useTypePair()`. Rename inner variable to avoid nav's `active` prop collision. Add `aria-pressed`. |

### Optional / follow-up (not required for the mechanism to ship)

- Extract a shared `FontPairChip` component if the two call sites diverge further. For now, two small inline renders are fine.
- Add a second concrete pairing. Design decision, not a mechanical step. Once picked: load fonts in `layout.tsx`, add a `PAIRINGS` entry, add the one CSS override block.

## Verification

1. **Type-check and lint**: `bun run lint` (biome) and `bun run build` (Next build = full TS check).
2. **CSS compile check** (the one that proves the restructure worked): after `bun run build`, grep the output CSS:
   ```bash
   grep -oE "\.font-sans\s*\{[^}]*\}" .next/static/chunks/*.css
   ```
   Expected: `.font-sans{font-family:var(--font-sans)…}`. If it's still `var(--font-geist-sans)`, the `@theme` split didn't take effect — fix before shipping.
3. **Dev run**: `bun run dev` → open `/` in the browser.
   - Desktop: `UnderStrip` chip group renders and is interactive. With one pairing it still has one chip — click it, confirm no console errors and `<html>` retains `data-type-pair="geist-instrumentserif"`.
   - Mobile (<768px or DevTools device mode): open the hamburger, "Font pairs" list shows each `PAIRINGS` entry with the correct button highlighted; clicking one updates the highlight immediately (previously a no-op).
   - Once a second pairing exists: toggle in one picker, the other reflects the change; visibly different fonts render.
4. **FOUC test** (once a second pairing exists): select the non-default pairing, hard-reload. The page paints in the selected fonts on the first frame — no flash of Geist/Instrument.
5. **Private-mode / storage-denied test**: reload in a browser profile with localStorage disabled. Falls back to default pairing without throwing (both the inline script and the `setItem` call are wrapped in try/catch).
6. **Hydration**: DevTools console on hard reload — no "hydration mismatch" warnings for `<html>` (the `suppressHydrationWarning` handles the data-attribute divergence).
7. **Keyboard / a11y**: Tab to a chip, press Enter/Space — toggles. Screen reader announces pressed state via `aria-pressed`.
