"use client";

import { useEffect, useState, type ReactNode } from "react";
import type { LatLngExpression } from "leaflet";
import { MapContainer, useMap } from "react-leaflet";

import {
  BELARUS_VIEW,
  type MapCompareConfig,
  type MapCompareMode,
  type TileLayerId,
} from "../../maps";

import { BasemapSwitcher } from "./BasemapSwitcher";
import { BasemapTileLayer } from "./BasemapTileLayer";
import { MapCompareControl } from "./MapCompareControl";
import { MapCompareDivider } from "./MapCompareDivider";
import { MapCompareLayers } from "./MapCompareLayers";
import { useCompareWideViewport } from "./useCompareWideViewport";

const DEFAULT_COMPARE_OPACITY = 0.55;
const DEFAULT_COMPARE_MODE: MapCompareMode = "opacity";

export type LeafletMapProps = {
  ariaLabel: string;
  /** Route-specific overlays (e.g. MapMarkerLayer) — composition over props. */
  children?: ReactNode;
  /** Initial basemap; switcher lets the user change it. */
  basemap?: TileLayerId;
  /**
   * Optional historical/secondary layer compare (opacity or side-by-side).
   * When set, shows compare chrome and a second tile layer.
   */
  compare?: MapCompareConfig;
  className?: string;
  center?: LatLngExpression;
  zoom?: number;
  /** Fired after a successful basemap change (e.g. consumer haptic). */
  onBasemapChange?: (id: TileLayerId) => void;
};

/**
 * Keeps the Leaflet viewport in sync when the flex container resizes.
 */
function MapResizeSync({ container }: { container: HTMLElement | null }) {
  const map = useMap();

  useEffect(() => {
    if (!container) {
      return;
    }

    const sync = () => {
      map.invalidateSize({ animate: false });
    };

    sync();

    const observer = new ResizeObserver(sync);
    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, [map, container]);

  return null;
}

/**
 * Imperative Leaflet map shell. Browser-only — load behind next/dynamic
 * (`ssr: false`) or equivalent in the consumer app.
 */
export function LeafletMap({
  ariaLabel,
  children,
  basemap = "osm",
  compare,
  className,
  center = BELARUS_VIEW.center,
  zoom = BELARUS_VIEW.zoom,
  onBasemapChange,
}: LeafletMapProps) {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const [activeBasemap, setActiveBasemap] = useState(basemap);
  const [compareOverlay, setCompareOverlay] = useState<TileLayerId>(
    compare?.overlay ?? "pgm",
  );
  const [compareMode, setCompareMode] = useState<MapCompareMode>(
    compare?.mode ?? DEFAULT_COMPARE_MODE,
  );
  const [compareOpacity, setCompareOpacity] = useState(
    compare?.opacity ?? DEFAULT_COMPARE_OPACITY,
  );
  const [compareSplit, setCompareSplit] = useState(0.5);
  const isWide = useCompareWideViewport();
  const compareOrientation = isWide ? "vertical" : "horizontal";

  useEffect(() => {
    setActiveBasemap(basemap);
  }, [basemap]);

  useEffect(() => {
    if (compare?.overlay !== undefined) {
      setCompareOverlay(compare.overlay);
    }
  }, [compare?.overlay]);

  useEffect(() => {
    if (compare?.mode !== undefined) {
      setCompareMode(compare.mode);
    }
  }, [compare?.mode]);

  useEffect(() => {
    if (compare?.opacity !== undefined) {
      setCompareOpacity(compare.opacity);
    }
  }, [compare?.opacity]);

  const rootClass = ["sui-map", className].filter(Boolean).join(" ");
  const compareEnabled = compare != null;

  return (
    <div
      ref={setContainer}
      className={rootClass}
      role="region"
      aria-label={ariaLabel}
    >
      <BasemapSwitcher
        value={activeBasemap}
        onChange={(id) => {
          setActiveBasemap(id);
          onBasemapChange?.(id);
        }}
      />
      {compareEnabled ? (
        <MapCompareControl
          overlay={compareOverlay}
          mode={compareMode}
          opacity={compareOpacity}
          onOverlayChange={(id) => {
            setCompareOverlay(id);
            compare.onOverlayChange?.(id);
          }}
          onModeChange={(mode) => {
            setCompareMode(mode);
            compare.onModeChange?.(mode);
          }}
          onOpacityChange={(opacity) => {
            setCompareOpacity(opacity);
            compare.onOpacityChange?.(opacity);
          }}
        />
      ) : null}
      {compareEnabled && compareMode === "side-by-side" ? (
        <MapCompareDivider
          value={compareSplit}
          onChange={setCompareSplit}
          orientation={compareOrientation}
        />
      ) : null}
      <MapContainer
        className="sui-map__canvas"
        center={center}
        zoom={zoom}
        minZoom={BELARUS_VIEW.minZoom}
        maxZoom={BELARUS_VIEW.maxZoom}
        maxBounds={BELARUS_VIEW.maxBounds}
        maxBoundsViscosity={0.75}
        preferCanvas
        zoomControl={false}
        attributionControl={false}
        scrollWheelZoom
        fadeAnimation={false}
        zoomAnimation
        markerZoomAnimation={false}
      >
        <MapResizeSync container={container} />
        {compareEnabled ? (
          <MapCompareLayers
            baseId={activeBasemap}
            overlayId={compareOverlay}
            mode={compareMode}
            opacity={compareOpacity}
            split={compareSplit}
            orientation={compareOrientation}
          />
        ) : (
          <BasemapTileLayer key={activeBasemap} layerId={activeBasemap} />
        )}
        {children}
      </MapContainer>
    </div>
  );
}
