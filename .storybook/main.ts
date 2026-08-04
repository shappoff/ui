import type { StorybookConfig } from "@storybook/react-vite";

/**
 * Repo name on GitHub Pages project site: https://shappoff.github.io/ui/
 * Override with STORYBOOK_BASE_PATH for other hosts.
 */
const productionBase = process.env.STORYBOOK_BASE_PATH ?? "/ui/";

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@chromatic-com/storybook",
    "@storybook/addon-vitest",
    "@storybook/addon-a11y",
    "@storybook/addon-docs",
    "@storybook/addon-mcp",
  ],
  framework: "@storybook/react-vite",
  docs: {
    defaultName: "Docs",
  },
  async viteFinal(config, { configType }) {
    const { mergeConfig } = await import("vite");

    return mergeConfig(config, {
      // Project Pages need a non-root base; relative "./" also works but
      // absolute repo path keeps deep story URLs stable.
      base: configType === "PRODUCTION" ? productionBase : config.base,
      optimizeDeps: {
        include: ["leaflet", "leaflet.heat", "leaflet-minimap"],
      },
    });
  },
};

export default config;
