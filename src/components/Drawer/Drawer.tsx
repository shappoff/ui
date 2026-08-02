"use client";

import {
  createContext,
  useContext,
  type ComponentProps,
  type ReactNode,
} from "react";
import { Drawer as DrawerPrimitive } from "@base-ui/react/drawer";

export type DrawerSwipeDirection = NonNullable<
  DrawerPrimitive.Root.Props["swipeDirection"]
>;

export type DrawerSnapPoint = NonNullable<
  DrawerPrimitive.Root.Props["snapPoints"]
>[number];

export type DrawerProps = DrawerPrimitive.Root.Props & {
  showSwipeHandle?: boolean;
};

type DrawerContextValue = {
  hasSnapPoints: boolean;
  modal: DrawerPrimitive.Root.Props["modal"];
  showSwipeHandle: boolean;
  swipeDirection: DrawerSwipeDirection;
};

const DrawerContext = createContext<DrawerContextValue | null>(null);

function useDrawerContext() {
  const context = useContext(DrawerContext);

  if (!context) {
    throw new Error("Drawer compound parts must be used within <Drawer>.");
  }

  return context;
}

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function Drawer({
  modal = true,
  showSwipeHandle = false,
  snapPoints,
  swipeDirection = "down",
  ...props
}: DrawerProps) {
  const hasSnapPoints = snapPoints != null && snapPoints.length > 0;

  return (
    <DrawerContext.Provider
      value={{ hasSnapPoints, modal, showSwipeHandle, swipeDirection }}
    >
      <DrawerPrimitive.Root
        data-slot="drawer"
        modal={modal}
        snapPoints={snapPoints}
        swipeDirection={swipeDirection}
        {...props}
      />
    </DrawerContext.Provider>
  );
}

export type DrawerTriggerProps = DrawerPrimitive.Trigger.Props;

export function DrawerTrigger(props: DrawerTriggerProps) {
  return <DrawerPrimitive.Trigger data-slot="drawer-trigger" {...props} />;
}

export type DrawerPortalProps = DrawerPrimitive.Portal.Props;

export function DrawerPortal(props: DrawerPortalProps) {
  return <DrawerPrimitive.Portal data-slot="drawer-portal" {...props} />;
}

export type DrawerCloseProps = DrawerPrimitive.Close.Props;

export function DrawerClose(props: DrawerCloseProps) {
  return <DrawerPrimitive.Close data-slot="drawer-close" {...props} />;
}

export type DrawerOverlayProps = Omit<
  DrawerPrimitive.Backdrop.Props,
  "className"
> & {
  className?: string;
};

export function DrawerOverlay({ className, ...props }: DrawerOverlayProps) {
  return (
    <DrawerPrimitive.Backdrop
      data-slot="drawer-overlay"
      className={cx("sui-drawer-overlay", className)}
      {...props}
    />
  );
}

export type DrawerSwipeHandleProps = ComponentProps<"div">;

export function DrawerSwipeHandle({
  className,
  ...props
}: DrawerSwipeHandleProps) {
  return (
    <div
      data-slot="drawer-swipe-handle"
      aria-hidden="true"
      className={cx("sui-drawer-swipe-handle", className)}
      {...props}
    />
  );
}

export type DrawerContentProps = Omit<
  DrawerPrimitive.Popup.Props,
  "className" | "children"
> & {
  className?: string;
  children?: ReactNode;
};

export function DrawerContent({
  className,
  children,
  ...props
}: DrawerContentProps) {
  const { hasSnapPoints, modal, showSwipeHandle, swipeDirection } =
    useDrawerContext();
  const swipeAxis =
    swipeDirection === "down" || swipeDirection === "up" ? "y" : "x";

  return (
    <DrawerPortal>
      {modal === true ? (
        <DrawerOverlay data-snap-points={hasSnapPoints ? "" : undefined} />
      ) : null}
      <DrawerPrimitive.Viewport
        data-slot="drawer-viewport"
        data-modal={modal}
        className="sui-drawer-viewport"
      >
        <DrawerPrimitive.Popup
          data-slot="drawer-popup"
          data-swipe-axis={swipeAxis}
          data-snap-points={hasSnapPoints ? "" : undefined}
          className={cx("sui-drawer-popup", className)}
          {...props}
        >
          {showSwipeHandle ? <DrawerSwipeHandle /> : null}
          <DrawerPrimitive.Content
            data-slot="drawer-content"
            className="sui-drawer-content"
          >
            {children}
          </DrawerPrimitive.Content>
        </DrawerPrimitive.Popup>
      </DrawerPrimitive.Viewport>
    </DrawerPortal>
  );
}

export type DrawerHeaderProps = ComponentProps<"div">;

export function DrawerHeader({ className, ...props }: DrawerHeaderProps) {
  return (
    <div
      data-slot="drawer-header"
      className={cx("sui-drawer-header", className)}
      {...props}
    />
  );
}

export type DrawerFooterProps = ComponentProps<"div">;

export function DrawerFooter({ className, ...props }: DrawerFooterProps) {
  return (
    <div
      data-slot="drawer-footer"
      className={cx("sui-drawer-footer", className)}
      {...props}
    />
  );
}

export type DrawerBodyProps = ComponentProps<"div">;

export function DrawerBody({ className, ...props }: DrawerBodyProps) {
  return (
    <div
      data-slot="drawer-body"
      className={cx("sui-drawer-body", className)}
      {...props}
    />
  );
}

export type DrawerTitleProps = Omit<
  DrawerPrimitive.Title.Props,
  "className"
> & {
  className?: string;
};

export function DrawerTitle({ className, ...props }: DrawerTitleProps) {
  return (
    <DrawerPrimitive.Title
      data-slot="drawer-title"
      className={cx("sui-drawer-title", className)}
      {...props}
    />
  );
}

export type DrawerDescriptionProps = Omit<
  DrawerPrimitive.Description.Props,
  "className"
> & {
  className?: string;
};

export function DrawerDescription({
  className,
  ...props
}: DrawerDescriptionProps) {
  return (
    <DrawerPrimitive.Description
      data-slot="drawer-description"
      className={cx("sui-drawer-description", className)}
      {...props}
    />
  );
}
