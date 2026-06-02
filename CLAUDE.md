# facility-search — Claude Code 運用ルール

日本の施設・場所検索に特化した AI アシスタント「ファシリティサーチ」（Next.js プロジェクト）。

> **本ファイルは VSCode版 / Web版 Claude Code（claude.ai）の両方で本リポジトリの単独完結ガイド**。
> Web版はグローバル `~/.claude/CLAUDE.md` を参照しない前提で、本リポの運用に必要な全ルールをここに集約。

---

## 0. 技術スタック
- Next.js（`create-next-app` で初期化）
- 開発サーバー: `npm run dev` / `pnpm dev` / `yarn dev` / `bun dev`

## 1. セッション開始時の参照順序
1. `tasks.md` — 未完了タスク（存在する場合）
2. `FILE_INDEX.md` — ファイル一覧（存在する場合）
3. `README.md` — Next.js 標準ガイド
4. このCLAUDE.md — ルール入口

---

## 2. 開発者情報・命名ルール

| 種別 | 表記 | 用途 |
|---|---|---|
| **システム識別子（変更不可）** | `KazuyaMurayama` | GitHub ユーザー名 / URL / `@KazuyaMurayama` |
| **システム識別子（変更不可）** | `kazuya.murayama.21@gmail.com` | git `user.email` / 連絡先 |
| **表記名（人間として記載する場合）** | **男座員也（Kazuya Oza / おざ かずや）** | ドキュメント本文の著者名 / コミット message 中の自己言及 |

- ドキュメント本文等で開発者名を**人間として**記載する際は **男座員也 / Kazuya Oza** を使用
- 「Murayama」「村山」「Otokoza」「おとこざ」を**表記名**として誤用しない（システム識別子としての `KazuyaMurayama` は許容）

---

## 3. ツール実行・Git・ファイル保存
- 確認不要・即実行（事前確認文を出力しない）
- 例外（事前確認必須）: main への `git push --force`、`gh repo delete`
- **ブランチ管理**: デフォルトはmainへ直接コミット。ブランチ作成は明示指示時のみ。万一作成した場合はmainマージ→削除→push完了で「完了」
- **ファイル保存**: 本リポ内のみ。`C:\Users\user\Desktop` への出力禁止

---

## 4. 成果物報告ルール

| 成果物 | 説明 | リンク |
|---|---|---|
| file.md | 1行説明 | [開く](https://github.com/KazuyaMurayama/facility-search/blob/main/path/to/file.md) |

- Markdownリンク `[表示名](URL)` 形式必須 / `/blob/<実ブランチ>/<実パス>` 形式
- **報告前にURL存在確認**：`Invoke-WebRequest -Uri https://api.github.com/repos/KazuyaMurayama/facility-search/contents/PATH?ref=main -UseBasicParsing` でステータス200確認
- push完了後のみURL生成

---

## 5. ドキュメント日付ルール
レポート系 .md 新規作成時は H1直下に `作成日: YYYY-MM-DD` / `最終更新日: YYYY-MM-DD` 必須。更新時は最終更新日のみ書き換え。除外: README / CLAUDE.md / FILE_INDEX / tasks.md / CHANGELOG / LICENSE。

---

## 6. Skill 起動ルール

| トリガー | スキル |
|---|---|
| 施設データ調査 | `.claude/skills/research-deep/SKILL.md` |
| Next.js 機能設計・実装 | `.claude/skills/sp-brainstorming/SKILL.md` + `sp-writing-plans/SKILL.md` + `sp-executing-plans/SKILL.md` |
| TDD で機能実装 | `.claude/skills/sp-test-driven-development/SKILL.md` |
| バグ・エラー調査 | `.claude/skills/sp-systematic-debugging/SKILL.md` |
| UI 図表 | `.claude/skills/mermaid-agents365/SKILL.md` |
| 成果物の納品・コミット前 | `.claude/skills/sp-verification-before-completion/SKILL.md` |
| データ品質確認 | `.claude/skills/data-quality-audit/SKILL.md` |
| QC・レビュー前 | `.claude/skills/analysis-qa-checklist/SKILL.md` |
