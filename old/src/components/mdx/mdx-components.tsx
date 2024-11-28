import { type MDXComponents } from "mdx/types";
import Image, { type ImageProps } from "next/image";
import Link from "next/link";
import { Children, type HTMLAttributes, type ReactElement } from "react";

import {
  coloredText,
  hoverDecoration,
  isValidCalloutType,
} from "@/lib/callout";
import { langIcons } from "@/lib/filetypes-icons";

import { BlockQuote } from "./blockquote";
import { Callout } from "./callout";
import { CodeBlock, InlineCode } from "./code";
import { H2, H3, H4 } from "./heading";
import { Interactive } from "./interactive";
import { Li, Ol, Ul } from "./lists";
import {
  Table,
  TableBody,
  TableData,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";

export const mdxComponents: MDXComponents = {
  h1: H2,
  h2: H3,
  h3: H4,
  p: ({ children, ...props }: HTMLAttributes<HTMLParagraphElement>) => (
    <p className="leading-7 [&:not(:first-child)]:mt-6" {...props}>
      {children}
    </p>
  ),
  // @ts-expect-error -- due to rehype-semantic-blockquotes plugin, figure may have these attributes
  figure: ({
    children,
    ...props
  }: HTMLAttributes<HTMLElement> & {
    ["data-blockquote-container"]: string;
  }) => {
    const isBlockquoteContainer = props["data-blockquote-container"] === "";
    if (!isBlockquoteContainer) {
      return <figure {...props}>{children}</figure>;
    }

    /* eslint @typescript-eslint/no-unsafe-call: off, @typescript-eslint/no-unsafe-member-access: off -- children will be an array and we know exactly that the last child will be a paragraph text node, the first child will be a blockcaption element due to the fact that we are using rehype-semantic-blockquotes plugin */
    // @ts-expect-error -- see eslint comment above
    const content = children.at(0).props.children as ReactElement<HTMLElement>;
    // @ts-expect-error -- see eslint comment above
    const credit = children.at(-1).props.children.props
      .children as ReactElement<HTMLParagraphElement>;

    return <BlockQuote credit={credit}>{content}</BlockQuote>;
  },
  blockquote: BlockQuote,
  ul: Ul,
  ol: Ol,
  // @ts-expect-error -- <Li> will have listType because we use cloneElement to "inject" that attribute based on whether the list item is in an Ol or Ul. Using Context API is out of the question since that would require the list elements to be client components
  li: Li,
  pre: CodeBlock,
  // @ts-expect-error -- need variable to know if we should style it as an inline <code> or as a code block
  code: InlineCode,
  table: Table,
  tbody: TableBody,
  thead: TableHead,
  tr: TableRow,
  th: TableHeader,
  td: TableData,
  a: ({
    children,
    href,
  }: HTMLAttributes<HTMLAnchorElement> & { href?: string }) => {
    if (!href) throw new Error("no href specified");

    return (
      <Link
        href={href}
        className={`group/link text-accent underline decoration-transparent transition-colors hover:decoration-accent ${coloredText} ${hoverDecoration} has-[.INLINE-CODE]:no-underline`}
      >
        {children}
      </Link>
    );
  },
  // @ts-expect-error -- due to rehype-alerts plugin, aside may have these attributes
  aside: ({
    children,
    ...rest
  }: HTMLAttributes<HTMLDivElement> & {
    ["data-alert-container"]: string;
    ["data-alert-title"]: string;
  }) => {
    const calloutType = rest["data-alert-container"];
    const title = rest["data-alert-title"];

    if (!isValidCalloutType(calloutType)) {
      return <aside {...rest}>{children}</aside>;
    }

    const childrenArray = Children.toArray(children);

    const firstNewlineIndex = childrenArray.indexOf("\n");
    const childrenWithoutTitle = childrenArray.slice(firstNewlineIndex + 1);

    return (
      <Callout title={title} calloutType={calloutType}>
        {childrenWithoutTitle}
      </Callout>
    );
  },
  img: (props) => (
    <Image
      sizes="100vw"
      style={{ width: "100%", height: "auto" }}
      {...(props as ImageProps)}
    />
  ),
  hr: () => (
    <div className="my-10 h-px w-full shrink-0 bg-surface0" role="none" />
  ),
  figcaption: ({ children, ...rest }) => {
    if (typeof children !== "string") {
      return <figcaption {...rest}>{children}</figcaption>;
    }

    // @ts-expect-error -- data-language type may be passed, not in our control
    const extension = rest["data-language"] as string;
    const LangIcon = langIcons.get(extension);

    return (
      <figcaption {...rest}>
        {LangIcon && <LangIcon className="inline" />}
        <span className="relative top-px">{children}</span>
      </figcaption>
    );
  },
  Interactive,
};
