import { divIcon, type DivIcon } from "leaflet";

import type { MapEdgeDirection, MapMarkerVariant } from "../../maps";

import { EDGE_ARROW_ROTATION, EDGE_DIRECTION_LABEL } from "./map-edge-direction";

const iconCache = new Map<string, DivIcon>();

/**
 * CSS edge / signpost chip — arrow + optional count.
 * Internal helper (not part of the public map API).
 */
export function createEdgeMarkerIcon(
  direction: MapEdgeDirection,
  count: number,
  variant: MapMarkerVariant,
  showCount: boolean,
): DivIcon {
  const cacheKey = `${direction}:${count}:${variant}:${showCount ? 1 : 0}`;
  const cached = iconCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const rotation = EDGE_ARROW_ROTATION[direction];
  const label = EDGE_DIRECTION_LABEL[direction];
  const countHtml = showCount
    ? `<span class="sui-map-edge__count">${count}</span>`
    : "";
  const aria = showCount
    ? `${count} вне экрана на ${label}`
    : `Точки вне экрана на ${label}`;

  const icon = divIcon({
    className: "sui-map-edge__icon",
    html: `<span class="sui-map-edge sui-map-edge--${variant}" role="img" aria-label="${aria}">
      <span class="sui-map-edge__arrow" style="transform:rotate(${rotation}deg)" aria-hidden="true"></span>
      ${countHtml}
    </span>`,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });

  iconCache.set(cacheKey, icon);
  return icon;
}
