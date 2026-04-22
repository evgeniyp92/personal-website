// Top nav. Appears on every page — on the landing page it lives inside the
// hero photo (so the gradient bleeds behind it); on other pages it sits in a
// normal <header> with a rule border beneath. The `active` prop is how the
// caller tells us which tab should receive the gold underline.
import Link from "next/link";

type Tab = { label: string; href: string };

// The four top-level destinations. Journal lives at `/` because it's the
// front door — Work/Notes/Colophon are placeholder shells for now.
const TABS: Tab[] = [
  { label: "Journal", href: "/" },
  { label: "Work", href: "/work" },
  { label: "Notes", href: "/notes" },
  { label: "Colophon", href: "/colophon" },
];

export function Nav({ active }: Readonly<{ active: Readonly<Tab["label"]> }>) {
  return (
    <div className="flex justify-between items-center px-10 py-6">
      {/* Wordmark doubles as a home link. The wide tracking + uppercase is
          the editorial masthead voice; we don't use Geist's default here. */}
      <Link
        href="/"
        className="text-[0.78rem] tracking-[0.3em] uppercase font-medium text-titanium"
      >
        Evgeniy Pimenov
      </Link>
      <div className="flex gap-9 text-[0.85rem]">
        {TABS.map((tab) => {
          const isActive = tab.label === active;
          return (
            <Link
              key={tab.label}
              href={tab.href}
              className={`tracking-wide transition-colors ${
                isActive
                  ? "text-titanium"
                  : "text-titanium/70 hover:text-titanium"
              }`}
            >
              {/* Wrapping the label in a relative <span> lets the gold
                  underline absolute-position itself under exactly the
                  label's width, no matter how wide the link hit area is. */}
              <span className="relative inline-block">
                {tab.label}
                {isActive && (
                  <span className="absolute left-0 right-0 -bottom-1.5 h-px bg-gold" />
                )}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
