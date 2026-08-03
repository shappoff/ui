import { useState, type ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import {
  Drawer,
  DrawerBody,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  type DrawerSnapPoint,
} from "./Drawer";

const meta = {
  title: "Components/Drawer",
  component: Drawer,
  args: {
    onOpenChange: fn(),
  },
  argTypes: {
    swipeDirection: {
      control: "select",
      options: ["down", "up", "left", "right"],
    },
    showSwipeHandle: { control: "boolean" },
    modal: {
      control: "select",
      options: [true, false, "trap-focus"],
    },
    disablePointerDismissal: { control: "boolean" },
  },
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Compound drawer built on Base UI (`@base-ui/react/drawer`), aligned with the shadcn Aria/Base drawer API.",
      },
    },
  },
} satisfies Meta<typeof Drawer>;

export default meta;
type Story = StoryObj<typeof meta>;

function DefaultDrawer(args: ComponentProps<typeof Drawer>) {
  return (
    <Drawer {...args} showSwipeHandle={args.showSwipeHandle ?? true}>
      <DrawerTrigger render={<button type="button" />}>
        Open Drawer
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Confirm action</DrawerTitle>
          <DrawerDescription>
            This action cannot be undone. Review the details before continuing.
          </DrawerDescription>
        </DrawerHeader>
        <DrawerBody>
          Drawer content lives here. Use <code>DrawerBody</code> for scrollable
          regions inside a content-sized panel.
        </DrawerBody>
        <DrawerFooter>
          <button type="button">Continue</button>
          <DrawerClose render={<button type="button" />}>Cancel</DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export const Default: Story = {
  render: (args) => <DefaultDrawer {...args} />,
};

export const FromLeft: Story = {
  args: {
    swipeDirection: "left",
    showSwipeHandle: true,
  },
  render: (args) => <DefaultDrawer {...args} />,
};

export const FromRight: Story = {
  args: {
    swipeDirection: "right",
    showSwipeHandle: true,
  },
  render: (args) => <DefaultDrawer {...args} />,
};

export const NonModal: Story = {
  args: {
    modal: false,
    disablePointerDismissal: true,
    showSwipeHandle: true,
  },
  render: (args) => <DefaultDrawer {...args} />,
};

export const SnapPoints: Story = {
  render: function SnapPointsStory(args) {
    const snapPoints: DrawerSnapPoint[] = [0.3, 0.6, 1];
    const [snapPoint, setSnapPoint] = useState<DrawerSnapPoint | null>(
      snapPoints[0] ?? null,
    );

    return (
      <Drawer
        {...args}
        showSwipeHandle
        snapPoints={snapPoints}
        snapPoint={snapPoint}
        onSnapPointChange={setSnapPoint}
      >
        <DrawerTrigger render={<button type="button" />}>
          Open Snap Drawer
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Snap points</DrawerTitle>
            <DrawerDescription>
              Active snap: {String(snapPoint)}. Drag to move between presets.
            </DrawerDescription>
          </DrawerHeader>
          <DrawerBody>
            {Array.from({ length: 12 }, (_, index) => (
              <p key={index} style={{ margin: "0 0 0.75rem" }}>
                Scrollable sample paragraph {index + 1}. Snap points apply to
                vertical drawers and use fractions of the viewport height.
              </p>
            ))}
          </DrawerBody>
          <DrawerFooter>
            <DrawerClose render={<button type="button" />}>Close</DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  },
};

export const Nested: Story = {
  render: (args) => (
    <Drawer {...args} showSwipeHandle>
      <DrawerTrigger render={<button type="button" />}>
        Open Nested Drawer
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Parent drawer</DrawerTitle>
          <DrawerDescription>
            Open another drawer from inside. Parents stay mounted and stack.
          </DrawerDescription>
        </DrawerHeader>
        <DrawerBody>
          <Drawer showSwipeHandle>
            <DrawerTrigger render={<button type="button" />}>
              Open nested
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Nested drawer</DrawerTitle>
                <DrawerDescription>
                  Swipe down or press Close to return to the parent.
                </DrawerDescription>
              </DrawerHeader>
              <DrawerFooter>
                <DrawerClose render={<button type="button" />}>
                  Close
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </DrawerBody>
        <DrawerFooter>
          <DrawerClose render={<button type="button" />}>
            Close parent
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
};

export const Controlled: Story = {
  render: function ControlledStory(args) {
    const [open, setOpen] = useState(false);

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <button type="button" onClick={() => setOpen(true)}>
          Open controlled
        </button>
        <Drawer
          {...args}
          open={open}
          onOpenChange={setOpen}
          showSwipeHandle
        >
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Controlled drawer</DrawerTitle>
              <DrawerDescription>
                Open state is managed by the parent via open / onOpenChange.
              </DrawerDescription>
            </DrawerHeader>
            <DrawerFooter>
              <button type="button" onClick={() => setOpen(false)}>
                Done
              </button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>
    );
  },
};
