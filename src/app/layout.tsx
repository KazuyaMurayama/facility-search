import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ファシリティサーチ - AI施設検索",
  description:
    "AIが条件に合った施設や場所を検索・提案します。レストラン、クリニック、学校、公園など。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="antialiased font-sans">{children}</body>
    </html>
  );
}
