import * as LeafletNS from "leaflet";
import type { HeatLatLngTuple, HeatLayer, HeatMapOptions } from "leaflet";

type LeafletApi = typeof LeafletNS & {
  default?: typeof LeafletNS;
  heatLayer: (
    latlngs: HeatLatLngTuple[],
    options?: HeatMapOptions,
  ) => HeatLayer;
};

let heatReady: Promise<LeafletApi> | null = null;

function resolveLeaflet(): LeafletApi {
  const ns = LeafletNS as LeafletApi;
  return (ns.default ?? ns) as LeafletApi;
}

/**
 * leaflet.heat attaches to the global `L`. Ensure the same instance is global
 * before the side-effect import (bundlers / SSR safe).
 */
function loadLeafletHeat(): Promise<LeafletApi> {
  if (!heatReady) {
    heatReady = (async () => {
      const leaflet = resolveLeaflet();
      const root = globalThis as typeof globalThis & { L?: LeafletApi };
      root.L = leaflet;
      await import("leaflet.heat");
      return (root.L ?? leaflet) as LeafletApi;
    })();
  }
  return heatReady;
}

export async function createHeatLayer(
  latlngs: HeatLatLngTuple[],
  options?: HeatMapOptions,
): Promise<HeatLayer> {
  const leaflet = await loadLeafletHeat();
  return leaflet.heatLayer(latlngs, options);
}
