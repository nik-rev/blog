import {
  Children,
  cloneElement,
  type HTMLAttributes,
  isValidElement,
} from "react";
import { FaArrowRight } from "react-icons/fa";

import { coloredText, orderedListItem } from "@/lib/callout";

export function Ul({ children, ...props }: HTMLAttributes<HTMLUListElement>) {
  const childrenWithContext = Children.toArray(children).map(async (el) =>
    // @ts-expect-error -- Expecting only <Li> as children
    isValidElement(el) ? cloneElement(el, { listType: "ul" }) : el,
  ) as React.ReactNode;

  return (
    <ul className="my-6 ml-6 list-none [&>li]:mt-2" {...props}>
      {childrenWithContext}
    </ul>
  );
}

export function Ol({ children, ...props }: HTMLAttributes<HTMLOListElement>) {
  const childrenWithContext = Children.toArray(children).map(async (el) =>
    // @ts-expect-error -- Expecting only <Li> as children
    isValidElement(el) ? cloneElement(el, { listType: "ol" }) : el,
  ) as React.ReactNode;

  return (
    <ol className="my-6 ml-6 list-decimal [&>li]:mt-2" {...props}>
      {childrenWithContext}
    </ol>
  );
}

export function Li({
  children,
  listType,
  ...props
}: HTMLAttributes<HTMLLIElement> & { listType: "ol" | "ul" }) {
  return (
    /* eslint sonarjs/no-nested-template-literals: off -- is cleaner this way */
    <li
      className={`relative pl-2 leading-7 ${listType === "ol" ? `marker:font-bold marker:text-accent ${orderedListItem}` : ""}`}
      {...props}
    >
      {children}
      {listType === "ul" && (
        <FaArrowRight
          className={`absolute -left-5 top-[0.4rem] text-accent ${coloredText}`}
        />
      )}
    </li>
  );
}
