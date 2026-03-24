export function buildGoogleMapsPlaceUrl(placeId: string): string {
  return `https://www.google.com/maps/place/?q=place_id:${encodeURIComponent(placeId)}`;
}

export function buildGoogleMapsSearchUrl(query: string): string {
  return `https://www.google.com/maps/search/${encodeURIComponent(query)}`;
}

export function buildGoogleMapsDirectionsUrl(
  origin: string,
  destinationPlaceId: string,
  mode: "driving" | "walking" | "bicycling" | "transit" = "driving"
): string {
  return `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=&destination_place_id=${encodeURIComponent(destinationPlaceId)}&travelmode=${mode}`;
}
