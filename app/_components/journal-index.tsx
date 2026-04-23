// The list of posts on the landing page. Styled as a 3-column ledger:
//   [  date (mono)  ][  title + dek  ][  kind label (mono, gold)  ]
// The divide/border-y utility combo draws a single hairline between rows
// without doubling up at the top or bottom.
import Link from "next/link";
import type { PostMeta } from "@/lib/posts";

// YYYY.MM.DD reads as a ledger entry rather than a friendly date — matches
// the editorial-ledger voice of the mono eyebrows. We use UTC methods so the
// same ISO date always renders the same string regardless of server timezone.
function formatDate(iso: string) {
  const d = new Date(iso);
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}.${m}.${day}`;
}

export function JournalIndex({ posts }: Readonly<{ posts: Readonly<PostMeta[]> }>) {
  return (
    <div className="px-10 pt-10 pb-12 max-w-300 mx-auto">
      <div className="font-mono-editorial text-[0.72rem] tracking-[0.2em] uppercase text-mute mb-5">
        {"// Latest entries"}
      </div>
      {/* `divide-y` puts a 1px rule between children; the outer `border-y`
          closes off the top and bottom so the list reads as a bounded table. */}
      <ul className="divide-y divide-rule border-y border-rule">
        {posts.map((post) => (
          <li key={post.slug}>
            {/* Fixed-width date column + flex title/dek + auto-width kind
                label. `items-baseline` aligns the text baselines across the
                three differently-sized strings in each row. */}
            <Link
              href={`/journal/${post.slug}`}
              className="grid grid-rows-[1rem_1fr] md-grid-rows-1 md:grid-cols-[120px_1fr_auto] gap-2 md:gap-9 items-baseline py-6 group"
            >
              <div className="font-mono-editorial text-xs text-mute tracking-wide md:block">
                {formatDate(post.date)}
              </div>
              <div>
                <div className="font-sans text-[1.5rem] font-medium tracking-tight leading-tight text-titanium group-hover:text-titanium transition-colors">
                  {post.title}
                </div>
                {post.dek && (
                  <div className="text-[0.92rem] text-mute leading-relaxed mt-1.5 max-w-[58ch]">
                    {post.dek}
                  </div>
                )}
              </div>
              {/* Kind label in gold mono — the one accent per row. */}
              <div className="font-mono-editorial text-[0.7rem] tracking-[0.18em] uppercase text-gold hidden md:block">
                {post.kind}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
