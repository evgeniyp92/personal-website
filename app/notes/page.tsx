// /notes — placeholder for the short-form marginalia that'll eventually live
// separately from the Journal. Shares PlaceholderShell with /work and
// /colophon.
import { PlaceholderShell } from "../_components/placeholder-shell";

export const metadata = {
  title: "Notes — Evgeniy Pimenov",
};

export default function Notes() {
  return (
    <PlaceholderShell
      active="Notes"
      title="Marginalia, unfinished thoughts"
      body="Shorter than an essay, longer than a tweet, and more half-baked than either. A place to put the things I'm still deciding whether I believe. Opening soon."
    />
  );
}
