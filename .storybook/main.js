/** @type { import('@storybook/html-vite').StorybookConfig } */
export default {
  stories: ["../stories/**/*.mdx", "../stories/**/*.stories.js"],
  addons: ["@storybook/addon-docs"],
  framework: { name: "@storybook/html-vite", options: {} },
  // The site's public/ folder is served as-is so /img, /tokens.css and /stays.json resolve like on the live site.
  staticDirs: ["../public"],
  viteFinal: (config) => ({ ...config, publicDir: false }),
};
