declare module "leaflet-minimap" {
  import type {
    Control,
    ControlPosition,
    LatLngExpression,
    Layer,
    MapOptions,
    PathOptions,
  } from "leaflet";

  export type MiniMapOptions = {
    position?: ControlPosition;
    toggleDisplay?: boolean;
    zoomLevelOffset?: number;
    zoomLevelFixed?: number | false;
    centerFixed?: LatLngExpression | false;
    zoomAnimation?: boolean;
    autoToggleDisplay?: boolean;
    minimized?: boolean;
    width?: number;
    height?: number;
    collapsedWidth?: number;
    collapsedHeight?: number;
    aimingRectOptions?: PathOptions;
    shadowRectOptions?: PathOptions;
    strings?: { hideText?: string; showText?: string };
    mapOptions?: MapOptions;
  };

  export default class MiniMap extends Control {
    constructor(layer: Layer, options?: MiniMapOptions);
    changeLayer(layer: Layer): void;
  }
}
