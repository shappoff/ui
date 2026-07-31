/**
 * Placeholder while a Leaflet chunk loads (consumer dynamic, ssr: false).
 */
export function MapSkeleton() {
  return (
    <div
      className="sui-map__skeleton"
      aria-busy="true"
      aria-label="Загрузка карты"
    />
  );
}
