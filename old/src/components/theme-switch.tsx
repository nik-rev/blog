"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeSwitch() {
  const [isMounted, setIsMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  const isDarkTheme = resolvedTheme === "dark";

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const handleClick = () => {
    setTheme(isDarkTheme ? "light" : "dark");
  };

  return (
    <button type="button" onClick={handleClick}>
      {isDarkTheme ? (
        <Moon className="transition-colors hover:text-mauve" />
      ) : (
        <Sun className="transition-colors hover:text-peach" />
      )}
    </button>
  );
}
