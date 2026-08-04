"use client";

import { useEffect, useRef } from "react";
import type { HeatLatLngTuple, HeatLayer, HeatMapOptions } from "leaflet";
import { useMap } from "react-leaflet";

import type { MapHeatPoint } from "../../maps";

import { createHeatLayer } from "./create-heat-layer";

export type MapHeatLayerProps = {
  points: readonly MapHeatPoint[];
  radius?: number;
  blur?: number;
  maxZoom?: number;
  minOpacity?: number;
  max?: number;
  gradient?: HeatMapOptions["gradient"];
};

function toHeatLatLngs(points: readonly MapHeatPoint[]): HeatLatLngTuple[] {
  return points.map((point) => [
    point.lat,
    point.lng,
    point.intensity ?? 1,
  ]);
}

/**
 * Density heatmap via leaflet.heat. Compose as a child of LeafletMap.
 * Datasets are owned by the consumer.
 */
export function MapHeatLayer({
  points,
  radius = 25,
  blur = 15,
  maxZoom,
  minOpacity,
  max,
  gradient,
}: MapHeatLayerProps) {
  const map = useMap();
  const layerRef = useRef<HeatLayer | null>(null);
  const pointsRef = useRef(points);
  pointsRef.current = points;

  useEffect(() => {
    let cancelled = false;

    void createHeatLayer(toHeatLatLngs(pointsRef.current), {
      radius,
      blur,
      maxZoom,
      minOpacity,
      max,
      gradient,
    }).then((layer) => {
      if (cancelled) {
        map.removeLayer(layer);
        return;
      }
      layer.setLatLngs(toHeatLatLngs(pointsRef.current));
      layerRef.current = layer;
      map.addLayer(layer);
    });

    return () => {
      cancelled = true;
      const layer = layerRef.current;
      layerRef.current = null;
      if (layer) {
        map.removeLayer(layer);
      }
    };
  }, [map, radius, blur, maxZoom, minOpacity, max, gradient]);

  useEffect(() => {
    layerRef.current?.setLatLngs(toHeatLatLngs(points));
  }, [points]);

  return null;
}
