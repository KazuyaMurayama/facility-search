"use client";

import { WebSearchResult } from "@/types";

interface WebResultCardProps {
  results: WebSearchResult[];
}

export function WebResultList({ results }: WebResultCardProps) {
  if (!results.length) return null;

  return (
    <div className="mt-3">
      <p className="text-xs text-gray-500 font-medium mb-2">📖 参考情報</p>
      <div className="space-y-1.5">
        {results.map((result, index) => (
          <a
            key={index}
            href={result.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 hover:border-blue-300 hover:bg-blue-50 transition-colors"
          >
            <p className="text-xs font-medium text-blue-700 truncate">
              {result.title}
            </p>
            {result.snippet && (
              <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                {result.snippet}
              </p>
            )}
          </a>
        ))}
      </div>
    </div>
  );
}
