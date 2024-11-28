import {
  Children,
  cloneElement,
  type HTMLAttributes,
  isValidElement,
  type ReactElement,
} from "react";
import { GoDash } from "react-icons/go";
import { RiDoubleQuotesL, RiDoubleQuotesR } from "react-icons/ri";

import { cn } from "@/lib/utils";

export function BlockQuote({
  children,
  credit,
  ...props
}: HTMLAttributes<HTMLQuoteElement> & { credit?: React.ReactNode }) {
  const childrenArray = Children.toArray(children);

  const [firstChildIndex, lastChildIndex] = [
    childrenArray.findIndex((el) => isValidElement(el)),
    childrenArray.findLastIndex((el) => isValidElement(el)),
  ];

  if (lastChildIndex === -1 || firstChildIndex === -1) {
    throw new Error("Expected an element to be contained within Blockquote");
  }

  const lastChild = childrenArray.at(lastChildIndex) as ReactElement;
  const lastChildWithIcon = cloneElement(lastChild, {
    children: (
      <>
        {/* eslint @typescript-eslint/no-unsafe-member-access: off -- props is expected to contain children */}
        {lastChild.props.children}{" "}
        <RiDoubleQuotesR className="inline align-top text-2xl" />
      </>
    ),
  });

  const childrenLastIcon = childrenArray.with(
    lastChildIndex,
    lastChildWithIcon,
  );

  if (firstChildIndex === -1) {
    throw new Error("Expected an element to be contained within Blockquote");
  }

  const firstChild = childrenLastIcon.at(firstChildIndex) as ReactElement;
  const firstChildWithIcon = cloneElement(firstChild, {
    children: (
      <>
        <RiDoubleQuotesL className="inline align-top text-2xl" />
        {firstChild.props.children}
      </>
    ),
  });

  const childrenFirstIcon = childrenLastIcon.with(
    firstChildIndex,
    firstChildWithIcon,
  );

  const quoteContent = (
    <div className="relative ml-4 text-balance text-center">
      {childrenFirstIcon}
    </div>
  );

  const className = `block overflow-x-auto bg-lavender/5 italic max-sm:text-sm bleed`;

  const blockQuote = (
    <blockquote className={className} {...props}>
      {quoteContent}
    </blockquote>
  );

  const blockQuoteWithCredit = (
    <figure className={cn(className, "space-y-2 md:space-y-6")}>
      <blockquote {...props}>{quoteContent}</blockquote>
      <figcaption className="flex items-center not-italic text-subtext0">
        <GoDash className="mr-2 inline" strokeWidth={1} />
        {credit}
      </figcaption>
    </figure>
  );

  return credit ? blockQuoteWithCredit : blockQuote;
}
