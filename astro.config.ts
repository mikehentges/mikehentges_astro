import { defineConfig, fontProviders } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

/**
 * Wrap markdown tables in a scroll container so a wide table scrolls
 * instead of being clipped by the `overflow-x: hidden` on <body>.
 */
function rehypeWrapTables() {
  return (tree: any) => {
    const walk = (node: any) => {
      if (!Array.isArray(node.children)) return;
      node.children = node.children.map((child: any) => {
        walk(child);
        if (child.type === 'element' && child.tagName === 'table') {
          return {
            type: 'element',
            tagName: 'div',
            properties: { className: ['table-wrap'] },
            children: [child],
          };
        }
        return child;
      });
    };
    walk(tree);
  };
}

export default defineConfig({
  site: 'https://hentges.ai',
  output: 'static',

  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Sora',
      cssVariable: '--font-sora',
    },
    {
      provider: fontProviders.fontshare(),
      name: 'Satoshi',
      cssVariable: '--font-satoshi',
    },
    {
      provider: fontProviders.google(),
      name: 'JetBrains Mono',
      cssVariable: '--font-mono',
    },
  ],

  markdown: {
    rehypePlugins: [rehypeWrapTables],
  },

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [sitemap()],
});
