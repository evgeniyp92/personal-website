// Individual journal post page at /journal/[slug]. At build time,
// generateStaticParams walks the content directory and Next pre-renders one
// static HTML page per MDX file. Requests for any unknown slug 404 instead
// of rendering (dynamicParams = false).
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllPosts, getPostSlugs } from "@/lib/posts";
import { Nav } from "../../_components/nav";

// Refuse to render on-demand slugs that weren't present at build time. If
// someone types /journal/nonexistent we want a 404, not an attempt to import
// a missing MDX module (which would crash the request).
export const dynamicParams = false;

// Feeds the SSG pipeline — Next calls this once at build and the return
// value is the exhaustive list of slugs to pre-render. Sync is fine: the
// content directory is read synchronously.
export function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

// Per-post <head> metadata. Returning `{}` for a missing post isn't a user-
// facing case here (dynamicParams = false blocks unknown slugs), but the
// guard keeps TypeScript happy and the function safe to reuse.
export async function generateMetadata(props: PageProps<"/journal/[slug]">) {
  const { slug } = await props.params;
  const post = (await getAllPosts()).find((p) => p.slug === slug);
  if (!post) return {};
  return { title: `${post.title} — Evgeniy Pimenov`, description: post.dek };
}

// Same YYYY.MM.DD ledger format used by the journal index. Inlined here
// rather than sharing because it's four lines and the two callers don't
// need to move in lockstep.
function formatDate(iso: string) {
  const d = new Date(iso);
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}.${m}.${day}`;
}

export default async function JournalPost(props: PageProps<"/journal/[slug]">) {
  // Next 16 passes params as a Promise — you have to await it before reading
  // properties, even for otherwise-sync-looking keys like `slug`.
  const { slug } = await props.params;
  const post = (await getAllPosts()).find((p) => p.slug === slug);
  if (!post) notFound();

  // Dynamic MDX import. The template literal is intentional: @next/mdx's
  // webpack/turbopack loader recognizes the `@/content/journal/` prefix and
  // generates code-split chunks for each possible slug at build time. Using
  // a fully static string would work too, but would defeat the per-post
  // code-split. `Post` is the default export (the rendered MDX component).
  const { default: Post } = await import(`@/content/journal/${slug}.mdx`);

  return (
    <div className="flex-1">
      <header className="border-b border-rule">
        <Nav active="Journal" />
      </header>

      {/* 68ch is the editorial sweet spot — wide enough that long sentences
          don't look fragmented, narrow enough to keep the eye's return sweep
          short. mx-auto centers the column regardless of viewport width. */}
      <article className="max-w-[68ch] mx-auto px-10 pt-16 pb-24">
        {/* Byline ledger: kind · date, in the mono-editorial voice. */}
        <div className="flex items-baseline gap-4 mb-6 font-mono-editorial text-[0.72rem] tracking-[0.2em] uppercase text-mute">
          <span className="text-gold">{post.kind}</span>
          <span>·</span>
          <span>{formatDate(post.date)}</span>
        </div>
        <h1 className="font-sans text-[2.5rem] font-medium tracking-tight leading-[1.1] text-titanium mb-5">
          {post.title}
        </h1>
        {post.dek && (
          // Currently in Instrument Serif italic — an editorial subhead
          // moment. Flagged for a call on whether to hew stricter to the
          // "serif = hero + drop cap only" rule; kept for now because it
          // reads well in the display zone.
          <p className="font-serif italic text-[1.25rem] leading-[1.5] text-mute mb-10">
            {post.dek}
          </p>
        )}
        {/* `.mdx-body` is the hook the globals.css drop-cap rule keys off of:
            the gold first-letter only applies inside this wrapper so it
            doesn't leak into other paragraphs elsewhere on the page. */}
        <div className="mdx-body">
          <Post />
        </div>

        <div className="mt-20 pt-8 border-t border-rule">
          <Link
            href="/"
            className="font-mono-editorial text-[0.72rem] tracking-[0.2em] uppercase text-mute hover:text-titanium transition-colors"
          >
            {"// Back to journal"}
          </Link>
        </div>
      </article>
    </div>
  );
}
