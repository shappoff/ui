"use client";

import { useEffect, useState } from "react";
import type { TileLayer as LeafletTileLayer } from "leaflet";
import { useMap } from "react-leaflet";

import type {
  MapCompareMode,
  MapCompareSplitOrientation,
  TileLayerId,
} from "../../maps";

import { BasemapTileLayer } from "./BasemapTileLayer";

export type MapCompareLayersProps = {
  baseId: TileLayerId;
  overlayId: TileLayerId;
  mode: MapCompareMode;
  opacity: number;
  /** 0–1 split position; used in side-by-side mode. */
  split: number;
  orientation: MapCompareSplitOrientation;
};

function clipTileLayers(
  map: ReturnType<typeof useMap>,
  primary: LeafletTileLayer | null,
  secondary: LeafletTileLayer | null,
  split: number,
  orientation: MapCompareSplitOrientation,
) {
  const primaryEl = primary?.getContainer();
  const secondaryEl = secondary?.getContainer();
  if (!primaryEl || !secondaryEl) {
    return;
  }

  const size = map.getSize();
  const nw = map.containerPointToLayerPoint([0, 0]);
  const se = map.containerPointToLayerPoint(size);

  if (orientation === "horizontal") {
    const clipY = nw.y + size.y * split;
    primaryEl.style.clip = `rect(${nw.y}px, ${se.x}px, ${clipY}px, ${nw.x}px)`;
    secondaryEl.style.clip = `rect(${clipY}px, ${se.x}px, ${se.y}px, ${nw.x}px)`;
    return;
  }

  const clipX = nw.x + size.x * split;
  primaryEl.style.clip = `rect(${nw.y}px, ${clipX}px, ${se.y}px, ${nw.x}px)`;
  secondaryEl.style.clip = `rect(${nw.y}px, ${se.x}px, ${se.y}px, ${clipX}px)`;
}

function clearClip(layer: LeafletTileLayer | null) {
  const el = layer?.getContainer();
  if (el) {
    el.style.clip = "";
  }
}

/**
 * Primary + secondary basemap tiles with opacity or side-by-side clip.
 * Must render inside MapContainer.
 */
export function MapCompareLayers({
  baseId,
  overlayId,
  mode,
  opacity,
  split,
  orientation,
}: MapCompareLayersProps) {
  const map = useMap();
  const [primaryLayer, setPrimaryLayer] = useState<LeafletTileLayer | null>(
    null,
  );
  const [secondaryLayer, setSecondaryLayer] = useState<LeafletTileLayer | null>(
    null,
  );
  const sameLayer = baseId === overlayId;

  useEffect(() => {
    if (mode !== "side-by-side" || sameLayer) {
      clearClip(primaryLayer);
      clearClip(secondaryLayer);
      return;
    }

    const apply = () => {
      clipTileLayers(map, primaryLayer, secondaryLayer, split, orientation);
    };

    apply();
    map.on("move", apply);
    map.on("zoom", apply);
    map.on("zoomend", apply);
    map.on("resize", apply);
    map.on("viewreset", apply);

    return () => {
      map.off("move", apply);
      map.off("zoom", apply);
      map.off("zoomend", apply);
      map.off("resize", apply);
      map.off("viewreset", apply);
      clearClip(primaryLayer);
      clearClip(secondaryLayer);
    };
  }, [map, mode, split, orientation, sameLayer, primaryLayer, secondaryLayer]);

  if (mode === "opacity") {
    return (
      <>
        <BasemapTileLayer key={`base-${baseId}`} layerId={baseId} zIndex={1} />
        {sameLayer ? null : (
          <BasemapTileLayer
            key={`overlay-${overlayId}`}
            layerId={overlayId}
            opacity={opacity}
            zIndex={2}
          />
        )}
      </>
    );
  }

  return (
    <>
      <BasemapTileLayer
        key={`sbs-primary-${baseId}`}
        ref={setPrimaryLayer}
        layerId={baseId}
        zIndex={1}
      />
      {sameLayer ? null : (
        <BasemapTileLayer
          key={`sbs-secondary-${overlayId}`}
          ref={setSecondaryLayer}
          layerId={overlayId}
          zIndex={2}
        />
      )}
    </>
  );
}
