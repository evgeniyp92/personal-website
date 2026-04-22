// A reusable "coming soon" page shell. Used by /work, /notes, and /colophon
// so they all share the same nav + dashed card layout without three near-
// identical page components. The dashed border card matches the prose demo
// — a shared visual grammar for "this exists but isn't finished".
import { Nav } from "./nav";

type Props = {
  // Which top-nav tab should be highlighted while this shell is rendered.
  // Typed as the exact set of labels so callers can't pass a typo.
  active: "Work" | "Notes" | "Colophon";
  title: string;
  body: string;
};

export function PlaceholderShell({ active, title, body }: Readonly<Props>) {
  return (
    <div className="flex-1">
      <header className="border-b border-rule">
        <Nav active={active} />
      </header>
      <div className="px-10 pt-24 pb-32 flex justify-center">
        <div className="max-w-[52ch] w-full p-10 border border-dashed border-rule rounded-lg">
          <div className="font-mono-editorial text-[0.72rem] tracking-[0.2em] uppercase text-gold mb-4">
            {"// Coming soon"}
          </div>
          <h1 className="font-sans text-[2rem] font-medium tracking-tight text-titanium leading-[1.15] mb-4">
            {title}
          </h1>
          <p className="text-[1.02rem] leading-[1.7] text-mute">{body}</p>
        </div>
      </div>
    </div>
  );
}
