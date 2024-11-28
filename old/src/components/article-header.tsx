import { type Post } from "contentlayer/generated";
import { format, parseISO } from "date-fns";
import { titleCase } from "title-case";

import { Badge } from "./ui/badge";

export function ArticleHeader({ post }: { post: Post }) {
  return (
    <header className="relative flex w-full flex-col justify-start">
      <span className="flex w-full flex-col items-center justify-center gap-12 bg-mantle">
        <span className="flex w-full max-w-article flex-col p-8 sm:p-8">
          <h1 className="scroll-m-20 bg-gradient-to-b from-text to-subtext1 bg-clip-text pt-10 text-left text-4xl font-extrabold tracking-tight text-transparent lg:pb-4 lg:pt-16 lg:text-5xl">
            {titleCase(post.title)}
          </h1>
          <div className="mt-4 space-x-2">
            {post.tags.map((tag) => (
              <Badge className="w-max" key={tag}>
                {tag}
              </Badge>
            ))}
          </div>
          <time dateTime={post.date} className="mb-6 mt-10 text-subtext1">
            {format(parseISO(post.date), "LLLL do, yyyy")}
          </time>
        </span>
      </span>

      <div className="-mb-8 w-full overflow-hidden sm:mb-0 md:mb-8">
        <svg
          data-name="Layer 1"
          className="block h-[100px] max-h-[10vw] w-full"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            className="fill-mantle"
          />
        </svg>
      </div>
    </header>
  );
}
