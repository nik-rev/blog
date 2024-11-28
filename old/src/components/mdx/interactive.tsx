"use client";

import { useState } from "react";

import { Select } from "../react-aria/select";

export function Interactive() {
  const [slider, setSlider] = useState(50);
  const [counter, setCounter] = useState(0);

  return (
    <div className="flex flex-col gap-8 rounded-md border border-subtext0 bleed *:border *:border-white *:p-2">
      <Select
        label="Ice cream flavor"
        items={["Chocolate", "Mint", "Strawberry", "Vanilla"]}
      />
    </div>
  );
}
