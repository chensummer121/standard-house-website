import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const countriesCollection = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/countries' }),
  schema: z.object({
    title: z.string(),
    section: z.enum(['decision', 'insight', 'industry', 'toolkit', 'archive']),
    subsection: z.string(),
    country: z.string(),
    score: z.number().optional(),
  }),
});

export const collections = {
  'countries': countriesCollection,
};
