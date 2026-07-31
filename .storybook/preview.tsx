import type { Preview } from "@storybook/react-vite";

import "../src/styles.css";
import "leaflet/dist/leaflet.css";

const preview: Preview = {
  parameters: {
    layout: "centered",
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
      expanded: true,
    },
    docs: {
      toc: true,
    },
    options: {
      storySort: {
        order: ["Components", "Map", "*"],
      },
    },
    a11y: {
      // Fail CI once a11y baselines are green; until then surface in UI only.
      test: "todo",
    },
  },
  tags: ["autodocs"],
};

export default preview;
