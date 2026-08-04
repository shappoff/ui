import type { Meta, StoryObj } from "@storybook/react-vite";

import { LeafletMap } from "./LeafletMap";
import { MapEdgeMarkers } from "./MapEdgeMarkers";
import { MapMarkerLayer } from "./MapMarkerLayer";
import { BELARUS_CITY_MARKERS } from "./map-story-fixtures";

const meta = {
  title: "Map/MapEdgeMarkers",
  component: MapEdgeMarkers,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "EdgeMarker / Signposts-style chips for markers outside the viewport. Zoom into Minsk — other cities appear on the edges; click a chip to fitBounds.",
      },
    },
  },
  args: {
    markers: BELARUS_CITY_MARKERS,
    padding: 28,
    showCount: true,
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
        <LeafletMap
          ariaLabel="Карта с указателями вне экрана"
          center={[53.9, 27.56]}
          zoom={11}
        >
          <MapMarkerLayer markers={BELARUS_CITY_MARKERS} variant="primary" />
          <Story />
        </LeafletMap>
      </div>
    ),
  ],
} satisfies Meta<typeof MapEdgeMarkers>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const AccentWithoutCount: Story = {
  args: {
    variant: "accent",
    showCount: false,
  },
};

export const WidePadding: Story = {
  args: {
    padding: 64,
  },
};
