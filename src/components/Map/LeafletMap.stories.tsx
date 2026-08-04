import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { TILE_LAYER_ORDER, type MapMarker } from "../../maps";

import { LeafletMap } from "./LeafletMap";
import { MapMarkerLayer } from "./MapMarkerLayer";

const sampleMarkers: MapMarker[] = [
  {
    id: "minsk",
    lat: 53.9,
    lng: 27.56,
    title: "Минск",
    description: "Столица Беларуси",
  },
  {
    id: "brest",
    lat: 52.0976,
    lng: 23.7341,
    title: "Брест",
  },
  {
    id: "gomel",
    lat: 52.4412,
    lng: 30.9878,
    title: "Гомель",
    description: "Областной центр",
  },
];

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
