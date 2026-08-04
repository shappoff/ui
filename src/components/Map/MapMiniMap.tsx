"use client";

import { useEffect, useRef } from "react";
import { tileLayer } from "leaflet";
import MiniMap from "leaflet-minimap";
import { useMap } from "react-leaflet";

import { getTileLayer, type TileLayerId } from "../../maps";

export type MapMiniMapProps = {
  /** Inset basemap; OSM keeps orientation clear over historical main layers. */
  layerId?: TileLayerId;
  position?: "bottomright" | "bottomleft" | "topright" | "topleft";
  width?: number;
  height?: number;
  /** Mini zoom relative to the main map. Default -5. */
  zoomLevelOffset?: number;
};

/**
 * Orientation inset via leaflet-minimap. Compose as a child of LeafletMap.
 */
export function MapMiniMap({
  layerId = "osm",
  position = "bottomright",
  width = 132,
  height = 132,
  zoomLevelOffset = -5,
}: MapMiniMapProps) {
  const map = useMap();
  const controlRef = useRef<MiniMap | null>(null);
  const tileRef = useRef<ReturnType<typeof tileLayer> | null>(null);

  useEffect(() => {
    const preset = getTileLayer(layerId);
    const tile = tileLayer(preset.url, {
      attribution: preset.attribution,
      maxZoom: preset.maxZoom,
      maxNativeZoom: preset.maxNativeZoom,
      ...(preset.subdomains ? { subdomains: preset.subdomains } : {}),
    });
    tileRef.current = tile;

    const control = new MiniMap(tile, {
      position,
      width,
      height,
      zoomLevelOffset,
      toggleDisplay: false,
      aimingRectOptions: {
        color: "var(--sui-color-primary)",
        weight: 2,
        opacity: 0.9,
        fillOpacity: 0.08,
        interactive: false,
      },
      shadowRectOptions: {
        color: "var(--sui-color-fg)",
        weight: 1,
        opacity: 0,
        fillOpacity: 0,
        interactive: false,
      },
    });
    controlRef.current = control;
    control.addTo(map);

    return () => {
      control.remove();
      controlRef.current = null;
      tileRef.current = null;
    };
  }, [map, position, width, height, zoomLevelOffset]);

  useEffect(() => {
    const control = controlRef.current;
    if (!control) {
      return;
    }

    const preset = getTileLayer(layerId);
    const tile = tileLayer(preset.url, {
      attribution: preset.attribution,
      maxZoom: preset.maxZoom,
      maxNativeZoom: preset.maxNativeZoom,
      ...(preset.subdomains ? { subdomains: preset.subdomains } : {}),
    });
    tileRef.current = tile;
    control.changeLayer(tile);
  }, [layerId]);

  return null;
}
