import Anthropic from "@anthropic-ai/sdk";
import { searchPlaces, getPlaceDetails } from "@/lib/google/places";
import { getDirections } from "@/lib/google/directions";
import { geocodeAddress } from "@/lib/google/geocoding";
import { priceLevelToNumber, PlaceResult } from "@/lib/google/types";
import { buildGoogleMapsPlaceUrl } from "@/lib/utils/map-links";
import { formatPriceLevel, formatRating, formatTravelMode } from "@/lib/utils/format";
import { SearchResult, WebSearchResult } from "@/types";

export const toolDefinitions: Anthropic.Tool[] = [
  {
    name: "search_places",
    description:
      "Google Places APIを使って施設や場所を検索する。レストラン、クリニック、学校、公園など様々な施設を検索できる。評価や営業状況でのフィルタリングも可能。",
    input_schema: {
      type: "object" as const,
      properties: {
        query: {
          type: "string",
          description: "検索クエリ（日本語可）例: '渋谷 イタリアン レストラン'",
        },
        location: {
          type: "string",
          description: "中心地点の住所またはランドマーク名（日本語可）例: '東京駅', '渋谷区神宮前1-1'",
        },
        radius: {
          type: "number",
          description: "検索半径（メートル）。デフォルト5000。自転車15分なら約4000、徒歩15分なら約1200。",
        },
        min_rating: {
          type: "number",
          description: "最低評価（1.0〜5.0）",
        },
        open_now: {
          type: "boolean",
          description: "現在営業中の施設のみ検索するか",
        },
        max_results: {
          type: "number",
          description: "最大結果件数（デフォルト10）",
        },
      },
      required: ["query"],
    },
  },
  {
    name: "get_place_details",
    description:
      "Google Places APIで特定の施設の詳細情報を取得する。Place IDを指定して、営業時間、電話番号、ウェブサイト等の詳細情報を取得。",
    input_schema: {
      type: "object" as const,
      properties: {
        place_id: {
          type: "string",
          description: "GoogleのPlace ID",
        },
      },
      required: ["place_id"],
    },
  },
  {
    name: "calc_route",
    description:
      "2地点間の経路と所要時間を計算する。自転車、徒歩、車、公共交通機関に対応。",
    input_schema: {
      type: "object" as const,
      properties: {
        origin: {
          type: "string",
          description: "出発地点（住所またはランドマーク名、日本語可）",
        },
        destination: {
          type: "string",
          description: "目的地（住所またはランドマーク名、日本語可）",
        },
        mode: {
          type: "string",
          enum: ["driving", "walking", "bicycling", "transit"],
          description: "交通手段。driving=車, walking=徒歩, bicycling=自転車, transit=公共交通機関",
        },
      },
      required: ["origin", "destination", "mode"],
    },
  },
  {
    name: "web_search",
    description:
      "ウェブ検索を行い、施設の選び方の基準、専門的な情報、口コミ、比較記事などを調査する。Google Places APIでは得られない詳細情報（診療内容、教育方針、専門資格など）の調査に使用。",
    input_schema: {
      type: "object" as const,
      properties: {
        query: {
          type: "string",
          description: "検索クエリ（日本語可）例: '小児科 クリニック 選び方 ポイント', '渋谷区 モンテッソーリ 小学校'",
        },
        num_results: {
          type: "number",
          description: "取得する検索結果の件数（デフォルト5）",
        },
      },
      required: ["query"],
    },
  },
  {
    name: "web_fetch",
    description:
      "指定URLのウェブページの内容を取得する。施設の公式サイトや口コミサイトから詳細情報を取得するために使用。",
    input_schema: {
      type: "object" as const,
      properties: {
        url: {
          type: "string",
          description: "取得するウェブページのURL",
        },
      },
      required: ["url"],
    },
  },
  {
    name: "ask_user",
    description:
      "ユーザーに追加情報を質問する、または重要な選択基準を提示して確認する。情報不足時の質問と、リサーチに基づく選択基準の提案の両方に使用。",
    input_schema: {
      type: "object" as const,
      properties: {
        message: {
          type: "string",
          description: "ユーザーへの質問または提案メッセージ",
        },
        suggestions: {
          type: "array",
          items: { type: "string" },
          description: "選択肢のリスト（クイック選択ボタンとして表示される）",
        },
      },
      required: ["message"],
    },
  },
];

export interface ToolResult {
  content: string;
  results?: SearchResult[];
  webResults?: WebSearchResult[];
  suggestions?: string[];
  isAskUser?: boolean;
}

export async function executeTool(
  toolName: string,
  toolInput: Record<string, unknown>
): Promise<ToolResult> {
  switch (toolName) {
    case "search_places":
      return executeSearchPlaces(toolInput);
    case "get_place_details":
      return executeGetPlaceDetails(toolInput);
    case "calc_route":
      return executeCalcRoute(toolInput);
    case "web_search":
      return executeWebSearch(toolInput);
    case "web_fetch":
      return executeWebFetch(toolInput);
    case "ask_user":
      return executeAskUser(toolInput);
    default:
      return { content: `Unknown tool: ${toolName}` };
  }
}

function placeToSearchResult(place: PlaceResult): SearchResult {
  return {
    placeId: place.id,
    name: place.displayName?.text ?? "不明",
    address: place.formattedAddress ?? "不明",
    rating: place.rating,
    userRatingsTotal: place.userRatingCount,
    priceLevel: priceLevelToNumber(place.priceLevel),
    location: {
      lat: place.location?.latitude ?? 0,
      lng: place.location?.longitude ?? 0,
    },
    openNow: place.currentOpeningHours?.openNow,
    types: place.types,
    googleMapsUrl: place.googleMapsUri ?? buildGoogleMapsPlaceUrl(place.id),
    websiteUrl: place.websiteUri,
    phoneNumber: place.nationalPhoneNumber,
  };
}

async function executeSearchPlaces(
  input: Record<string, unknown>
): Promise<ToolResult> {
  try {
    let locationCoords: { lat: number; lng: number } | undefined;

    if (input.location) {
      const geo = await geocodeAddress(input.location as string);
      if (geo) {
        locationCoords = { lat: geo.lat, lng: geo.lng };
      }
    }

    const places = await searchPlaces({
      query: input.query as string,
      location: locationCoords,
      radius: (input.radius as number) ?? 5000,
      minRating: input.min_rating as number | undefined,
      openNow: input.open_now as boolean | undefined,
      maxResults: (input.max_results as number) ?? 10,
    });

    const results: SearchResult[] = places.map(placeToSearchResult);

    const summary = results
      .map(
        (r, i) =>
          `${i + 1}. ${r.name} - ${formatRating(r.rating, r.userRatingsTotal)} - ${r.address}` +
          (r.priceLevel !== undefined ? ` - 価格帯: ${formatPriceLevel(r.priceLevel)}` : "") +
          ` - GoogleMaps: ${r.googleMapsUrl}` +
          (r.websiteUrl ? ` - 公式サイト: ${r.websiteUrl}` : "")
      )
      .join("\n");

    return {
      content: results.length
        ? `${results.length}件の施設が見つかりました:\n${summary}`
        : "条件に合う施設が見つかりませんでした。条件を変更して再検索することをお勧めします。",
      results,
    };
  } catch (error) {
    return {
      content: `施設検索中にエラーが発生しました: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}

async function executeGetPlaceDetails(
  input: Record<string, unknown>
): Promise<ToolResult> {
  try {
    const place = await getPlaceDetails(input.place_id as string);
    if (!place) {
      return { content: "施設の詳細情報を取得できませんでした。" };
    }

    const result = placeToSearchResult(place);

    return {
      content: `施設詳細: ${result.name}\n住所: ${result.address}\n評価: ${formatRating(result.rating, result.userRatingsTotal)}\n電話: ${result.phoneNumber ?? "不明"}\n公式サイト: ${result.websiteUrl ?? "なし"}\nGoogleMaps: ${result.googleMapsUrl}`,
      results: [result],
    };
  } catch (error) {
    return {
      content: `詳細取得中にエラーが発生しました: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}

async function executeCalcRoute(
  input: Record<string, unknown>
): Promise<ToolResult> {
  try {
    const result = await getDirections({
      origin: input.origin as string,
      destination: input.destination as string,
      mode: input.mode as "driving" | "walking" | "bicycling" | "transit",
    });

    if (!result) {
      return { content: "経路が見つかりませんでした。" };
    }

    const mode = formatTravelMode(input.mode as string);
    return {
      content: `${input.origin} から ${input.destination} まで:\n交通手段: ${mode}\n所要時間: ${result.duration}\n距離: ${result.distance}`,
    };
  } catch (error) {
    return {
      content: `経路計算中にエラーが発生しました: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}

async function executeWebSearch(
  input: Record<string, unknown>
): Promise<ToolResult> {
  try {
    const query = input.query as string;
    const numResults = (input.num_results as number) ?? 5;

    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    const searchEngineId = process.env.GOOGLE_SEARCH_ENGINE_ID;

    if (!apiKey || !searchEngineId) {
      return {
        content: `ウェブ検索（GOOGLE_SEARCH_ENGINE_ID未設定のためシミュレーション）: "${query}"\n\n注意: 実際のウェブ検索結果を取得するには、Google Custom Search APIのセットアップが必要です。現在はGoogle Places APIの情報のみ使用可能です。施設検索にはsearch_placesツールをご利用ください。`,
        webResults: [],
      };
    }

    const url = new URL("https://www.googleapis.com/customsearch/v1");
    url.searchParams.set("key", apiKey);
    url.searchParams.set("cx", searchEngineId);
    url.searchParams.set("q", query);
    url.searchParams.set("num", String(Math.min(numResults, 10)));
    url.searchParams.set("lr", "lang_ja");

    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new Error(`Google Search API error: ${response.status}`);
    }

    const data = await response.json();
    const webResults: WebSearchResult[] = (data.items ?? []).map(
      (item: { title: string; link: string; snippet: string }) => ({
        title: item.title,
        url: item.link,
        snippet: item.snippet,
      })
    );

    const summary = webResults
      .map((r, i) => `${i + 1}. [${r.title}](${r.url})\n   ${r.snippet}`)
      .join("\n\n");

    return {
      content: webResults.length
        ? `ウェブ検索結果 "${query}":\n\n${summary}`
        : `"${query}" に関するウェブ検索結果が見つかりませんでした。`,
      webResults,
    };
  } catch (error) {
    return {
      content: `ウェブ検索中にエラーが発生しました: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}

function isAllowedUrl(urlString: string): boolean {
  try {
    const url = new URL(urlString);
    if (!["http:", "https:"].includes(url.protocol)) return false;
    const hostname = url.hostname;
    if (
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname === "0.0.0.0" ||
      hostname === "[::1]" ||
      hostname.startsWith("10.") ||
      hostname.startsWith("192.168.") ||
      hostname.startsWith("172.16.") ||
      hostname.startsWith("169.254.") ||
      hostname.endsWith(".local") ||
      hostname.endsWith(".internal")
    ) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

async function executeWebFetch(
  input: Record<string, unknown>
): Promise<ToolResult> {
  try {
    const url = input.url as string;

    if (!isAllowedUrl(url)) {
      return {
        content: `セキュリティ上の理由により、このURLにはアクセスできません: ${url}`,
      };
    }

    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; FacilitySearchBot/1.0)",
        Accept: "text/html,application/xhtml+xml",
        "Accept-Language": "ja,en;q=0.9",
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      return {
        content: `ページの取得に失敗しました（HTTP ${response.status}）: ${url}`,
      };
    }

    const html = await response.text();

    const textContent = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 5000);

    return {
      content: `ページ内容 (${url}):\n\n${textContent}`,
      webResults: [{ title: url, url, snippet: textContent.slice(0, 200) }],
    };
  } catch (error) {
    return {
      content: `ページ取得中にエラーが発生しました: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}

function executeAskUser(input: Record<string, unknown>): ToolResult {
  return {
    content: input.message as string,
    suggestions: input.suggestions as string[] | undefined,
    isAskUser: true,
  };
}
