import type { MapViewConfig } from "./types";

/**
 * Default camera for Belarus maps (center near Minsk, country-scale zoom).
 */
export const BELARUS_VIEW: MapViewConfig = {
  center: [53.7, 27.5],
  zoom: 7,
  minZoom: 5,
  maxZoom: 18,
  maxBounds: [
    [50.8, 22.5],
    [56.5, 33.5],
  ],
};
