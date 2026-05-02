# FILE_INDEX — facility-search

> ⚠️ このファイルは自動生成です。手動編集は次回更新で上書きされます。

| 項目 | 値 |
|---|---|
| リポジトリ | KazuyaMurayama/facility-search |
| ブランチ | main |
| 総ファイル数 | 38 |
| 最終更新 | 2026-05-02 |
| 管理者 | 男座員也（Kazuya Oza） |

---

## カテゴリ別サマリー

| カテゴリ | ファイル数 |
|---|---|
| Documentation | 6 |
| Code | 22 |
| Config | 6 |
| Other | 4 |

---

## ディレクトリ構成

```
.
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── chat/
│   │   │       └── route.ts
│   │   ├── fonts/
│   │   │   ├── GeistMonoVF.woff
│   │   │   └── GeistVF.woff
│   │   ├── favicon.ico
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── chat-panel.tsx
│   │   ├── message-bubble.tsx
│   │   ├── result-card.tsx
│   │   ├── suggestion-chips.tsx
│   │   └── web-result-card.tsx
│   ├── hooks/
│   │   └── use-chat.ts
│   ├── lib/
│   │   ├── agent/
│   │   │   ├── index.ts
│   │   │   ├── system-prompt.ts
│   │   │   └── tools.ts
│   │   ├── google/
│   │   │   ├── directions.ts
│   │   │   ├── geocoding.ts
│   │   │   ├── places.ts
│   │   │   └── types.ts
│   │   └── utils/
│   │       ├── format.ts
│   │       └── map-links.ts
│   └── types/
│       └── index.ts
├── .env.example
├── .eslintrc.json
├── .gitignore
├── CLAUDE.md
├── FILE_INDEX.md
├── next.config.mjs
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── README.md
├── tailwind.config.ts
├── tasks.md
├── Timeout_Prevention.md
├── tsconfig.json
└── 小学校調査レポート_花小金井南町.md
```

---

## ファイル詳細

### Documentation (6件)

| ファイル | サイズ | 説明 |
|---|---|---|
| `CLAUDE.md` | 5.2 KB | Claude Code プロジェクト設定・命名ルール |
| `FILE_INDEX.md` | 3.5 KB | （このファイル）全ファイルインデックス |
| `README.md` | 1.4 KB | リポジトリ概要・セットアップ手順 |
| `tasks.md` | 1.2 KB | タスク管理・セッション履歴 |
| `Timeout_Prevention.md` | 4.9 KB | タイムアウト対策ガイド |
| `小学校調査レポート_花小金井南町.md` | 16.1 KB | Markdown ドキュメント |

### Code (22件)

| ファイル | サイズ | 説明 |
|---|---|---|
| `next.config.mjs` | 92 B | ファイル |
| `postcss.config.mjs` | 135 B | ファイル |
| `src/app/api/chat/route.ts` | 1.5 KB | TypeScript モジュール |
| `src/app/layout.tsx` | 524 B | React コンポーネント |
| `src/app/page.tsx` | 194 B | React コンポーネント |
| `src/components/chat-panel.tsx` | 5.6 KB | React コンポーネント |
| `src/components/message-bubble.tsx` | 6.4 KB | React コンポーネント |
| `src/components/result-card.tsx` | 3.1 KB | React コンポーネント |
| `src/components/suggestion-chips.tsx` | 643 B | React コンポーネント |
| `src/components/web-result-card.tsx` | 1.0 KB | React コンポーネント |
| `src/hooks/use-chat.ts` | 2.0 KB | TypeScript モジュール |
| `src/lib/agent/index.ts` | 5.1 KB | TypeScript モジュール |
| `src/lib/agent/system-prompt.ts` | 4.5 KB | TypeScript モジュール |
| `src/lib/agent/tools.ts` | 13.5 KB | TypeScript モジュール |
| `src/lib/google/directions.ts` | 1.2 KB | TypeScript モジュール |
| `src/lib/google/geocoding.ts` | 1006 B | TypeScript モジュール |
| `src/lib/google/places.ts` | 2.3 KB | TypeScript モジュール |
| `src/lib/google/types.ts` | 1.8 KB | TypeScript モジュール |
| `src/lib/utils/format.ts` | 1.3 KB | TypeScript モジュール |
| `src/lib/utils/map-links.ts` | 663 B | TypeScript モジュール |
| `src/types/index.ts` | 967 B | TypeScript モジュール |
| `tailwind.config.ts` | 407 B | TypeScript モジュール |

### Config (6件)

| ファイル | サイズ | 説明 |
|---|---|---|
| `.env.example` | 209 B | 環境変数テンプレート |
| `.eslintrc.json` | 61 B | JSON データ |
| `.gitignore` | 391 B | Git 除外設定 |
| `package-lock.json` | 207.7 KB | npm ロックファイル（自動生成） |
| `package.json` | 563 B | npm パッケージ設定 |
| `tsconfig.json` | 578 B | TypeScript コンパイラ設定 |

### Other (4件)

| ファイル | サイズ | 説明 |
|---|---|---|
| `src/app/favicon.ico` | 25.3 KB | ファイル |
| `src/app/fonts/GeistMonoVF.woff` | 66.3 KB | ファイル |
| `src/app/fonts/GeistVF.woff` | 64.7 KB | ファイル |
| `src/app/globals.css` | 413 B | ファイル |

---

_自動生成: 2026-05-02 | 管理者: 男座員也（Kazuya Oza）_
