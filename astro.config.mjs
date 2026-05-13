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
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'charts': [
              './src/components/charts/IndustryHeatmap.tsx',
              './src/components/charts/RiskRadarChart.tsx',
              './src/components/charts/DebtPieChart.tsx',
              './src/components/charts/GdpTrendChart.tsx',
              './src/components/charts/ExchangeRateChart.tsx',
              './src/components/charts/CostComparisonChart.tsx',
              './src/components/charts/CityComparisonChart.tsx',
              './src/components/charts/IndustryScatterChart.tsx',
              './src/components/charts/AutoChart.tsx'
            ],
            'maps': [
              './src/components/IndustryMap.tsx',
              './src/components/CountryMap.tsx',
              './src/components/CountryRelationGraph.tsx',
              './src/components/EthiopiaMap.tsx',
              './src/components/EthiopiaMapDetail.tsx'
            ],
            'ai': [
              './src/components/AIChatWidget.tsx',
              './src/components/AIContextProvider.tsx',
              './src/components/AIProviderLayout.tsx',
              './src/components/CozeChat.tsx',
              './src/components/AIInsightButton.tsx',
              './src/components/AIDataTooltip.tsx',
              './src/components/AIQuickAsk.tsx'
            ]
          }
        }
      }
    }
  }
});
