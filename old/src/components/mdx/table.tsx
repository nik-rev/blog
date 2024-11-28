import { type HTMLAttributes } from "react";

export function Table({
  children,
  ...props
}: HTMLAttributes<HTMLTableElement>) {
  return (
    <table className="my-4 w-full md:my-8" {...props}>
      {children}
    </table>
  );
}

export function TableBody({
  children,
  ...props
}: HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody {...props}>{children}</tbody>;
}

export function TableHead({
  children,
  ...props
}: HTMLAttributes<HTMLTableSectionElement>) {
  return <thead {...props}>{children}</thead>;
}

export function TableRow({
  children,
  ...props
}: HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr className="m-0 border-t border-surface0 p-0" {...props}>
      {children}
    </tr>
  );
}

export function TableHeader({
  children,
  ...props
}: HTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className="px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right"
      {...props}
    >
      {children}
    </th>
  );
}

export function TableData({
  children,
  ...props
}: HTMLAttributes<HTMLTableCellElement>) {
  return (
    <td
      className="px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right"
      {...props}
    >
      {children}
    </td>
  );
}
