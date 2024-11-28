import remarkA11yEmoji from "@fec/remark-a11y-emoji";
import { defineDocumentType, makeSource } from "contentlayer/source-files";
import GithubSlugger from "github-slugger";
import readingTime from "reading-time";
import rehypeAlerts from "rehype-alerts";
import prettyCode from "rehype-pretty-code";
import rehypeSemanticBlockquotes from "rehype-semantic-blockquotes";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import remarkSmartypants from "remark-smartypants";
import { transformerNotationDiff } from "shikiji-transformers";

export const Post = defineDocumentType(() => ({
  name: "Post",
  filePathPattern: "**/*.mdx",
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true },
    date: { type: "date", required: true },
    updatedAt: { type: "date", required: true },
    /** displayed on preview card */
    excerpt: { type: "string", required: true },
    /** for SEO */
    description: { type: "string", required: true },
    toc: {
      type: "boolean",
      required: false,
      default: false,
    },
    /** for searching */
    tags: { type: "list", of: { type: "string" }, required: true },
    /** for SEO */
    keywords: { type: "list", of: { type: "string" }, required: true },
    published: { type: "boolean", required: true, default: false },
  },
  computedFields: {
    url: {
      type: "string",
      resolve: (post) => `/posts/${post._raw.flattenedPath}`,
    },
    /**
     * Estimated number of minutes to read the post
     * */
    readTime: {
      type: "number",
      resolve: (post) => Math.round(readingTime(post.body.raw).minutes),
    },
    headings: {
      type: "json",
      resolve: (doc) => {
        const headingsRegex = /\n(?<flag>#{1,6})\s+(?<content>.+)/gv;
        const slugger = new GithubSlugger();
        return [...doc.body.raw.matchAll(headingsRegex)].map(({ groups }) => {
          const flag = groups?.flag;
          const content = groups?.content;
          return {
            level:
              flag?.length === 1 ? "one" : flag?.length === 2 ? "two" : "three",
            text: content,
            slug: content ? slugger.slug(content) : null,
          };
        });
      },
    },
  },
}));

export default makeSource({
  contentDirPath: "posts",
  documentTypes: [Post],
  mdx: {
    remarkPlugins: [
      remarkGfm,
      // wrap emojis in spans with aria-label description
      remarkA11yEmoji,
      remarkSmartypants,
    ],
    rehypePlugins: [
      rehypeSlug,
      rehypeSemanticBlockquotes,
      rehypeAlerts,
      [
        // @ts-expect-error -- No control over this
        prettyCode,
        {
          theme: {
            dark: "catppuccin-mocha",
            light: "catppuccin-latte",
          },
          transformers: [transformerNotationDiff()],
        },
      ],
    ],
  },
});
