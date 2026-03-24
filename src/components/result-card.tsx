"use client";

import { SearchResult } from "@/types";
import { formatPriceLevel, formatTravelMode } from "@/lib/utils/format";

interface ResultCardProps {
  result: SearchResult;
}

export function ResultCard({ result }: ResultCardProps) {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 hover:border-blue-300 transition-colors">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm text-gray-900 truncate">
            {result.name}
          </h4>
          <p className="text-xs text-gray-500 mt-0.5 truncate">
            {result.address}
          </p>
        </div>
        {result.rating != null && (
          <div className="flex-shrink-0 text-xs text-amber-600 font-medium">
            ★ {result.rating.toFixed(1)}
            {result.userRatingsTotal && (
              <span className="text-gray-400 ml-0.5">
                ({result.userRatingsTotal.toLocaleString()})
              </span>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 mt-2 flex-wrap">
        {result.priceLevel !== undefined && (
          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
            {formatPriceLevel(result.priceLevel)}
          </span>
        )}
        {result.travelTime && result.travelMode && (
          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
            {formatTravelMode(result.travelMode)} {result.travelTime}
          </span>
        )}
        {result.openNow !== undefined && (
          <span
            className={`text-xs px-2 py-0.5 rounded-full ${
              result.openNow
                ? "bg-emerald-100 text-emerald-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {result.openNow ? "営業中" : "営業時間外"}
          </span>
        )}
      </div>

      {result.summary && (
        <p className="text-xs text-gray-600 mt-2 line-clamp-2">
          {result.summary}
        </p>
      )}

      <div className="flex items-center gap-2 mt-2 flex-wrap">
        <a
          href={result.googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors"
        >
          📍 Googleマップ
        </a>
        {result.websiteUrl && (
          <a
            href={result.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs bg-gray-600 text-white px-3 py-1.5 rounded-lg hover:bg-gray-700 transition-colors"
          >
            🌐 公式サイト
          </a>
        )}
        {result.phoneNumber && (
          <a
            href={`tel:${result.phoneNumber}`}
            className="inline-flex items-center gap-1 text-xs bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 transition-colors"
          >
            📞 電話
          </a>
        )}
      </div>
    </div>
  );
}
