import type { TileLayerConfig, TileLayerId } from "./types";

const INDEXBY_ATTRIBUTION =
  'Historical tiles via <a href="https://github.com/indexby/storage">indexby</a>';

/**
 * Display order for the basemap switcher (stable; do not rely on Object.keys).
 */
export const TILE_LAYER_ORDER: TileLayerId[] = [
  "osm",
  "pgm",
  "verstka1",
  "verstka2",
  "rkka",
  "google",
];

/**
 * Shared basemap presets. LeafletMap resolves the tile URL by id.
 */
export const TILE_LAYERS: Record<TileLayerId, TileLayerConfig> = {
  osm: {
    label: "OSM",
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 19,
    maxNativeZoom: 19,
  },
  pgm: {
    label: "ПГМ",
    url: "https://raw.githubusercontent.com/indexby/storage/pgm_vekzhg/tiles/Z{z}/{y}/{x}.jpg",
    attribution: INDEXBY_ATTRIBUTION,
    maxZoom: 18,
    maxNativeZoom: 14,
  },
  verstka1: {
    label: "3-верстка (1)",
    url: "https://raw.githubusercontent.com/indexby/storage/3v_jun20/tiles/Z{z}/{y}/{x}.jpg",
    attribution: INDEXBY_ATTRIBUTION,
    maxZoom: 18,
    maxNativeZoom: 14,
  },
  verstka2: {
    label: "3-верстка (2)",
    url: "https://raw.githubusercontent.com/indexby/storage/3v_jan20/tiles/Z{z}/{y}/{x}.jpg",
    attribution: INDEXBY_ATTRIBUTION,
    maxZoom: 18,
    maxNativeZoom: 14,
  },
  rkka: {
    label: "РККА",
    url: "https://raw.githubusercontent.com/indexby/storage/rkka_v4/tiles/Z{z}/{y}/{x}.jpg",
    attribution: INDEXBY_ATTRIBUTION,
    maxZoom: 18,
    maxNativeZoom: 14,
  },
  google: {
    label: "Google",
    url: "https://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}",
    attribution: "&copy; Google",
    maxZoom: 20,
    maxNativeZoom: 20,
    subdomains: ["mt0", "mt1", "mt2", "mt3"],
  },
};

export function getTileLayer(id: TileLayerId): TileLayerConfig {
  return TILE_LAYERS[id];
}

export function listTileLayers(): TileLayerConfig[] {
  return TILE_LAYER_ORDER.map((id) => TILE_LAYERS[id]);
}
