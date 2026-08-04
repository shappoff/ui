import type { LatLngBoundsExpression, LatLngExpression } from "leaflet";

export type MapViewConfig = {
  center: LatLngExpression;
  zoom: number;
  minZoom: number;
  maxZoom: number;
  maxBounds?: LatLngBoundsExpression;
};

export type TileLayerConfig = {
  url: string;
  label: string;
  attribution: string;
  maxZoom: number;
  maxNativeZoom?: number;
  subdomains?: string[];
};

export type TileLayerId =
  | "osm"
  | "pgm"
  | "verstka1"
  | "verstka2"
  | "rkka"
  | "googleStreet"
  | "googleSat"
  | "googleHybrid"
  | "googleTerrain";

/** Point shown on a map; datasets are owned by the consumer. */
export type MapMarker = {
  id: string;
  lat: number;
  lng: number;
  title: string;
  description?: string;
};

/** Visual pin style (theme tokens — not domain names). */
export type MapMarkerVariant = "primary" | "accent";

/**
 * How a secondary basemap is compared with the primary one.
 * - `opacity` — semi-transparent overlay on top of the base
 * - `side-by-side` — vertical swipe divider between two layers
 */
export type MapCompareMode = "opacity" | "side-by-side";

/** Controlled compare chrome + overlay for LeafletMap. */
export type MapCompareConfig = {
  /** Secondary layer (typically historical: ПГМ, 3-верстка, РККА). */
  overlay: TileLayerId;
  mode?: MapCompareMode;
  /** 0–1; used in `opacity` mode. Default 0.55. */
  opacity?: number;
  onOverlayChange?: (id: TileLayerId) => void;
  onModeChange?: (mode: MapCompareMode) => void;
  onOpacityChange?: (opacity: number) => void;
};
