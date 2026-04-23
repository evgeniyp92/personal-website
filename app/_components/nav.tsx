"use client";
// Top nav. Appears on every page — on the landing page it lives inside the
// hero photo (so the gradient bleeds behind it); on other pages it sits in a
// normal <header> with a rule border beneath. The `active` prop is how the
// caller tells us which tab should receive the gold underline.
import Link from "next/link";
import { useState } from "react";
import { PAIRINGS } from "@/app/_components/font-picker";

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
  const [hamburgerOpen, setHamburgerOpen] = useState(false);
  return (
    <div className="flex justify-between items-center px-10 py-6 relative">
      {/* Wordmark doubles as a home link. The wide tracking + uppercase is
          the editorial masthead voice; we don't use Geist's default here. */}
      <Link
        href="/"
        className="text-xs tracking-[0.3rem] uppercase font-medium text-titanium"
      >
        Evgeniy Pimenov
      </Link>
      {/* DESKTOP NAV */}
      <nav className="hidden md:flex gap-9 text-[0.85rem]">
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
      </nav>
      {/* MOBILE NAV */}
      <button
        type="button"
        className="md:hidden hover:cursor-pointer"
        onClick={() => setHamburgerOpen(!hamburgerOpen)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6"
        >
          <title>Menu</title>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
          />
        </svg>
      </button>
      <nav
        className={`fixed inset-x-0 bg-eigengrau top-0 z-50 md:hidden 
        overflow-hidden transition-[height] duration-300 ease-out
        ${hamburgerOpen ? "h-screen" : "h-0"}
        `}
        aria-hidden={!hamburgerOpen}
      >
        {hamburgerOpen && (
          <div className="p-12 h-full w-full flex flex-col">
            <button
              type="button"
              onClick={() => setHamburgerOpen(false)}
              className="hover:cursor-pointer w-fit self-end"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <title>Close Menu</title>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            </button>
            <div className="flex flex-col uppercase gap-y-4 py-12 text-2xl">
              {TABS.map((tab, i) => {
                const isActive = tab.label === active;
                return (
                  <Link
                    key={tab.label}
                    href={tab.href}
                    style={{ animationDelay: `${200 + i * 60}ms` }}
                    className={`opacity-0 animate-[fade-in-side_350ms_ease-out_forwards]
                    tracking-wide transition-colors ${
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
            <div className="flex flex-col uppercase py-12 gap-y-4">
              <p className="text-2xl">Font pairs</p>
              {PAIRINGS.map((p) => {
                const on = p.id === active;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {}}
                    className={`px-2.5 py-1 border rounded-full transition-colors ${
                      on
                        ? "border-titanium text-titanium"
                        : "border-rule text-mute hover:text-titanium hover:border-titanium/60"
                    }`}
                  >
                    {p.label}
                  </button>
                );
              })}
              <span className="text-md italic px-2.5 py-1 border border-gold rounded-full text-gold text-center">
                ★ Designer's Choice
              </span>
            </div>
          </div>
        )}
      </nav>
    </div>
  );
}
