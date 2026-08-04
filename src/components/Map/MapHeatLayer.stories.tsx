import type { Meta, StoryObj } from "@storybook/react-vite";

import { LeafletMap } from "./LeafletMap";
import { MapHeatLayer } from "./MapHeatLayer";
import {
  BELARUS_CITY_MARKERS,
  createBelarusHeatPoints,
} from "./map-story-fixtures";

const heatPoints = createBelarusHeatPoints(BELARUS_CITY_MARKERS);

const meta = {
  title: "Map/MapHeatLayer",
  component: MapHeatLayer,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "leaflet.heat density overlay. Compose as a child of `LeafletMap` with consumer-owned points.",
      },
    },
  },
  args: {
    points: heatPoints,
    radius: 28,
    blur: 18,
    maxZoom: 12,
  },
  decorators: [
    (Story) => (
      <div style={{ width: "100%", height: "28rem" }}>
        <LeafletMap ariaLabel="Теплокарта мест Беларуси">
          <Story />
        </LeafletMap>
      </div>
    ),
  ],
} satisfies Meta<typeof MapHeatLayer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const DenseRadius: Story = {
  args: {
    radius: 40,
    blur: 25,
    maxZoom: 10,
  },
};

export const CustomGradient: Story = {
  args: {
    gradient: {
      0.3: "#1d4ed8",
      0.55: "#22c55e",
      0.75: "#eab308",
      1: "#dc2626",
    },
  },
};
