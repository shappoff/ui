"use client";

import { Marker, Popup } from "react-leaflet";

import type { MapMarker, MapMarkerVariant } from "../../maps";

import { createMapMarkerIcon } from "./create-map-marker-icon";

export type MapMarkerLayerProps = {
  markers: readonly MapMarker[];
  variant?: MapMarkerVariant;
};

/**
 * Presentational marker list for an existing MapContainer.
 * Compose as children of LeafletMap with a consumer-owned dataset.
 */
export function MapMarkerLayer({
  markers,
  variant = "primary",
}: MapMarkerLayerProps) {
  const icon = createMapMarkerIcon(variant);

  return (
    <>
      {markers.map((marker) => (
        <Marker
          key={marker.id}
          position={[marker.lat, marker.lng]}
          icon={icon}
          title={marker.title}
        >
          <Popup>
            <p className="sui-map-marker__popup-title">{marker.title}</p>
            {marker.description ? (
              <p className="sui-map-marker__popup-description">
                {marker.description}
              </p>
            ) : null}
          </Popup>
        </Marker>
      ))}
    </>
  );
}
