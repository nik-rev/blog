import {
  Flame,
  Info,
  Lightbulb,
  PartyPopper,
  TriangleAlert,
} from "lucide-react";

export const calloutTypes = {
  note: {
    icon: Info,
    accent: "blue",
  },
  tip: {
    icon: Lightbulb,
    accent: "teal",
  },
  warning: {
    icon: TriangleAlert,
    accent: "yellow",
  },
  danger: {
    icon: Flame,
    accent: "red",
  },
  "fun fact": {
    icon: PartyPopper,
    accent: "pink",
  },
} as const;

export type CalloutType = keyof typeof calloutTypes;

export const isValidCalloutType = (str: string): str is CalloutType =>
  Object.keys(calloutTypes).includes(str);

const calloutColors = Object.values(calloutTypes).map(({ accent }) =>
  accent.toUpperCase(),
);

export const calloutAccent = calloutColors.flatMap((color) => {
  const lowerColor = color.toLowerCase();
  return [
    color,
    `border-l-${lowerColor}`,
    `text-${lowerColor}`,
    `bg-${lowerColor}/5`,
  ];
});

export type CalloutColor = (typeof calloutColors)[number];

type CalloutStyleGenerator = (color: CalloutColor) => string;

const calloutStylesFunctions: Record<string, CalloutStyleGenerator> = {
  /**
   * Tinted background color, e.g. in code blocks
   */
  overlay: (color) => `group-[.${color}]:before:bg-${color.toLowerCase()}/5`,

  /**
   * Inline code that is also a link
   */
  inlineCode: (color) =>
    `group-[.${color}]:group-hover/link:border-b-${color.toLowerCase()}`,

  /**
   * Numbers before each list item in ordered lists
   */
  orderedListItem: (color) =>
    `group-[.${color}]:marker:text-${color.toLowerCase()}`,

  /**
   * Text within an callout, such as text within links
   */
  coloredText: (color) => `group-[.${color}]:text-${color.toLowerCase()}`,

  /**
   * Colored underline for links, change color to support transition
   */
  hoverDecoration: (color) =>
    `group-[.${color}]:hover:decoration-${color.toLowerCase()}`,
};

/**
 * Values is array of tailwind classes corresponding to a particular purpose
 * For example, to make some text within a callout inherit its accent color, we have something like:
 * ["group-[.BLUE]:text-blue", "group-[.RED]:text-red", ...]
 */
export const calloutStylesArray: Record<
  keyof typeof calloutStylesFunctions,
  string[]
> = Object.fromEntries(
  Object.entries(calloutStylesFunctions).map(([styleName, styleGenerator]) => [
    styleName,
    calloutColors.map((color) => styleGenerator(color)),
  ]),
);

const calloutStyles: Record<keyof typeof calloutStylesFunctions, string> =
  Object.fromEntries(
    Object.entries(calloutStylesArray).map(([styleName, styles]) => [
      styleName,
      styles.join(" "),
    ]),
  );

export const {
  overlay,
  inlineCode,
  orderedListItem,
  coloredText,
  hoverDecoration,
} = calloutStyles;
