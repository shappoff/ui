import type { Meta, StoryObj } from "@storybook/react-vite";

import { LeafletMap } from "./LeafletMap";
import { MapMarkerLayer } from "./MapMarkerLayer";
import { BELARUS_CITY_MARKERS } from "./map-story-fixtures";

const markers = BELARUS_CITY_MARKERS.slice(0, 2);

const meta = {
  title: "Map/MapMarkerLayer",
  component: MapMarkerLayer,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Presentational marker list for an existing `MapContainer`. Compose as children of `LeafletMap`.",
      },
    },
  },
  args: {
    markers,
    variant: "primary",
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "accent"],
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: "100%", height: "28rem" }}>
        <LeafletMap ariaLabel="Карта с маркерами">
          <Story />
        </LeafletMap>
      </div>
    ),
  ],
} satisfies Meta<typeof MapMarkerLayer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    variant: "primary",
  },
};

export const Accent: Story = {
  args: {
    variant: "accent",
  },
};

export const Empty: Story = {
  args: {
    markers: [],
  },
};
