import type { Meta, StoryObj } from "@storybook/react-vite";

import { MapSkeleton } from "./MapSkeleton";

const meta = {
  title: "Map/MapSkeleton",
  component: MapSkeleton,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <div style={{ width: "100%", height: "16rem" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof MapSkeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
