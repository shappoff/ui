"use client";

import { useEffect, useId, useState } from "react";

import {
  HISTORICAL_TILE_LAYER_IDS,
  TILE_LAYERS,
  type MapCompareMode,
  type TileLayerId,
} from "../../maps";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../Drawer";

import { useCompareWideViewport } from "./useCompareWideViewport";

export type MapCompareControlProps = {
  overlay: TileLayerId;
  mode: MapCompareMode;
  opacity: number;
  onOverlayChange: (id: TileLayerId) => void;
  onModeChange: (mode: MapCompareMode) => void;
  onOpacityChange: (opacity: number) => void;
  /** Layers offered in the overlay picker. Defaults to historical presets. */
  overlayOptions?: readonly TileLayerId[];
};

/**
 * Compare chrome: mode toggle, overlay picker, opacity slider.
 * On narrow viewports, collapsed behind «Сравнить карты»; expands with a slide.
 * Positioned over the map shell (outside Leaflet panes).
 */
export function MapCompareControl({
  overlay,
  mode,
  opacity,
  onOverlayChange,
  onModeChange,
  onOpacityChange,
  overlayOptions = HISTORICAL_TILE_LAYER_IDS,
}: MapCompareControlProps) {
  const panelId = useId();
  const [overlayPickerOpen, setOverlayPickerOpen] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const isWide = useCompareWideViewport();

  const overlayLabel = TILE_LAYERS[overlay].label;
  const opacityPercent = Math.round(opacity * 100);
  const panelVisible = isWide || panelOpen;

  useEffect(() => {
    if (!panelOpen || isWide || overlayPickerOpen) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setPanelOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [panelOpen, isWide, overlayPickerOpen]);

  return (
    <div
      className="sui-map__compare"
      data-expanded={panelOpen ? "" : undefined}
    >
      <div className="sui-map__compare-panel-slot">
        <div className="sui-map__compare-panel-slot-inner">
          <div
            id={panelId}
            className="sui-map__compare-panel"
            role="group"
            aria-label="Настройки сравнения карт"
            aria-hidden={!panelVisible}
            inert={!panelVisible}
          >
            <div
              className="sui-map__compare-modes"
              role="group"
              aria-label="Режим сравнения"
            >
              <button
                type="button"
                className={[
                  "sui-map__compare-mode",
                  mode === "opacity" && "sui-map__compare-mode--active",
                ]
                  .filter(Boolean)
                  .join(" ")}
                aria-pressed={mode === "opacity"}
                onClick={() => onModeChange("opacity")}
              >
                Прозрачность
              </button>
              <button
                type="button"
                className={[
                  "sui-map__compare-mode",
                  mode === "side-by-side" && "sui-map__compare-mode--active",
                ]
                  .filter(Boolean)
                  .join(" ")}
                aria-pressed={mode === "side-by-side"}
                onClick={() => onModeChange("side-by-side")}
              >
                Рядом
              </button>
            </div>

            <Drawer
              open={overlayPickerOpen}
              onOpenChange={setOverlayPickerOpen}
              showSwipeHandle
            >
              <DrawerTrigger
                className="sui-map__compare-overlay-trigger"
                aria-label="Исторический слой"
              >
                <span className="sui-map__compare-overlay-value">
                  {overlayLabel}
                </span>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>Исторический слой</DrawerTitle>
                </DrawerHeader>
                <DrawerBody className="sui-map__switcher-options">
                  {overlayOptions.map((id) => {
                    const selected = id === overlay;
                    return (
                      <button
                        key={id}
                        type="button"
                        className={[
                          "sui-map__switcher-option",
                          selected && "sui-map__switcher-option--selected",
                        ]
                          .filter(Boolean)
                          .join(" ")}
                        aria-pressed={selected}
                        onClick={() => {
                          onOverlayChange(id);
                          setOverlayPickerOpen(false);
                        }}
                      >
                        {TILE_LAYERS[id].label}
                      </button>
                    );
                  })}
                </DrawerBody>
              </DrawerContent>
            </Drawer>

            {mode === "opacity" ? (
              <label className="sui-map__compare-opacity">
                <span className="sui-map__compare-opacity-label">
                  {opacityPercent}%
                </span>
                <input
                  type="range"
                  className="sui-map__compare-opacity-input"
                  min={0}
                  max={100}
                  step={1}
                  value={opacityPercent}
                  aria-label="Прозрачность исторического слоя"
                  onChange={(event) => {
                    onOpacityChange(Number(event.target.value) / 100);
                  }}
                />
              </label>
            ) : null}
          </div>
        </div>
      </div>

      <button
        type="button"
        className="sui-map__compare-toggle"
        aria-expanded={panelVisible}
        aria-controls={panelId}
        hidden={isWide}
        onClick={() => setPanelOpen((value) => !value)}
      >
        Сравнить карты
      </button>
    </div>
  );
}
