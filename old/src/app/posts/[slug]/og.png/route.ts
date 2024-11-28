// NOTE: refactor this when https://github.com/vercel/next.js/issues/51147 gets solved

import { allPosts } from "contentlayer/generated";
import { ImageResponse } from "next/og";

import { OgImage, OgImageNotFound } from "./og-image";

export const generateStaticParams = () =>
  allPosts.map((post) => ({ slug: post._raw.flattenedPath }));

export function GET(req: Request, { params }: { params: { slug: string } }) {
  const post = allPosts.find(
    (mdxPost) => mdxPost._raw.flattenedPath === params.slug,
  );

  return new ImageResponse(
    post
      ? OgImage({ title: post.title, description: post.description })
      : OgImageNotFound(),
    {
      width: 1280,
      height: 675,
      status: post ? 200 : 404,
    },
  );
}
