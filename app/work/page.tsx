// /work — placeholder until a real gallery of projects is assembled. Uses
// the shared PlaceholderShell so all three "coming soon" pages move in
// lockstep when the shell evolves.
import { PlaceholderShell } from "../_components/placeholder-shell";

export const metadata = {
  title: "Work — Evgeniy Pimenov",
};

export default function Work() {
  return (
    <PlaceholderShell
      active="Work"
      title="A small wall of what I've made"
      body="A gallery of things — built, drawn, written for hire — is being assembled. The short version: software, mostly. Editorial design, sometimes. Quiet tools, when I can help it."
    />
  );
}
