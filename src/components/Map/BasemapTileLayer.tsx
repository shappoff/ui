"use client";

import { forwardRef } from "react";
import type { TileLayer as LeafletTileLayer } from "leaflet";
import { TileLayer } from "react-leaflet";

import { getTileLayer, type TileLayerId } from "../../maps";

export type BasemapTileLayerProps = {
  layerId: TileLayerId;
  opacity?: number;
  zIndex?: number;
};

/**
 * Shared XYZ tile layer from TILE_LAYERS presets.
 * Ref exposes the underlying Leaflet TileLayer (e.g. for side-by-side clip).
 */
export const BasemapTileLayer = forwardRef<
  LeafletTileLayer,
  BasemapTileLayerProps
>(function BasemapTileLayer({ layerId, opacity = 1, zIndex }, ref) {
  const tile = getTileLayer(layerId);

  return (
    <TileLayer
      ref={ref}
      url={tile.url}
      attribution={tile.attribution}
      maxZoom={tile.maxZoom}
      maxNativeZoom={tile.maxNativeZoom}
      opacity={opacity}
      zIndex={zIndex}
      {...(tile.subdomains ? { subdomains: tile.subdomains } : {})}
      updateWhenZooming={false}
      updateWhenIdle
      keepBuffer={2}
    />
  );
});
