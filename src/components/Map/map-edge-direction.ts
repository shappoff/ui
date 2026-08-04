import type { Map as LeafletMap } from "leaflet";

import type { MapEdgeDirection, MapMarker } from "../../maps";

export type MapEdgeBucket = {
  direction: MapEdgeDirection;
  markers: MapMarker[];
};

const DIRECTIONS = [
  "e",
  "ne",
  "n",
  "nw",
  "w",
  "sw",
  "s",
  "se",
] as const satisfies readonly MapEdgeDirection[];

/** Degrees clockwise from east → compass octant. */
export function angleToEdgeDirection(degreesFromEast: number): MapEdgeDirection {
  const normalized = ((degreesFromEast % 360) + 360) % 360;
  const index = Math.round(normalized / 45) % 8;
  return DIRECTIONS[index] ?? "e";
}

export function isMarkerOutsideView(
  map: LeafletMap,
  marker: MapMarker,
  paddingPx: number,
): boolean {
  const point = map.latLngToContainerPoint([marker.lat, marker.lng]);
  const size = map.getSize();
  return (
    point.x < paddingPx ||
    point.y < paddingPx ||
    point.x > size.x - paddingPx ||
    point.y > size.y - paddingPx
  );
}

/**
 * Groups off-screen markers into Signposts-style octants around the view center.
 */
export function groupMarkersByEdge(
  map: LeafletMap,
  markers: readonly MapMarker[],
  paddingPx: number,
): MapEdgeBucket[] {
  const center = map.getCenter();
  const buckets = new Map<MapEdgeDirection, MapMarker[]>();

  for (const marker of markers) {
    if (!isMarkerOutsideView(map, marker, paddingPx)) {
      continue;
    }

    const degreesFromEast =
      (Math.atan2(marker.lat - center.lat, marker.lng - center.lng) * 180) /
      Math.PI;
    const direction = angleToEdgeDirection(degreesFromEast);
    const list = buckets.get(direction);
    if (list) {
      list.push(marker);
    } else {
      buckets.set(direction, [marker]);
    }
  }

  return DIRECTIONS.flatMap((direction) => {
    const list = buckets.get(direction);
    return list?.length ? [{ direction, markers: list }] : [];
  });
}

/** Container pixel for an edge/corner indicator (Signposts mid-edge layout). */
export function edgeAnchorPoint(
  map: LeafletMap,
  direction: MapEdgeDirection,
  paddingPx: number,
): { x: number; y: number } {
  const size = map.getSize();
  const xMid = size.x / 2;
  const yMid = size.y / 2;
  const xMax = size.x - paddingPx;
  const yMax = size.y - paddingPx;

  switch (direction) {
    case "n":
      return { x: xMid, y: paddingPx };
    case "ne":
      return { x: xMax, y: paddingPx };
    case "e":
      return { x: xMax, y: yMid };
    case "se":
      return { x: xMax, y: yMax };
    case "s":
      return { x: xMid, y: yMax };
    case "sw":
      return { x: paddingPx, y: yMax };
    case "w":
      return { x: paddingPx, y: yMid };
    case "nw":
      return { x: paddingPx, y: paddingPx };
  }
}

/** Arrow rotation in degrees (0 = up / north). */
export const EDGE_ARROW_ROTATION: Record<MapEdgeDirection, number> = {
  n: 0,
  ne: 45,
  e: 90,
  se: 135,
  s: 180,
  sw: 225,
  w: 270,
  nw: 315,
};

export const EDGE_DIRECTION_LABEL: Record<MapEdgeDirection, string> = {
  n: "север",
  ne: "северо-восток",
  e: "восток",
  se: "юго-восток",
  s: "юг",
  sw: "юго-запад",
  w: "запад",
  nw: "северо-запад",
};
