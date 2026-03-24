import { DirectionsRequest, DirectionsResponse } from "./types";

export async function getDirections(
  params: DirectionsRequest
): Promise<{ duration: string; durationSeconds: number; distance: string; distanceMeters: number } | null> {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    throw new Error("GOOGLE_MAPS_API_KEY is not configured");
  }

  const url = new URL("https://maps.googleapis.com/maps/api/directions/json");
  url.searchParams.set("origin", params.origin);
  url.searchParams.set("destination", params.destination);
  url.searchParams.set("mode", params.mode);
  url.searchParams.set("language", "ja");
  url.searchParams.set("key", apiKey);

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error(`Directions API error: ${response.status}`);
  }

  const data: DirectionsResponse = await response.json();

  if (data.status !== "OK" || !data.routes.length) {
    return null;
  }

  const leg = data.routes[0]?.legs?.[0];
  if (!leg) return null;
  return {
    duration: leg.duration.text,
    durationSeconds: leg.duration.value,
    distance: leg.distance.text,
    distanceMeters: leg.distance.value,
  };
}
