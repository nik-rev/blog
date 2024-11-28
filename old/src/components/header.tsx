import Link from "next/link";

import { ThemeSwitch } from "./theme-switch";

export function Logo() {
  return (
    <span className="text-2xl font-bold text-accent [word-spacing:2px]">
      Nikita Revenco
    </span>
  );
}

export function Header() {
  return (
    <header className="flex justify-center bg-mantle px-4 py-12">
      <span className="align-center flex w-full max-w-article justify-between">
        <Link href="/">
          <Logo />
        </Link>
        <ThemeSwitch />
      </span>
    </header>
  );
}
