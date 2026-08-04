import type { MapHeatPoint, MapMarker } from "../../maps";

/** Shared Storybook / demo points across Belarus. */
export const BELARUS_CITY_MARKERS: MapMarker[] = [
  {
    id: "minsk",
    lat: 53.9,
    lng: 27.56,
    title: "Минск",
    description: "Столица Беларуси",
  },
  {
    id: "brest",
    lat: 52.0976,
    lng: 23.7341,
    title: "Брест",
  },
  {
    id: "gomel",
    lat: 52.4412,
    lng: 30.9878,
    title: "Гомель",
    description: "Областной центр",
  },
  {
    id: "grodno",
    lat: 53.6884,
    lng: 23.8258,
    title: "Гродно",
  },
  {
    id: "vitebsk",
    lat: 55.1904,
    lng: 30.2049,
    title: "Витебск",
  },
  {
    id: "mogilev",
    lat: 53.9007,
    lng: 30.3314,
    title: "Могилёв",
  },
  {
    id: "polotsk",
    lat: 55.4855,
    lng: 28.768,
    title: "Полоцк",
  },
  {
    id: "pinsk",
    lat: 52.1229,
    lng: 26.0951,
    title: "Пинск",
  },
];

/** Synthetic density around cities for heatmap demos. */
export function createBelarusHeatPoints(
  markers: readonly MapMarker[] = BELARUS_CITY_MARKERS,
  jitter = 8,
): MapHeatPoint[] {
  const points: MapHeatPoint[] = [];

  for (const marker of markers) {
    points.push({ lat: marker.lat, lng: marker.lng, intensity: 1 });
    for (let i = 0; i < jitter; i += 1) {
      const angle = (Math.PI * 2 * i) / jitter;
      const radius = 0.08 + (i % 3) * 0.04;
      points.push({
        lat: marker.lat + Math.sin(angle) * radius,
        lng: marker.lng + Math.cos(angle) * radius * 1.6,
        intensity: 0.35 + (i % 4) * 0.15,
      });
    }
  }

  return points;
}
