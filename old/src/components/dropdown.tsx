// "use client";
//
// import { useState } from "react";
//
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
// } from "./ui/dropdown-menu";
//
// export function Dropdown<Option>({
//   options,
//   selected,
// }: {
//   options: Option[];
//   selected: Option;
// }) {
//   const [selectedOption, setSelectedOption] = useState<Option>(selected);
//
//   return (
//     <DropdownMenu>
//       <DropdownMenuContent>
//         {options.map((option) => {
//           <DropdownMenuItem>{option}</DropdownMenuItem>;
//         })}
//       </DropdownMenuContent>
//     </DropdownMenu>
//   );
// }
