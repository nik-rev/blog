"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { ChevronDown, MoveRight } from "lucide-react";
import { type Dispatch, type SetStateAction, useState } from "react";

import { cn } from "@/lib/utils";

const APPLE = "🍎";
const BANANA = "🍌";
const STRAWBERRY = "🍓";

type Fruit = typeof APPLE | typeof BANANA | typeof STRAWBERRY;

const FINGER = "👉";

function Fruits({
  fruits,
  className,
}: {
  fruits: readonly Fruit[] | Fruit;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "font-mono text-2xl tracking-widest text-subtext0",
        className,
      )}
    >
      {typeof fruits === "string" && <span>{fruits}</span>}
      {Array.isArray(fruits) && "["}
      {Array.isArray(fruits) &&
        fruits.map((fruit, index) => (
          <>
            <span key={fruit}>{fruit}</span>
            <span>,</span>
          </>
        ))}
      {Array.isArray(fruits) && "]"}
    </div>
  );
}

const fruits = {
  generic: [APPLE, BANANA, APPLE, BANANA],
} satisfies Record<string, Fruit[]>;

const demo: {
  at: number;
  filter: Fruit;
  concat: Fruit[];
} = {
  at: 2,
  filter: BANANA,
  concat: [STRAWBERRY, BANANA],
};

// <div>
//   At: {demo.at}
//   <Fruits fruits={fruits.generic} />
//   {/* @ts-expect-error -- remove me later */}
//   <Fruits fruits={fruits.generic.at(demo.at)} />
// </div>
// <div>
//   Concat: {demo.concat}
//   <Fruits fruits={fruits.generic} />
//   <Fruits fruits={[...fruits.generic, ...demo.concat]} />
// </div>

function Dropdown<Option extends string>({
  options,
  selected,
  setSelected,
}: {
  options: readonly Option[];
  selected: Option;
  setSelected: Dispatch<SetStateAction<Option>>;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="group inline-flex w-20 items-center justify-between gap-2 bg-mantle p-2">
        {selected}
        <ChevronDown className="transition-transform group-[[data-state=open]]:rotate-180" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="z-50">
        {options.map((option) => {
          if (option === selected) {
            return null;
          }

          return (
            <DropdownMenuItem
              onClick={() => {
                setSelected(option);
              }}
              key={option}
              className="flex h-12 w-20 items-center justify-start bg-mantle p-2"
            >
              {option}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function SelectFruit<Option extends string>({
  options,
  selected,
  setSelected,
}: {
  options: readonly Option[];
  selected: Option;
  setSelected: Dispatch<SetStateAction<Option>>;
}) {
  return (
    <div className="-mb-6 mt-6 flex text-text md:-mb-8 md:mt-8">
      {options.map((option) => (
        <button
          onClick={() => {
            setSelected(option);
          }}
          className={`z-20 h-8 w-12 ${option === selected ? "bg-crust" : "bg-mantle"} `}
          type="button"
          key={option}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

export function Map() {
  const options = ["🟥", "🟩", "🟦"] as const;
  const mapExample = [BANANA, APPLE, BANANA, APPLE] as const;
  const [selected, setSelected] = useState<(typeof options)[number]>("🟦");

  return (
    <div>
      <SelectFruit
        options={options}
        selected={selected}
        setSelected={setSelected}
      />
      <div className="relative flex items-center gap-x-4 bg-mantle bleed">
        <div className="flex w-max items-center p-2 pl-0 font-mono text-2xl">
          <Fruits fruits={mapExample} />
          .map(
          <Fruits fruits={selected} />)
        </div>
        <MoveRight className="text-subtext0" />
        <Fruits
          fruits={mapExample}
          className="bg-[#dd2e44] bg-clip-text text-transparent"
        />
      </div>
    </div>
  );
}

export function Filter() {
  const options = [STRAWBERRY, BANANA, APPLE] as const;
  const filterExample = [BANANA, APPLE, BANANA, APPLE] as const;
  const [selected, setSelected] = useState<(typeof options)[number]>(BANANA);

  return (
    <div>
      <SelectFruit
        options={options}
        selected={selected}
        setSelected={setSelected}
      />
      <div className="relative flex items-center gap-x-4 bg-mantle bleed">
        <div className="flex w-max items-center p-2 pl-0 font-mono text-2xl">
          <Fruits fruits={filterExample} />
          .filter(
          <Fruits fruits={selected} />)
        </div>
        <MoveRight className="text-subtext0" />
        <Fruits fruits={filterExample.filter((fruit) => fruit === selected)} />
      </div>
    </div>
  );
}

// export function ArrayMethods() {
//   return (
//     <div className="space-y-12 bg-purple-100/5 bleed">
//       <div>
//         Filter all except: {demo.filter}
//         <Fruits fruits={fruits.generic} />
//         <Fruits
//           fruits={fruits.generic.filter((fruit) => fruit === demo.filter)}
//         />
//       </div>
//     </div>
//   );
// }
