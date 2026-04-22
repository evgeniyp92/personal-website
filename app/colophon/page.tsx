// /colophon — placeholder for the about-this-site page: fonts, palette,
// tools, photography credit. Shares PlaceholderShell with /work and /notes.
import { PlaceholderShell } from "../_components/placeholder-shell";

export const metadata = {
  title: "Colophon — Evgeniy Pimenov",
};

export default function Colophon() {
  return (
    <PlaceholderShell
      active="Colophon"
      title="About this room"
      body="A short note about the fonts, the color of the ground, the photo in the hero, and the tools used to build all of it. Being written."
    />
  );
}
