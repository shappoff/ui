import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import type { TileLayerId } from "../../maps";

import { BasemapSwitcher } from "./BasemapSwitcher";

const meta = {
  title: "Map/BasemapSwitcher",
  component: BasemapSwitcher,
  args: {
    value: "osm",
    onChange: fn(),
  },
  argTypes: {
    value: {
      control: "select",
      options: ["osm", "pgm", "verstka1", "verstka2", "rkka", "google"],
    },
  },
  decorators: [
    (Story) => (
      <div
        style={{
          position: "relative",
          width: "min(100%, 24rem)",
          height: "4rem",
          background:
            "color-mix(in srgb, var(--sui-color-border) 35%, var(--sui-color-bg))",
        }}
      >
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof BasemapSwitcher>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Interactive: Story = {
  render: function InteractiveBasemapSwitcher(args) {
    const [value, setValue] = useState<TileLayerId>(args.value);

    return (
      <BasemapSwitcher
        {...args}
        value={value}
        onChange={(id) => {
          setValue(id);
          args.onChange(id);
        }}
      />
    );
  },
};
