export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)}m`;
  }
  return `${(meters / 1000).toFixed(1)}km`;
}

export function formatDuration(seconds: number): string {
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) {
    return `${minutes}分`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (remainingMinutes === 0) {
    return `${hours}時間`;
  }
  return `${hours}時間${remainingMinutes}分`;
}

export function formatPriceLevel(level: number | undefined): string {
  if (level === undefined || level === null) return "不明";
  const labels = ["無料", "安い", "普通", "やや高い", "高い"];
  return labels[level] ?? "不明";
}

export function formatRating(rating: number | undefined, total?: number): string {
  if (rating === undefined || rating === null) return "評価なし";
  const stars = "★".repeat(Math.round(rating)) + "☆".repeat(5 - Math.round(rating));
  const suffix = total ? ` (${total.toLocaleString()}件)` : "";
  return `${stars} ${rating.toFixed(1)}${suffix}`;
}

export function formatTravelMode(mode: string): string {
  const modes: Record<string, string> = {
    driving: "車",
    walking: "徒歩",
    bicycling: "自転車",
    transit: "公共交通機関",
  };
  return modes[mode] ?? mode;
}
