// Font picker chip group shown in the under-strip. It's scaffolded to be
// real (client state, writes to <html data-type-pair>, a live button) but
// currently only offers one pairing — the design direction is deliberate,
// and a second option will be introduced when there's something worth
// comparing against.
"use client";

import { useEffect, useState } from "react";

type Pairing = {
  id: string;
  label: string;
};

// Keep the list extensible: adding a `{ id, label }` entry here is all that's
// needed to render another chip. The real swap (remapping --font-sans / etc.
// based on the active id) is a future CSS/layout concern.
export const PAIRINGS: Pairing[] = [
  {
    id: "geist-instrumentserif",
    label: "Geist · Instrument Serif",
  },
];

export function FontPicker() {
  const [active, setActive] = useState<string>(PAIRINGS[0].id);

  // Mirror the selected pairing onto <html data-type-pair>. CSS selectors
  // elsewhere can key off this attribute to swap font stacks without this
  // component having to know the rendering details.
  useEffect(() => {
    document.documentElement.dataset.typePair = active;
  }, [active]);

  return (
    <div className="hidden md:flex items-center gap-2.5 flex-wrap">
      <span className="font-mono-editorial text-[0.68rem] tracking-[0.18em] uppercase text-mute mr-1">
        Type
      </span>
      {PAIRINGS.map((p) => {
        const on = p.id === active;
        return (
          <button
            key={p.id}
            type="button"
            onClick={() => setActive(p.id)}
            className={`text-[0.76rem] px-2.5 py-1 border rounded-full transition-colors ${
              on
                ? "border-titanium text-titanium"
                : "border-rule text-mute hover:text-titanium hover:border-titanium/60"
            }`}
          >
            {p.label}
          </button>
        );
      })}
      {/* Static "designer's choice" chip — a visual note that the one visible
          option is intentional rather than a missing implementation. */}
      <span className="text-[0.76rem] italic px-2.5 py-1 border border-gold rounded-full text-gold">
        ★ Designer's Choice
      </span>
    </div>
  );
}
