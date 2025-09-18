//! Light / dark mode switch

const localStorageTheme = localStorage.getItem("theme");

const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
let theme = localStorageTheme
  ? localStorageTheme
  : prefersDark
    ? "dark"
    : "light";

const themeToggle = document.querySelector(".header__heading__theme-toggle");

const iconClass = "header__heading__theme-toggle__icon";
const moon = `<svg class="${iconClass}" stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="M264 480A232 232 0 0 1 32 248c0-94 54-178.28 137.61-214.67a16 16 0 0 1 21.06 21.06C181.07 76.43 176 104.66 176 136c0 110.28 89.72 200 200 200 31.34 0 59.57-5.07 81.61-14.67a16 16 0 0 1 21.06 21.06C442.28 426 358 480 264 480z"></path></svg>`;
const sun = `<svg class="${iconClass}" stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="M256 118a22 22 0 0 1-22-22V48a22 22 0 0 1 44 0v48a22 22 0 0 1-22 22zm0 368a22 22 0 0 1-22-22v-48a22 22 0 0 1 44 0v48a22 22 0 0 1-22 22zm113.14-321.14a22 22 0 0 1-15.56-37.55l33.94-33.94a22 22 0 0 1 31.11 31.11l-33.94 33.94a21.93 21.93 0 0 1-15.55 6.44zM108.92 425.08a22 22 0 0 1-15.55-37.56l33.94-33.94a22 22 0 1 1 31.11 31.11l-33.94 33.94a21.94 21.94 0 0 1-15.56 6.45zM464 278h-48a22 22 0 0 1 0-44h48a22 22 0 0 1 0 44zm-368 0H48a22 22 0 0 1 0-44h48a22 22 0 0 1 0 44zm307.08 147.08a21.94 21.94 0 0 1-15.56-6.45l-33.94-33.94a22 22 0 0 1 31.11-31.11l33.94 33.94a22 22 0 0 1-15.55 37.56zM142.86 164.86a21.89 21.89 0 0 1-15.55-6.44l-33.94-33.94a22 22 0 0 1 31.11-31.11l33.94 33.94a22 22 0 0 1-15.56 37.55zM256 358a102 102 0 1 1 102-102 102.12 102.12 0 0 1-102 102z"></path></svg>`;

function changeTheme(theme) {
  themeToggle.innerHTML = theme === "dark" ? moon : sun;
  let label =
    theme === "dark" ? "Change to light theme" : "Change to dark theme";
  themeToggle.setAttribute("aria-label", label);
  themeToggle.setAttribute("title", label);
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
}

changeTheme(theme);

themeToggle.addEventListener("click", () => {
  const newTheme = theme === "dark" ? "light" : "dark";
  changeTheme(newTheme);
  theme = newTheme;
});
