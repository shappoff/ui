import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import {
  HISTORICAL_TILE_LAYER_IDS,
  TILE_LAYER_ORDER,
  type MapCompareMode,
  type TileLayerId,
} from "../../maps";

import { LeafletMap } from "./LeafletMap";
import { MapEdgeMarkers } from "./MapEdgeMarkers";
import { MapHeatLayer } from "./MapHeatLayer";
import { MapMarkerLayer } from "./MapMarkerLayer";
import { MapMiniMap } from "./MapMiniMap";
import {
  BELARUS_CITY_MARKERS,
  createBelarusHeatPoints,
} from "./map-story-fixtures";

const sampleMarkers = BELARUS_CITY_MARKERS.slice(0, 3);

const meta = {
  title: "Map/LeafletMap",
  component: LeafletMap,
  parameters: {
    layout: "fullscreen",
  },
  args: {
    ariaLabel: "Карта Беларуси",
    basemap: "osm",
    onBasemapChange: fn(),
  },
  argTypes: {
    basemap: {
      control: "select",
      options: TILE_LAYER_ORDER,
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: "100%", height: "28rem" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof LeafletMap>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithMarkers: Story = {
  render: (args) => (
    <LeafletMap {...args}>
      <MapMarkerLayer markers={sampleMarkers} variant="primary" />
    </LeafletMap>
  ),
};

export const AccentMarkers: Story = {
  render: (args) => (
    <LeafletMap {...args} basemap="pgm">
      <MapMarkerLayer markers={sampleMarkers} variant="accent" />
    </LeafletMap>
  ),
};

export const CompareOpacity: Story = {
  args: {
    basemap: "osm",
    compare: {
      overlay: "pgm",
      mode: "opacity",
      opacity: 0.55,
      onOverlayChange: fn(),
      onModeChange: fn(),
      onOpacityChange: fn(),
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          "Modern basemap with a semi-transparent historical overlay (ПГМ). Use the bottom control to change opacity, overlay, or switch to side-by-side.",
      },
    },
  },
};

export const CompareSideBySide: Story = {
  args: {
    basemap: "osm",
    compare: {
      overlay: "verstka1",
      mode: "side-by-side",
      onOverlayChange: fn(),
      onModeChange: fn(),
      onOpacityChange: fn(),
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          "Swipe divider between basemap and historical layer. Desktop (≥40rem): vertical split (left/right). Mobile: horizontal split (top/bottom).",
      },
    },
  },
};

export const CompareInteractive: Story = {
  render: function CompareInteractiveStory(args) {
    const [overlay, setOverlay] = useState<TileLayerId>("rkka");
    const [mode, setMode] = useState<MapCompareMode>("opacity");
    const [opacity, setOpacity] = useState(0.6);

    return (
      <LeafletMap
        {...args}
        basemap="googleSat"
        compare={{
          overlay,
          mode,
          opacity,
          onOverlayChange: (id) => {
            setOverlay(id);
            args.compare?.onOverlayChange?.(id);
          },
          onModeChange: (next) => {
            setMode(next);
            args.compare?.onModeChange?.(next);
          },
          onOpacityChange: (next) => {
            setOpacity(next);
            args.compare?.onOpacityChange?.(next);
          },
        }}
      >
        <MapMarkerLayer markers={sampleMarkers} variant="accent" />
      </LeafletMap>
    );
  },
  args: {
    compare: {
      overlay: "rkka",
      mode: "opacity",
      opacity: 0.6,
      onOverlayChange: fn(),
      onModeChange: fn(),
      onOpacityChange: fn(),
    },
  },
  argTypes: {
    compare: { control: false },
  },
  parameters: {
    docs: {
      description: {
        story: `Fully interactive compare over satellite imagery. Historical options: ${HISTORICAL_TILE_LAYER_IDS.join(", ")}.`,
      },
    },
  },
};

export const HeatMiniMapAndEdges: Story = {
  render: (args) => (
    <LeafletMap {...args} center={[53.9, 27.56]} zoom={10}>
      <MapHeatLayer points={createBelarusHeatPoints()} radius={26} blur={16} />
      <MapMarkerLayer markers={BELARUS_CITY_MARKERS} />
      <MapEdgeMarkers markers={BELARUS_CITY_MARKERS} />
      <MapMiniMap />
    </LeafletMap>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Composition demo: heatmap + markers + edge signposts + minimap. Zoom/pan to see off-screen chips and the inset.",
      },
    },
  },
};
