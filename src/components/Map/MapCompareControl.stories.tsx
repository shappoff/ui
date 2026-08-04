import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import {
  HISTORICAL_TILE_LAYER_IDS,
  type MapCompareMode,
  type TileLayerId,
} from "../../maps";

import { MapCompareControl } from "./MapCompareControl";

const meta = {
  title: "Map/MapCompareControl",
  component: MapCompareControl,
  args: {
    overlay: "pgm",
    mode: "opacity",
    opacity: 0.55,
    onOverlayChange: fn(),
    onModeChange: fn(),
    onOpacityChange: fn(),
  },
  argTypes: {
    overlay: {
      control: "select",
      options: [...HISTORICAL_TILE_LAYER_IDS],
    },
    mode: {
      control: "inline-radio",
      options: ["opacity", "side-by-side"],
    },
    opacity: {
      control: { type: "range", min: 0, max: 1, step: 0.01 },
    },
  },
  decorators: [
    (Story) => (
      <div
        className="sui-map"
        style={{
          position: "relative",
          width: "min(100%, 28rem)",
          height: "10rem",
          background:
            "color-mix(in srgb, var(--sui-color-border) 35%, var(--sui-color-bg))",
        }}
      >
        <Story />
      </div>
    ),
  ],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Chrome for historical basemap compare: mode toggle, overlay picker, opacity slider. On viewports under 40rem, collapsed behind «Сравнить карты».",
      },
    },
  },
} satisfies Meta<typeof MapCompareControl>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const SideBySideMode: Story = {
  args: {
    mode: "side-by-side",
  },
};

export const Interactive: Story = {
  render: function InteractiveMapCompareControl(args) {
    const [overlay, setOverlay] = useState<TileLayerId>(args.overlay);
    const [mode, setMode] = useState<MapCompareMode>(args.mode);
    const [opacity, setOpacity] = useState(args.opacity);

    return (
      <MapCompareControl
        {...args}
        overlay={overlay}
        mode={mode}
        opacity={opacity}
        onOverlayChange={(id) => {
          setOverlay(id);
          args.onOverlayChange(id);
        }}
        onModeChange={(next) => {
          setMode(next);
          args.onModeChange(next);
        }}
        onOpacityChange={(next) => {
          setOpacity(next);
          args.onOpacityChange(next);
        }}
      />
    );
  },
};
