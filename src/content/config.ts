import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const countries = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/countries' }),
  schema: z.object({
    title: z.string().default('Untitled'),
    section: z.string().default(''),
    subsection: z.string().default(''),
    country: z.string().default(''),
    score: z.number().optional(),
    slug: z.string().optional(),
  }),
});

export const collections = { countries };
