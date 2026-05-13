import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  site: 'https://www.standard-house.com',
  integrations: [
    react(),
    mdx(),
    sitemap(),
    tailwind(),
  ],
  output: 'static',
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
    },
  },
  vite: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@layouts': path.resolve(__dirname, './src/layouts'),
        '@components': path.resolve(__dirname, './src/components'),
        '@data': path.resolve(__dirname, './src/data'),
      }
    }
  }
});
