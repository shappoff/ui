import { divIcon, type DivIcon } from "leaflet";

import type { MapMarkerVariant } from "../../maps";

const VARIANT_CLASS: Record<MapMarkerVariant, string> = {
  primary: "sui-map-marker__pin--primary",
  accent: "sui-map-marker__pin--accent",
};

const iconCache = new Map<MapMarkerVariant, DivIcon>();

/**
 * CSS pin icon — avoids broken default Leaflet PNG paths under bundlers.
 * Internal helper (not part of the public map API).
 */
export function createMapMarkerIcon(variant: MapMarkerVariant): DivIcon {
  const cached = iconCache.get(variant);
  if (cached) {
    return cached;
  }

  const icon = divIcon({
    className: "sui-map-marker__icon",
    html: `<span class="sui-map-marker__pin ${VARIANT_CLASS[variant]}"></span>`,
    iconSize: [28, 36],
    iconAnchor: [14, 34],
    popupAnchor: [0, -28],
  });

  iconCache.set(variant, icon);
  return icon;
}
