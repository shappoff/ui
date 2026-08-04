"use client";

import { useEffect, useState } from "react";
import type { TileLayer as LeafletTileLayer } from "leaflet";
import { useMap } from "react-leaflet";

import type { MapCompareMode, TileLayerId } from "../../maps";

import { BasemapTileLayer } from "./BasemapTileLayer";

export type MapCompareLayersProps = {
  baseId: TileLayerId;
  overlayId: TileLayerId;
  mode: MapCompareMode;
  opacity: number;
  /** 0–1 horizontal split; used in side-by-side mode. */
  split: number;
};

function clipTileLayers(
  map: ReturnType<typeof useMap>,
  left: LeafletTileLayer | null,
  right: LeafletTileLayer | null,
  split: number,
) {
  const leftEl = left?.getContainer();
  const rightEl = right?.getContainer();
  if (!leftEl || !rightEl) {
    return;
  }

  const size = map.getSize();
  const nw = map.containerPointToLayerPoint([0, 0]);
  const se = map.containerPointToLayerPoint(size);
  const clipX = nw.x + size.x * split;

  leftEl.style.clip = `rect(${nw.y}px, ${clipX}px, ${se.y}px, ${nw.x}px)`;
  rightEl.style.clip = `rect(${nw.y}px, ${se.x}px, ${se.y}px, ${clipX}px)`;
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
}: MapCompareLayersProps) {
  const map = useMap();
  const [leftLayer, setLeftLayer] = useState<LeafletTileLayer | null>(null);
  const [rightLayer, setRightLayer] = useState<LeafletTileLayer | null>(null);
  const sameLayer = baseId === overlayId;

  useEffect(() => {
    if (mode !== "side-by-side" || sameLayer) {
      clearClip(leftLayer);
      clearClip(rightLayer);
      return;
    }

    const apply = () => {
      clipTileLayers(map, leftLayer, rightLayer, split);
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
      clearClip(leftLayer);
      clearClip(rightLayer);
    };
  }, [map, mode, split, sameLayer, leftLayer, rightLayer]);

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
        key={`sbs-left-${baseId}`}
        ref={setLeftLayer}
        layerId={baseId}
        zIndex={1}
      />
      {sameLayer ? null : (
        <BasemapTileLayer
          key={`sbs-right-${overlayId}`}
          ref={setRightLayer}
          layerId={overlayId}
          zIndex={2}
        />
      )}
    </>
  );
}
