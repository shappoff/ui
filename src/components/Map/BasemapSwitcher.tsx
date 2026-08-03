"use client";

import { useState } from "react";

import {
  TILE_LAYER_ORDER,
  TILE_LAYERS,
  type TileLayerId,
} from "../../maps";
import { Button } from "../Button";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../Drawer";

type BasemapSwitcherProps = {
  value: TileLayerId;
  onChange: (id: TileLayerId) => void;
};

/**
 * Compact basemap picker — sits above the map canvas, outside Leaflet panes.
 * Opens a Drawer with the full layer list (mobile-friendly).
 * Internal to LeafletMap (not part of the public map API).
 */
export function BasemapSwitcher({ value, onChange }: BasemapSwitcherProps) {
  const [open, setOpen] = useState(false);
  const activeLabel = TILE_LAYERS[value].label;

  return (
    <div className="sui-map__switcher">
      <Drawer open={open} onOpenChange={setOpen} showSwipeHandle>
        <DrawerTrigger
          className="sui-map__switcher-trigger"
          aria-label="Слой карты"
        >
          <span className="sui-map__switcher-label">Карта</span>
          <span className="sui-map__switcher-value">{activeLabel}</span>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Слой карты</DrawerTitle>
          </DrawerHeader>
          <DrawerBody className="sui-map__switcher-options">
            {TILE_LAYER_ORDER.map((id) => {
              const selected = id === value;
              return (
                <Button
                  key={id}
                  type="button"
                  variant={selected ? "primary" : "ghost"}
                  className="sui-map__switcher-option"
                  aria-pressed={selected}
                  onClick={() => {
                    onChange(id);
                    setOpen(false);
                  }}
                >
                  {TILE_LAYERS[id].label}
                </Button>
              );
            })}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
