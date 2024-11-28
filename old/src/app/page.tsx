import { allPosts } from "contentlayer/generated";
import { compareDesc } from "date-fns";

import { PostCard } from "@/components/post-card";

export default function Home() {
  const posts = allPosts.toSorted((a, b) =>
    compareDesc(new Date(a.date), new Date(b.date)),
  );

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-y-8 py-8">
      <h1 className="text-center text-2xl font-black">Recent Posts</h1>
      {posts.map((post) => (
        <PostCard key={post.title} {...post} />
      ))}
    </div>
  );
}
