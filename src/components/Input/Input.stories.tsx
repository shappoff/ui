import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { Input } from "./Input";

const meta = {
  title: "Components/Input",
  component: Input,
  args: {
    label: "Email",
    placeholder: "you@example.com",
    onChange: fn(),
  },
  argTypes: {
    label: { control: "text" },
    error: { control: "text" },
    disabled: { control: "boolean" },
    placeholder: { control: "text" },
  },
  decorators: [
    (Story) => (
      <div style={{ width: "min(100%, 20rem)" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithValue: Story = {
  args: {
    defaultValue: "hello@shappoff.dev",
  },
};

export const WithError: Story = {
  args: {
    error: "Enter a valid email address",
    defaultValue: "not-an-email",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    defaultValue: "locked@example.com",
  },
};

export const WithoutLabel: Story = {
  args: {
    label: undefined,
    "aria-label": "Search",
    placeholder: "Search…",
  },
};
