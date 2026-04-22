// Post metadata loader. Source of truth is the MDX files under
// `content/journal/` — each file exports `metadata` with title/date/kind/dek
// alongside its default component. This module reads those metadata exports
// so the journal index and post route can share a typed post list without
// anyone having to duplicate frontmatter YAML.
import fs from "node:fs";
import path from "node:path";

// Fixed vocabulary. If we need a fifth kind some day, add it here and TS
// will flag every post/component that needs to learn about it.
export type PostKind = "Essay" | "Note" | "Project";

export type PostMeta = {
  slug: string;
  title: string;
  date: string;
  kind: PostKind;
  dek?: string;
};

// `process.cwd()` is the project root during both `next dev` and the build —
// stable anchor for the content directory that doesn't depend on how this
// file is transpiled or bundled.
const JOURNAL_DIR = path.join(process.cwd(), "content", "journal");

// Read the directory once and hand back the bare slugs. Both the async post
// loader and the Next generateStaticParams hook call this; no caching —
// readdirSync is a syscall but the directory is small and it's build-time.
function getSlugs(): string[] {
  return fs
    .readdirSync(JOURNAL_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}

// Dynamic-import each MDX module and read its exported `metadata`. We used
// to regex-scrape the raw file — this version is the right move because
// @next/mdx supports `export const metadata` as a first-class mechanism and
// we avoid breaking on apostrophes / unusual quoting / backtick strings.
//
// Promise.all parallelizes the imports; the sort runs on the resolved array
// so newest-first is the natural reading order of the journal index.
export async function getAllPosts(): Promise<PostMeta[]> {
  const slugs = getSlugs();
  const posts = await Promise.all(
    slugs.map(async (slug) => {
      const mod = (await import(`@/content/journal/${slug}.mdx`)) as {
        metadata: Omit<PostMeta, "slug">;
      };
      return { slug, ...mod.metadata };
    }),
  );
  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

// Thin alias over getSlugs() so Next's `generateStaticParams` hook doesn't
// need to import filesystem logic directly. Sync is important here: Next
// will accept an async version, but this one can't meaningfully await
// anything because it only reads directory names.
export function getPostSlugs(): string[] {
  return getSlugs();
}
