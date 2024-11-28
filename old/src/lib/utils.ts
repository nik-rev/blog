import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Extracts a text string from any React Element
 */
export const extractTextFromChildren = (
  childrenOrText: React.ReactNode,
  text = "",
): string => {
  if (
    typeof childrenOrText === "number" ||
    typeof childrenOrText === "bigint" ||
    typeof childrenOrText === "boolean"
  ) {
    return text;
  }
  if (!childrenOrText) {
    return text;
  }

  if (typeof childrenOrText === "string") {
    /* eslint unicorn/prefer-spread: off -- Only applies to arrays, we are dealing with strings here */
    return extractTextFromChildren(null, text.concat(childrenOrText));
  }

  if ("props" in childrenOrText && "children" in childrenOrText.props) {
    const children = (childrenOrText.props as { children: unknown })
      .children as React.ReactNode;

    return extractTextFromChildren(children, text);
  }

  if (Array.isArray(childrenOrText)) {
    const result = (childrenOrText as React.ReactNode[]).reduce(
      (textFromArray: string | null, childOrText: React.ReactNode) => {
        if (textFromArray === null) {
          return null;
        }

        const extracted = extractTextFromChildren(childOrText);

        if (!extracted) {
          return null;
        }

        return textFromArray.concat(extracted);
      },
      text,
    );

    if (result === null) {
      throw new Error("Unable to extract string from React Element");
    }

    return result;
  }

  return "";
};
