import { defineCollection, z } from "astro:content";

const blog = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    date: z.date(),
  }),
});

const home = defineCollection({
  type: "content",
});

const projects = defineCollection({
  type: "content",
});

export const collections = {
  blog,
  home,
  projects,
};
