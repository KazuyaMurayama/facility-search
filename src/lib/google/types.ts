export interface PlaceSearchRequest {
  query: string;
  location?: { lat: number; lng: number };
  radius?: number;
  minRating?: number;
  openNow?: boolean;
  type?: string;
  maxResults?: number;
}

export interface PlaceResult {
  id: string;
  displayName: { text: string; languageCode: string };
  formattedAddress: string;
  location: { latitude: number; longitude: number };
  rating?: number;
  userRatingCount?: number;
  priceLevel?:
    | "PRICE_LEVEL_FREE"
    | "PRICE_LEVEL_INEXPENSIVE"
    | "PRICE_LEVEL_MODERATE"
    | "PRICE_LEVEL_EXPENSIVE"
    | "PRICE_LEVEL_VERY_EXPENSIVE";
  currentOpeningHours?: {
    openNow: boolean;
  };
  types?: string[];
  websiteUri?: string;
  nationalPhoneNumber?: string;
  photos?: { name: string }[];
  googleMapsUri?: string;
}

export interface PlaceSearchResponse {
  places: PlaceResult[];
}

export interface DirectionsRequest {
  origin: string;
  destination: string;
  mode: "driving" | "walking" | "bicycling" | "transit";
}

export interface DirectionsLeg {
  duration: { text: string; value: number };
  distance: { text: string; value: number };
}

export interface DirectionsResponse {
  routes: {
    legs: DirectionsLeg[];
  }[];
  status: string;
}

export interface GeocodingResult {
  formatted_address: string;
  geometry: {
    location: { lat: number; lng: number };
  };
  place_id: string;
}

export interface GeocodingResponse {
  results: GeocodingResult[];
  status: string;
}

export function priceLevelToNumber(
  level: PlaceResult["priceLevel"]
): number | undefined {
  if (!level) return undefined;
  const map: Record<string, number> = {
    PRICE_LEVEL_FREE: 0,
    PRICE_LEVEL_INEXPENSIVE: 1,
    PRICE_LEVEL_MODERATE: 2,
    PRICE_LEVEL_EXPENSIVE: 3,
    PRICE_LEVEL_VERY_EXPENSIVE: 4,
  };
  return map[level];
}
