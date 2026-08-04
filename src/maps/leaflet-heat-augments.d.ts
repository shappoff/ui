import "leaflet";

declare module "leaflet" {
  interface HeatMapOptions {
    minOpacity?: number;
    maxZoom?: number;
    radius?: number;
    blur?: number;
    max?: number;
    gradient?: Record<number, string>;
  }

  type HeatLatLngTuple = [number, number, number?];

  interface HeatLayer extends Layer {
    setLatLngs(
      latlngs: Array<LatLngExpression | HeatLatLngTuple>,
    ): this;
    addLatLng(latlng: LatLngExpression | HeatLatLngTuple): this;
    setOptions(options: HeatMapOptions): this;
    redraw(): this;
  }

  function heatLayer(
    latlngs: Array<LatLngExpression | HeatLatLngTuple>,
    options?: HeatMapOptions,
  ): HeatLayer;
}

export {};
