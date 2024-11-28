import { allPosts } from "contentlayer/generated";
import { type Metadata } from "next";
import { notFound } from "next/navigation";
import { useMDXComponent } from "next-contentlayer/hooks";

import { ArticleHeader } from "@/components/article-header";
import { mdxComponents } from "@/components/mdx/mdx-components";
import { NAME, origin, TWITTER } from "@/lib/constants";

import { OG_HEIGHT, OG_WIDTH } from "./og.png/data";

export const generateStaticParams = () =>
  allPosts.map((post) => ({ slug: post._raw.flattenedPath }));

export const generateMetadata = ({
  params,
}: {
  params: { slug: string };
  searchParams: string;
}): Metadata => {
  const post = allPosts.find(
    (mdxPost) => mdxPost._raw.flattenedPath === params.slug,
  );

  if (!post) throw new Error(`Post not found for slug: ${params.slug}`);

  const { title, description, keywords, date, updatedAt } = post;

  const titleWithName = `${title} • ${NAME}`;
  const alt = `Preview image for ${titleWithName}`;
  const previewUrl = `${origin}/posts/${params.slug}/og.png`;

  return {
    title: titleWithName,
    description,
    openGraph: {
      type: "article",
      title: titleWithName,
      description,
      siteName: `${NAME}'s Blog`,
      authors: NAME,
      tags: keywords,
      publishedTime: new Date(date).toISOString(),
      modifiedTime: new Date(updatedAt).toISOString(),
      images: [
        {
          url: previewUrl,
          secureUrl: previewUrl,
          width: OG_WIDTH,
          height: OG_HEIGHT,
          alt,
        },
      ],
    },
    keywords,
    twitter: {
      title: titleWithName,
      card: "summary_large_image",
      site: TWITTER,
      description,
      creator: TWITTER,
      images: {
        url: previewUrl,
        alt,
      },
    },
  };
};

function PostLayout({ params }: { readonly params: { slug: string } }) {
  const post = allPosts.find(
    (mdxPost) => mdxPost._raw.flattenedPath === params.slug,
  );

  if (!post || (!post.published && process.env.NODE_ENV === "production")) {
    notFound();
  }

  const MDXContent = useMDXComponent(post.body.code);
  return (
    <article className="flex max-w-[100vw] flex-col items-center">
      <ArticleHeader post={post} />
      <main className="z-10 flex w-full flex-col pb-20 max-md:px-4 sm:max-w-prose">
        <MDXContent components={mdxComponents} />
      </main>
    </article>
  );
}

export default PostLayout;
