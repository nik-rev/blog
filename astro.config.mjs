// @ts-check
// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

import mdx from "@astrojs/mdx";

import expressiveCode from "astro-expressive-code";
import { pluginCollapsibleSections } from "@expressive-code/plugin-collapsible-sections";
import { pluginLineNumbers } from "@expressive-code/plugin-line-numbers";

import starlight from "@astrojs/starlight";

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [expressiveCode({
    themes: ["everforest-dark"],
    plugins: [pluginCollapsibleSections(), pluginLineNumbers()],
    defaultProps: {
      showLineNumbers: false,
    },
  }), mdx(), starlight()],
});