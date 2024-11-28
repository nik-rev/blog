import { type CalloutType, calloutTypes } from "@/lib/callout";

import { H4 } from "./heading";

export function Callout({
  calloutType,
  title,
  children,
}: {
  calloutType: CalloutType;
  title: string;
  children: React.ReactNode;
}) {
  /* eslint security/detect-object-injection: off -- No user input here */
  const data = calloutTypes[calloutType];

  const icon = (
    <span className={`flex gap-x-2 text-${data.accent}`}>
      <span className="font-bold uppercase">{calloutType}</span>
      <data.icon strokeWidth={2.4} />
    </span>
  );

  return (
    <aside
      className={`group relative block overflow-x-auto border-l-4 bleed max-sm:text-sm border-l-${data.accent} bg-${data.accent}/5 ${data.accent.toUpperCase()}`}
    >
      <span className="align-center -mb-2 mt-0 flex justify-between">
        {title !== "" && <strong className="mt-0">{title}</strong>}
        {icon}
      </span>
      {children}
    </aside>
  );
}
