// Landing page — the Journal front door. Top-to-bottom: hero photo with the
// "humble abode" wordmark, under-strip with tagline + font picker, the
// journal ledger of posts, and the prose demo card at the bottom.
//
// Async because `getAllPosts()` dynamic-imports each MDX module to read its
// exported metadata. It's a server component (the default in App Router) so
// the await happens at build/request time and no MDX ships to the client.
import { getAllPosts } from "@/lib/posts";
import { HeroPhoto } from "./_components/hero-photo";
import { JournalIndex } from "./_components/journal-index";
import { ProseDemo } from "./_components/prose-demo";
import { UnderStrip } from "./_components/under-strip";

export default async function Home() {
  const posts = await getAllPosts();
  return (
    <div className="flex-1">
      <HeroPhoto />
      <UnderStrip />
      <JournalIndex posts={posts} />
      <ProseDemo />
    </div>
  );
}
