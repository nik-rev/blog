"use client";

import { Check, Copy } from "lucide-react";
import { cloneElement, useRef, useState } from "react";
import { type HTMLAttributes } from "react";

import { inlineCode, overlay } from "@/lib/callout";
import { extractTextFromChildren } from "@/lib/utils";

export function CodeBlock({ children }: HTMLAttributes<HTMLPreElement>) {
  const [isCopying, setIsCopying] = useState(false);
  const [isAfterVisible, setIsAfterVisible] = useState(false);
  const preRef = useRef(null);

  const handleCopy = () => {
    const text = extractTextFromChildren(children);

    setIsAfterVisible(true);
    setIsCopying(true);

    void navigator.clipboard.writeText(text);

    setTimeout(() => {
      setIsAfterVisible(false);
    }, 100);
    setTimeout(() => {
      setIsCopying(false);
    }, 3000);
  };

  return (
    <pre
      className={`group/code relative before:pointer-events-none before:absolute before:-inset-x-4 before:inset-y-0 after:pointer-events-none after:absolute after:-inset-x-4 after:inset-y-0 ${overlay} md:before:-inset-x-8 md:after:-inset-x-8 ${isAfterVisible ? "after:bg-text/20" : "after:bg-text/0"} after:transition-colors`}
      ref={preRef}
    >
      <div className="overflow-x-auto bg-mantle bleed">
        {
          // @ts-expect-error -- will always be <code> element
          cloneElement(children, { isInCodeBlock: true })
        }
      </div>
      <button
        type="button"
        onClick={handleCopy}
        className={`absolute right-0 top-4 scale-90 bg-transparent text-subtext0 opacity-0 transition-colors [transition-property:transform] hover:text-text group-hover/code:scale-100 ${isCopying ? "scale-100 opacity-100" : "hover:scale-90 group-hover/code:opacity-100"} max-md:hidden md:right-0 md:top-8`}
      >
        {isCopying ? <Check className="text-green" /> : <Copy />}
      </button>
    </pre>
  );
}

export function InlineCode({
  children,
  isInCodeBlock,
  ...rest
}: HTMLAttributes<HTMLElement> & {
  isInCodeBlock: boolean;
}) {
  return isInCodeBlock ? (
    <code {...rest}>{children}</code>
  ) : (
    <code
      className={`INLINE-CODE select-all rounded-md border-[1.5px] border-surface0 bg-mantle px-[0.3rem] py-[0.2rem] align-middle font-mono text-sm transition-colors group-hover/link:border-b-accent ${inlineCode}`}
    >
      {children}
    </code>
  );
}
