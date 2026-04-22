// MDX component map. When @next/mdx renders an .mdx file inside the App
// Router, it calls `useMDXComponents()` from the project root to decide which
// React component should render each HTML-ish tag the MDX author uses
// (h1, p, a, blockquote, etc.). This file is the single source of truth for
// how prose "looks" — the post route wraps its output in `.mdx-body` for the
// drop-cap CSS, but all typography tokens live here.
//
// File location matters: @next/mdx with App Router requires this file to sit
// at the project root (not under app/). Moving or renaming it silently
// breaks all MDX styling.
import type { MDXComponents } from "mdx/types";

const components: MDXComponents = {
  // Display heading inside an article body. `font-sans` resolves to Geist via
  // the --font-sans CSS variable set in globals.css.
  h1: ({ children }) => (
    <h1 className="font-sans text-4xl font-medium tracking-tight text-titanium mt-10 mb-5 leading-[1.08]">
      {children}
    </h1>
  ),
  // Section heading. `tracking-tight` tightens Geist's default tracking to
  // match the hero/landing typography.
  h2: ({ children }) => (
    <h2 className="font-sans text-2xl font-medium tracking-tight text-titanium mt-10 mb-4 leading-snug">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="font-sans text-lg font-medium tracking-tight text-titanium mt-8 mb-3">
      {children}
    </h3>
  ),
  // Body paragraph. 1.02rem / 1.7 leading is the editorial reading rhythm
  // shared with the prose demo card on the landing page.
  p: ({ children }) => (
    <p className="prose-p text-titanium text-[1.02rem] leading-[1.7] mb-5">
      {children}
    </p>
  ),
  // Gold is the only accent color. Underlines use 40% opacity at rest and
  // become fully opaque on hover — a quieter take on the classic link ramp.
  a: ({ children, href }) => (
    <a
      href={href}
      className="text-gold underline decoration-gold/40 underline-offset-4 hover:decoration-gold transition-colors"
    >
      {children}
    </a>
  ),
  // Pull-quote: gold left rail + muted italic body. Re-uses the single gold
  // anchor so pages don't accumulate competing accents.
  blockquote: ({ children }) => (
    <blockquote className="border-l-2 border-gold pl-5 my-6 text-mute italic">
      {children}
    </blockquote>
  ),
  // Inline code. `font-mono-editorial` resolves to IBM Plex Mono — reserved
  // for eyebrows/meta and code, distinct from Geist Mono.
  code: ({ children }) => (
    <code className="font-mono-editorial bg-rule px-1.5 py-0.5 rounded text-[0.9em] text-titanium">
      {children}
    </code>
  ),
  // Fenced code block. `overflow-x-auto` keeps long lines from breaking the
  // 68ch article column width.
  pre: ({ children }) => (
    <pre className="font-mono-editorial bg-black/40 border border-rule rounded-md p-4 my-6 overflow-x-auto text-sm leading-relaxed">
      {children}
    </pre>
  ),
  // `marker:text-mute` tones the bullet dots/numbers so they don't compete
  // with the titanium body text.
  ul: ({ children }) => (
    <ul className="list-disc list-outside pl-6 mb-5 text-titanium marker:text-mute space-y-1.5">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal list-outside pl-6 mb-5 text-titanium marker:text-mute space-y-1.5">
      {children}
    </ol>
  ),
  hr: () => <hr className="border-rule my-10" />,
  em: ({ children }) => <em className="italic text-titanium">{children}</em>,
  strong: ({ children }) => (
    <strong className="font-semibold text-titanium">{children}</strong>
  ),
};

// Hook name is required by the @next/mdx contract — it's called per render
// and the returned map is merged with any component overrides the MDX file
// itself passes.
export function useMDXComponents(): MDXComponents {
  return components;
}
