import type { Meta, StoryObj } from "@storybook/react-vite";

import { Badge } from "./Badge";

const meta = {
  title: "Components/Badge",
  component: Badge,
  args: {
    children: "Badge",
  },
  argTypes: {
    tone: {
      control: "select",
      options: ["neutral", "success", "warning"],
    },
    children: { control: "text" },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Neutral: Story = {
  args: {
    tone: "neutral",
  },
};

export const Success: Story = {
  args: {
    tone: "success",
    children: "Active",
  },
};

export const Warning: Story = {
  args: {
    tone: "warning",
    children: "Pending",
  },
};

export const AllTones: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
      <Badge {...args} tone="neutral">
        Neutral
      </Badge>
      <Badge {...args} tone="success">
        Success
      </Badge>
      <Badge {...args} tone="warning">
        Warning
      </Badge>
    </div>
  ),
};
