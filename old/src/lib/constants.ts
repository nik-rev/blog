export const DOMAIN = "nikitarevenco.com";

export const TWITTER = "@nikitarevenco1";

export const NAME = "Nikita Revenco";

export const origin =
  process.env.NODE_ENV === "production"
    ? `https://${DOMAIN}`
    : "localhost:3000";
