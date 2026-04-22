// An in-page preview card that shows how an article's prose will read when
// you click into a post. Serves double duty: it advertises the visual style
// to first-time visitors AND acts as a self-documenting design artifact we
// can point at when discussing type/color choices.
//
// The dashed border is the standard "work-in-progress / sample" affordance
// used by PlaceholderShell too — signals this isn't a real article.
export function ProseDemo() {
  return (
    <div className="mx-10 my-12 p-8 border border-dashed border-rule rounded-lg max-w-[68ch]">
      <div className="font-mono-editorial text-[0.7rem] tracking-[0.2em] uppercase text-gold mb-3">
        {"// Prose demo — how an essay reads"}
      </div>
      <h3 className="font-sans text-[1.75rem] font-medium tracking-tight text-titanium mb-4 leading-[1.15]">
        On keeping a room for the work
      </h3>
      <p className="text-[1.02rem] leading-[1.7] text-titanium mb-4">
        {/* Inline drop cap: only used inside the demo card. Real articles get
            their drop cap from the `.mdx-body > p:first-of-type` CSS in
            globals.css, which walks the DOM rather than requiring a span. */}
        <span
          className="font-serif text-[3rem] float-left leading-[0.9] pr-2 pt-1 text-gold"
          aria-hidden
        >
          I
        </span>
        have come to believe that the room in which a thing is made is not
        decoration but instruction. A studio teaches you what it asks for the
        way a garden teaches you about water — not by telling, but by not
        forgiving.
      </p>
      <p className="text-[1.02rem] leading-[1.7] text-titanium">
        The ground you are reading this on is called{" "}
        <em className="italic">eigengrau</em> — the color the eye sees in
        complete darkness. It is not black; it is the brain's idea of black. I
        like it because it admits that even the blankness has a temperature.
      </p>
    </div>
  );
}
