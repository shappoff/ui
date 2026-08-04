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
