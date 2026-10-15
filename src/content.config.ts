import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projects = defineCollection({
  loader: glob({
    pattern: '**/*.md',
    base: './src/content/projects',
    generateId: ({ entry }) => entry.replace(/\.md$/, ''),
  }),
  schema: ({ image }) =>
    z.object({
      slug: z.string(),
      lang: z.enum(['en', 'es']),
      title: z.string(),
      tagline: z.string(),
      lede: z.string(),
      role: z.string(),
      year: z.string(),
      status: z.string(),
      stack: z.array(z.string()),
      repo: z.string().url().optional(),
      live: z.string().url().optional(),
      image: image(),
      order: z.number(),
      star: z.boolean().default(false),
      description: z.string(),
    }),
});

export const collections = { projects };
