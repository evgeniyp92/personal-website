"use client";

import {
  PAIRINGS,
  useTypePair,
} from "@/app/_components/context/TypePairProvider";

// Keep the list extensible: adding a `{ id, label }` entry here is all that's
// needed to render another chip. The real swap (remapping --font-sans / etc.
// based on the active id) is a future CSS/layout concern.

export function FontPicker() {
  const { active, setActive } = useTypePair();

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
            aria-pressed={on ? "true" : "false"}
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
    </div>
  );
}
