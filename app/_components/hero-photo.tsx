// Landing-page hero. The Concept C mockup called for a duotoned photo that
// fades into the eigengrau background, with the nav floating on top and the
// "humble abode" wordmark at the bottom-right. Everything here is layering
// (photo -> gradient -> content) inside a single 24rem tall stage.
import { Nav } from "./nav";

// Unsplash photo — intentionally not super recognizable. The duotone
// treatment (grayscale + brightness + contrast in the filter below) makes
// the original image almost irrelevant; it reads as atmosphere, not subject.
const PHOTO_URL =
  "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1800&q=85&auto=format&fit=crop";

export function HeroPhoto() {
  return (
    <div className="relative h-96 overflow-hidden flex flex-col justify-between border-b border-rule">
      {/* Layer 1: the photo. CSS filters do the duotone work client-side so
          we don't have to pre-process the image. `backgroundColor` provides
          a fallback tone in case the image fails to load. */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url('${PHOTO_URL}')`,
          backgroundSize: "cover",
          backgroundPosition: "center 60%",
          backgroundColor: "#2a2a32",
          filter: "grayscale(0.6) brightness(0.55) contrast(1.05)",
        }}
      />
      {/* Layer 2: gradients that fade the photo's edges into eigengrau. The
          linear gradient fades to fully-opaque eigengrau at the very top —
          this hides the seam where iOS Safari's top browser bar inherits the
          page background color and would otherwise butt against the photo —
          and darkens the bottom so the wordmark has contrast. The radial
          gradient vignettes toward the corners. Both use the eigengrau hex
          directly (rgba form of #16161d) because gradient stops can't
          consume CSS variables reliably across browsers. */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(180deg, rgba(22,22,29,1) 0%, rgba(22,22,29,0.15) 35%, rgba(22,22,29,0.85) 100%),
            radial-gradient(120% 60% at 50% 40%, rgba(22,22,29,0) 0%, rgba(22,22,29,0.45) 100%)
          `,
        }}
      />

      {/* Layer 3: nav on top. `z-10` lifts it above the gradient layers. */}
      <nav className="relative">
        <Nav active="Journal" />
      </nav>

      {/* Layer 3 (cont): wordmark, bottom-right. `self-end` pushes it to the
          end of the outer flex column; `text-right` right-aligns the stack. */}
      <div className="relative z-10 self-start text-left px-12 pb-11">
        {/* Eyebrow in mono-editorial — the "// comment" voice used as a
            editorial greeting. */}
        <div className="font-mono-editorial text-[0.78rem] tracking-[0.22em] uppercase text-mute mb-2">
          Welcome to my
        </div>
        {/* The single big Instrument Serif moment on the whole site. */}
        <div className="font-serif italic text-[5.25rem] leading-[0.95] tracking-tight text-titanium">
          humble abode
        </div>
        {/* Thin gold hairline under the wordmark. Stands in for the lost
            ampersand that used to anchor the accent in the earlier mockup. */}
        <div className="mt-3 ml-0 md:ml-auto h-px w-24 bg-gold" />
      </div>
    </div>
  );
}
