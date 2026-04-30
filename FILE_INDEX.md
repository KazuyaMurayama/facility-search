# FILE_INDEX.md — facility-search

> **新セッション開始時に必ずこのファイルを読む。**
> ファイル追加・削除・移動時は必ずこのファイルを更新すること。
> 最終更新: 2026-04-30

## 概要
Next.js + Claude API + Google Maps APIを使った施設検索チャットアプリ。自然言語で施設を検索しGoogleマップ連携で経路も提供。

**スタック:** TypeScript, Next.js, React, Tailwind CSS, Anthropic SDK, Google Maps API

---

## 📋 最初に読むべきファイル

| 優先度 | ファイル | 内容 |
|---|---|---|
| ★★★ | `CLAUDE.md` | 運用ルール・指針 |
| ★★★ | `README.md` | セットアップ手順 |
| ★★★ | `src/app/api/chat/route.ts` | チャットAPIルート（エージェント統合） |
| ★★ | `src/lib/agent/index.ts` | Claude Agentメインロジック |
| ★★ | `.env.example` | 環境変数テンプレート（API Key等） |

---

## 🗂️ ディレクトリ構造

```
facility-search/
├── CLAUDE.md                    ← 最重要ルール
├── README.md
├── .env.example                 ← 環境変数テンプレート
├── next.config.mjs
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── src/
    ├── app/
    │   ├── page.tsx
    │   ├── layout.tsx
    │   ├── globals.css
    │   └── api/chat/route.ts    ← チャットAPIルート
    ├── components/
    │   ├── chat-panel.tsx
    │   ├── message-bubble.tsx
    │   ├── result-card.tsx
    │   ├── suggestion-chips.tsx
    │   └── web-result-card.tsx
    ├── hooks/use-chat.ts
    ├── lib/
    │   ├── agent/
    │   │   ├── index.ts         ← Agentメインロジック
    │   │   ├── system-prompt.ts
    │   │   └── tools.ts
    │   ├── google/
    │   │   ├── directions.ts
    │   │   ├── geocoding.ts
    │   │   ├── places.ts
    │   │   └── types.ts
    │   └── utils/
    └── types/index.ts
```

---

## 📑 全ファイル一覧

| パス | 種別 | 説明 |
|---|---|---|
| `src/app/page.tsx` | TypeScript | メインページコンポーネント |
| `src/app/layout.tsx` | TypeScript | レイアウト |
| `src/app/api/chat/route.ts` | TypeScript | チャットAPIエンドポイント |
| `src/components/chat-panel.tsx` | TypeScript | チャットパネルUI |
| `src/components/result-card.tsx` | TypeScript | 施設結果カードUI |
| `src/hooks/use-chat.ts` | TypeScript | チャット状態管理フック |
| `src/lib/agent/index.ts` | TypeScript | Claude Agentメインロジック |
| `src/lib/agent/system-prompt.ts` | TypeScript | システムプロンプト |
| `src/lib/agent/tools.ts` | TypeScript | ツール定義（施設検索等） |
| `src/lib/google/places.ts` | TypeScript | Google Places API連携 |
| `src/lib/google/directions.ts` | TypeScript | Google Directions API連携 |
| `src/lib/google/geocoding.ts` | TypeScript | ジオコーディング |
| `src/types/index.ts` | TypeScript | 型定義 |
| `.env.example` | 設定 | 環境変数テンプレート |
| `package.json` | 設定 | Node.js依存関係 |

---

## 🔖 ファイル更新ルール

1. 新ファイル追加時: 該当セクションに1行追加
2. ファイル削除・移動時: 該当行を削除または更新
3. 更新後: `git add FILE_INDEX.md && git commit -m "docs: FILE_INDEX.md更新"`
