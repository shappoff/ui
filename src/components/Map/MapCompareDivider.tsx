"use client";

import { useCallback, useRef } from "react";

import type { MapCompareSplitOrientation } from "../../maps";

export type MapCompareDividerProps = {
  /** 0–1 position from the start edge (left or top). */
  value: number;
  onChange: (value: number) => void;
  orientation: MapCompareSplitOrientation;
};

const SPLIT_MIN = 0.08;
const SPLIT_MAX = 0.92;
const SPLIT_STEP = 0.02;

/**
 * Draggable swipe handle for side-by-side basemap compare.
 * Vertical divider on desktop; horizontal on narrow viewports.
 * Sits over the map canvas (outside Leaflet panes).
 */
export function MapCompareDivider({
  value,
  onChange,
  orientation,
}: MapCompareDividerProps) {
  const dragging = useRef(false);
  const isHorizontal = orientation === "horizontal";

  const setFromPointer = useCallback(
    (clientX: number, clientY: number, target: HTMLElement) => {
      const root = target.closest(".sui-map");
      if (!(root instanceof HTMLElement)) {
        return;
      }
      const rect = root.getBoundingClientRect();
      if (isHorizontal) {
        if (rect.height <= 0) {
          return;
        }
        const next = Math.min(
          SPLIT_MAX,
          Math.max(SPLIT_MIN, (clientY - rect.top) / rect.height),
        );
        onChange(next);
        return;
      }
      if (rect.width <= 0) {
        return;
      }
      const next = Math.min(
        SPLIT_MAX,
        Math.max(SPLIT_MIN, (clientX - rect.left) / rect.width),
      );
      onChange(next);
    },
    [isHorizontal, onChange],
  );

  return (
    <div
      className="sui-map__compare-divider"
      data-orientation={orientation}
      style={
        isHorizontal
          ? { top: `${value * 100}%` }
          : { left: `${value * 100}%` }
      }
      role="slider"
      aria-label="Граница сравнения слоёв"
      aria-orientation={isHorizontal ? "vertical" : "horizontal"}
      aria-valuemin={Math.round(SPLIT_MIN * 100)}
      aria-valuemax={Math.round(SPLIT_MAX * 100)}
      aria-valuenow={Math.round(value * 100)}
      tabIndex={0}
      onKeyDown={(event) => {
        if (isHorizontal) {
          if (event.key === "ArrowUp") {
            event.preventDefault();
            onChange(Math.max(SPLIT_MIN, value - SPLIT_STEP));
          } else if (event.key === "ArrowDown") {
            event.preventDefault();
            onChange(Math.min(SPLIT_MAX, value + SPLIT_STEP));
          }
          return;
        }
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          onChange(Math.max(SPLIT_MIN, value - SPLIT_STEP));
        } else if (event.key === "ArrowRight") {
          event.preventDefault();
          onChange(Math.min(SPLIT_MAX, value + SPLIT_STEP));
        }
      }}
      onPointerDown={(event) => {
        dragging.current = true;
        event.currentTarget.setPointerCapture(event.pointerId);
        setFromPointer(event.clientX, event.clientY, event.currentTarget);
      }}
      onPointerMove={(event) => {
        if (!dragging.current) {
          return;
        }
        setFromPointer(event.clientX, event.clientY, event.currentTarget);
      }}
      onPointerUp={(event) => {
        dragging.current = false;
        event.currentTarget.releasePointerCapture(event.pointerId);
      }}
      onPointerCancel={() => {
        dragging.current = false;
      }}
    >
      <span className="sui-map__compare-divider-thumb" aria-hidden />
    </div>
  );
}
