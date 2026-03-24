import {
  PlaceSearchRequest,
  PlaceSearchResponse,
  PlaceResult,
} from "./types";

const FIELD_MASK = [
  "places.id",
  "places.displayName",
  "places.formattedAddress",
  "places.location",
  "places.rating",
  "places.userRatingCount",
  "places.priceLevel",
  "places.currentOpeningHours",
  "places.types",
  "places.websiteUri",
  "places.nationalPhoneNumber",
  "places.googleMapsUri",
].join(",");

export async function searchPlaces(
  params: PlaceSearchRequest
): Promise<PlaceResult[]> {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    throw new Error("GOOGLE_MAPS_API_KEY is not configured");
  }

  const body: Record<string, unknown> = {
    textQuery: params.query,
    languageCode: "ja",
    maxResultCount: params.maxResults ?? 10,
  };

  if (params.location && params.radius) {
    body.locationBias = {
      circle: {
        center: {
          latitude: params.location.lat,
          longitude: params.location.lng,
        },
        radius: params.radius,
      },
    };
  }

  if (params.openNow) {
    body.openNow = true;
  }

  const response = await fetch(
    "https://places.googleapis.com/v1/places:searchText",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": FIELD_MASK,
      },
      body: JSON.stringify(body),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Google Places API error: ${response.status} - ${error}`);
  }

  const data: PlaceSearchResponse = await response.json();
  let results = data.places ?? [];

  if (params.minRating) {
    results = results.filter(
      (p) => p.rating && p.rating >= params.minRating!
    );
  }

  return results;
}

export async function getPlaceDetails(
  placeId: string
): Promise<PlaceResult | null> {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    throw new Error("GOOGLE_MAPS_API_KEY is not configured");
  }

  const fieldMask = FIELD_MASK.replace(/places\./g, "");

  const response = await fetch(
    `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`,
    {
      headers: {
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": fieldMask,
      },
    }
  );

  if (!response.ok) {
    return null;
  }

  return response.json();
}
