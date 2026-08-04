"use client";

import { useEffect, useState } from "react";
import { latLngBounds } from "leaflet";
import { Marker, useMap, useMapEvents } from "react-leaflet";

import type { MapEdgeDirection, MapMarker, MapMarkerVariant } from "../../maps";

import { createEdgeMarkerIcon } from "./create-edge-marker-icon";
import {
  edgeAnchorPoint,
  groupMarkersByEdge,
  type MapEdgeBucket,
} from "./map-edge-direction";

export type MapEdgeMarkersProps = {
  markers: readonly MapMarker[];
  /** Inset from viewport edges when detecting off-screen points. Default 28. */
  padding?: number;
  /** Signposts-style count badge. Default true. */
  showCount?: boolean;
  variant?: MapMarkerVariant;
  /** Override default fitBounds navigation. */
  onEdgeClick?: (
    markers: readonly MapMarker[],
    direction: MapEdgeDirection,
  ) => void;
};

/**
 * EdgeMarker + Signposts UX: octant chips for markers outside the viewport.
 * Pure Leaflet/react-leaflet — no third-party EdgeMarker/Signposts packages
 * (those need Turf / PNG assets and are unmaintained for React composition).
 */
export function MapEdgeMarkers({
  markers,
  padding = 28,
  showCount = true,
  variant = "primary",
  onEdgeClick,
}: MapEdgeMarkersProps) {
  const map = useMap();
  const [buckets, setBuckets] = useState<MapEdgeBucket[]>([]);

  useEffect(() => {
    setBuckets(groupMarkersByEdge(map, markers, padding));
  }, [map, markers, padding]);

  useMapEvents({
    move() {
      setBuckets(groupMarkersByEdge(map, markers, padding));
    },
    moveend() {
      setBuckets(groupMarkersByEdge(map, markers, padding));
    },
    zoom() {
      setBuckets(groupMarkersByEdge(map, markers, padding));
    },
    zoomend() {
      setBuckets(groupMarkersByEdge(map, markers, padding));
    },
    resize() {
      setBuckets(groupMarkersByEdge(map, markers, padding));
    },
  });

  return (
    <>
      {buckets.map((bucket) => {
        const anchor = edgeAnchorPoint(map, bucket.direction, padding);
        const position = map.containerPointToLatLng([anchor.x, anchor.y]);

        return (
          <Marker
            key={bucket.direction}
            position={position}
            interactive
            keyboard
            zIndexOffset={600}
            icon={createEdgeMarkerIcon(
              bucket.direction,
              bucket.markers.length,
              variant,
              showCount,
            )}
            eventHandlers={{
              click: () => {
                if (onEdgeClick) {
                  onEdgeClick(bucket.markers, bucket.direction);
                  return;
                }
                const bounds = latLngBounds(
                  bucket.markers.map((marker) => [marker.lat, marker.lng]),
                );
                map.fitBounds(bounds, {
                  padding: [48, 48],
                  maxZoom: 11,
                  animate: true,
                });
              },
            }}
          />
        );
      })}
    </>
  );
}
