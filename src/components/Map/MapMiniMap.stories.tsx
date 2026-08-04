import type { Meta, StoryObj } from "@storybook/react-vite";

import { TILE_LAYER_ORDER } from "../../maps";

import { LeafletMap } from "./LeafletMap";
import { MapMarkerLayer } from "./MapMarkerLayer";
import { MapMiniMap } from "./MapMiniMap";
import { BELARUS_CITY_MARKERS } from "./map-story-fixtures";

const meta = {
  title: "Map/MapMiniMap",
  component: MapMiniMap,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "leaflet-minimap orientation inset. Compose as a child of `LeafletMap`. Defaults to OSM so historical main layers stay readable.",
      },
    },
  },
  args: {
    layerId: "osm",
    position: "bottomright",
    width: 132,
    height: 132,
    zoomLevelOffset: -5,
  },
  argTypes: {
    layerId: {
      control: "select",
      options: TILE_LAYER_ORDER,
    },
    position: {
      control: "select",
      options: ["bottomright", "bottomleft", "topright", "topleft"],
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: "100%", height: "28rem" }}>
        <LeafletMap ariaLabel="Карта с миникартой" basemap="pgm">
          <MapMarkerLayer markers={BELARUS_CITY_MARKERS.slice(0, 3)} />
          <Story />
        </LeafletMap>
      </div>
    ),
  ],
} satisfies Meta<typeof MapMiniMap>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Larger: Story = {
  args: {
    width: 168,
    height: 168,
    zoomLevelOffset: -4,
  },
};

export const SatelliteInset: Story = {
  args: {
    layerId: "googleSat",
  },
};
