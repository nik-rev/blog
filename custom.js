const emailButton = document.getElementById(
  "obfuscated-email-copy-to-clipboard",
);

if (emailButton) {
  const obfuscatedEmail = emailButton.querySelector("#obfuscated-email");
  const user = obfuscatedEmail
    .getAttribute("data-user")
    .split("")
    .reverse()
    .join("");
  const website = obfuscatedEmail
    .getAttribute("data-website")
    .split("")
    .reverse()
    .join("");
  const email = `${user}@${website}`;
  emailButton.addEventListener("click", () => {
    navigator.clipboard.writeText(email);
    emailButton.classList.add("copied");
    setTimeout(() => {
      emailButton.classList.remove("copied");
    }, 1000);
  });
}
