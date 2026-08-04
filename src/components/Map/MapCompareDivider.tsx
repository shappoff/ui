"use client";

import { useCallback, useRef } from "react";

export type MapCompareDividerProps = {
  /** 0–1 position from the left edge. */
  value: number;
  onChange: (value: number) => void;
};

/**
 * Draggable vertical swipe handle for side-by-side basemap compare.
 * Sits over the map canvas (outside Leaflet panes).
 */
export function MapCompareDivider({ value, onChange }: MapCompareDividerProps) {
  const dragging = useRef(false);

  const setFromClientX = useCallback(
    (clientX: number, target: HTMLElement) => {
      const root = target.closest(".sui-map");
      if (!(root instanceof HTMLElement)) {
        return;
      }
      const rect = root.getBoundingClientRect();
      if (rect.width <= 0) {
        return;
      }
      const next = Math.min(0.92, Math.max(0.08, (clientX - rect.left) / rect.width));
      onChange(next);
    },
    [onChange],
  );

  return (
    <div
      className="sui-map__compare-divider"
      style={{ left: `${value * 100}%` }}
      role="slider"
      aria-label="Граница сравнения слоёв"
      aria-valuemin={8}
      aria-valuemax={92}
      aria-valuenow={Math.round(value * 100)}
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          onChange(Math.max(0.08, value - 0.02));
        } else if (event.key === "ArrowRight") {
          event.preventDefault();
          onChange(Math.min(0.92, value + 0.02));
        }
      }}
      onPointerDown={(event) => {
        dragging.current = true;
        event.currentTarget.setPointerCapture(event.pointerId);
        setFromClientX(event.clientX, event.currentTarget);
      }}
      onPointerMove={(event) => {
        if (!dragging.current) {
          return;
        }
        setFromClientX(event.clientX, event.currentTarget);
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
