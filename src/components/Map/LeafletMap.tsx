"use client";

import { useEffect, useState, type ReactNode } from "react";
import type { LatLngExpression } from "leaflet";
import { MapContainer, TileLayer, useMap } from "react-leaflet";

import {
  BELARUS_VIEW,
  getTileLayer,
  type TileLayerId,
} from "../../maps";

import { BasemapSwitcher } from "./BasemapSwitcher";

export type LeafletMapProps = {
  ariaLabel: string;
  /** Route-specific overlays (e.g. MapMarkerLayer) — composition over props. */
  children?: ReactNode;
  /** Initial basemap; switcher lets the user change it. */
  basemap?: TileLayerId;
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
  className,
  center = BELARUS_VIEW.center,
  zoom = BELARUS_VIEW.zoom,
  onBasemapChange,
}: LeafletMapProps) {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const [activeBasemap, setActiveBasemap] = useState(basemap);
  const tile = getTileLayer(activeBasemap);

  const rootClass = ["sui-map", className].filter(Boolean).join(" ");

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
      <MapContainer
        className="sui-map__canvas"
        center={center}
        zoom={zoom}
        minZoom={BELARUS_VIEW.minZoom}
        maxZoom={BELARUS_VIEW.maxZoom}
        maxBounds={BELARUS_VIEW.maxBounds}
        maxBoundsViscosity={0.75}
        preferCanvas
        zoomControl
        attributionControl={false}
        scrollWheelZoom
        fadeAnimation={false}
        zoomAnimation
        markerZoomAnimation={false}
      >
        <MapResizeSync container={container} />
        <TileLayer
          key={activeBasemap}
          url={tile.url}
          attribution={tile.attribution}
          maxZoom={tile.maxZoom}
          maxNativeZoom={tile.maxNativeZoom}
          {...(tile.subdomains ? { subdomains: tile.subdomains } : {})}
          updateWhenZooming={false}
          updateWhenIdle
          keepBuffer={2}
        />
        {children}
      </MapContainer>
    </div>
  );
}
