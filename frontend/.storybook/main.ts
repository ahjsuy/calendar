import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: ["../src/components/stories/*.stories.@(js|jsx|ts|tsx|mdx)"],
  addons: [
    // "@storybook/addon-links",
    // "@storybook/addon-essentials",
    // "@storybook/addon-interactions",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  core: {
    builder: "@storybook/builder-vite",
  },
  viteFinal: async (viteConfig) => {
    return {
      ...viteConfig,
      esbuild: {
        ...viteConfig.esbuild,
        jsx: "automatic", // ✅ use new JSX transform
      },
    };
  },
};

export default config;
