export interface SearchResult {
  placeId: string;
  name: string;
  address: string;
  rating?: number;
  userRatingsTotal?: number;
  priceLevel?: number;
  location: {
    lat: number;
    lng: number;
  };
  openNow?: boolean;
  types?: string[];
  photoUrl?: string;
  googleMapsUrl: string;
  websiteUrl?: string;
  phoneNumber?: string;
  travelTime?: string;
  travelDistance?: string;
  travelMode?: string;
  summary?: string;
}

export interface WebSearchResult {
  title: string;
  url: string;
  snippet: string;
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  results?: SearchResult[];
  suggestions?: string[];
  webResults?: WebSearchResult[];
  timestamp: Date;
}

export interface ChatRequest {
  messages: { role: "user" | "assistant"; content: string }[];
}

export interface ChatResponse {
  message: string;
  results?: SearchResult[];
  suggestions?: string[];
  webResults?: WebSearchResult[];
}
