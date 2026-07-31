"use client";

import {
  TILE_LAYER_ORDER,
  TILE_LAYERS,
  type TileLayerId,
} from "../../maps";

type BasemapSwitcherProps = {
  value: TileLayerId;
  onChange: (id: TileLayerId) => void;
};

function isTileLayerId(value: string): value is TileLayerId {
  return (TILE_LAYER_ORDER as string[]).includes(value);
}

/**
 * Compact basemap picker — sits above the map canvas, outside Leaflet panes.
 * Internal to LeafletMap (not part of the public map API).
 */
export function BasemapSwitcher({ value, onChange }: BasemapSwitcherProps) {
  return (
    <label className="sui-map__switcher">
      <span className="sui-map__switcher-label">Карта</span>
      <select
        className="sui-map__switcher-select"
        value={value}
        aria-label="Слой карты"
        onChange={(event) => {
          const next = event.target.value;
          if (!isTileLayerId(next)) {
            return;
          }
          onChange(next);
        }}
      >
        {TILE_LAYER_ORDER.map((id) => (
          <option key={id} value={id}>
            {TILE_LAYERS[id].label}
          </option>
        ))}
      </select>
    </label>
  );
}
