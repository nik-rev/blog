import { Link as SvgLink } from "lucide-react";
import { type HTMLAttributes } from "react";

import { coloredText } from "@/lib/callout";
import { cn } from "@/lib/utils";

type HeadingProps = HTMLAttributes<HTMLHeadingElement> & {
  id?: string;
  children?: React.ReactNode;
};

const createHeading = (level: 2 | 3 | 4) =>
  function Heading({ className, children, id, ...props }: HeadingProps) {
    const HeadingElement = `h${level}` as const;

    const iconSizes = [22, 20, 16];

    const classNames = [
      "mt-24 pb-2 text-3xl text-accent bg-gradient-to-b from-accent to-subtext1/80 bg-clip-text",
      "relative mt-16 text-2xl",
      "mt-8 text-xl",
    ];

    return (
      <a href={`#${id}`} className="group/heading">
        <HeadingElement
          className={cn(
            `scroll-m-20 font-semibold tracking-tight transition-colors ${classNames[level - 2]}`,
            className,
          )}
          {...props}
        >
          {children}
          <SvgLink
            className={cn(
              `mb-1 ml-2.5 inline text-accent opacity-0 transition-opacity group-hover/heading:opacity-100 ${coloredText}`,
            )}
            size={iconSizes[level - 2]}
          />
        </HeadingElement>
      </a>
    );
  };

export const H2 = createHeading(2);
export const H3 = createHeading(3);
export const H4 = createHeading(4);
