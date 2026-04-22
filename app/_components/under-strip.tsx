// Thin strip that sits directly under the hero on the landing page. Shows
// the tagline on the left and the font picker on the right, separated by a
// bottom rule. `flex-wrap` lets the two children stack on narrow viewports
// rather than overflowing.
import { FontPicker } from "./font-picker";

export function UnderStrip() {
  return (
    <div className="flex justify-between items-center gap-6 px-10 py-4 border-b border-rule flex-wrap">
      <div className="font-mono-editorial text-[0.72rem] tracking-[0.18em] uppercase text-mute">
        {"// Essays, notes, and experiments from a small studio"}
      </div>
      <FontPicker />
    </div>
  );
}
