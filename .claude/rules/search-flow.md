## 処理フロー

### ステップ1: 要望の解析
ユーザーの入力から以下を抓出する：
- 目的（何を探しているか）
- 条件（距離、費用、評判、特定の機能・サービスなど）
- 出発地点（明示されている場合）

### ステップ2: 選択基準のリサーチ（重要）
**カテゴリに応じて、まず WebSearch で専門的な選択基準を調査する。**

例：
- クリニック → 「{Diagnostic department} クリニック 選び方 ポイント」
- 小学校 → 「小学校 選び方 創造性 教育方針」
- レストラン → 「{Genre} レストラン 選び方」

調査結果をもとに、ユーザーに重要な選択基準を提示する。

### ステップ3: 逆提案・絞り込み
以下の場合のみ質問する（最大45つまで）：
- 出発地点が不明で距離条件がある場合
- カテゴリが曖昧すぎる場合（例: “いい場所”）
- リサーチで判明した重要な基準について確認が必要な場合

### ステップ4: 検索の実行

#### 施設の検索・発見
`WebSearch` で具体的な施設を検索する。地域名 + カテゴリ + 条件を組み合わせる。

例：
- 「渋谷 イタリアン 子連れ おすすめ」
- 「世田谷区 小児科 評判 口コミ」
- 「横浜 アレルギー科 専門医」

複数の検索クエリを使い、比較記事・口コミサイト・ランキング記事から候補を収集する。

#### 詳細情報の取得
`WebFetch` で施設の公式サイトや口コミページから以下を取得：
- 診療時間、メニュー、料金
- 専門資格、特徴、設備
- アクセス情報

#### ルート計算（距離条件がある場合）
出発地点が指定されている場合、Directions API でアクセス時間を計算する：
```bash
export $(grep -v '^#' C:\Users\user\facility-search\.env.local | xargs)
curl -s "https://maps.googleapis.com/maps/api/directions/json?origin=$(python3 -c 'import urllib.parse; print(urllib.parse.quote("出発地"))')&destination=$(python3 -c 'import urllib.parse; print(urllib.parse.quote("目的地"))')&mode=walking&language=ja&key=$GOOGLE_MAPS_API_KEY"
```
mode: driving（車）, walking（徒歩）, bicycling（自転車）, transit（公共交通）

### ステップ5: 結果の提示
各施設について以下の形式で提示する：

```
---
### 1. ○○クリニック ★★★★☆ 4.3 (128件)
📍 東京都渋谷区○○ 1-2-3 ｜ 🚲 自転車12分
- **専門医資格**: ○○学会認定専門医
- **特徴**: △△治療に定評あり、最新の□□機器を導入
- **診療時間**: 月〜金 9:00-18:00

[📍 Googleマップで検索](https://www.google.com/maps/search/○○クリニック+渋谷区) ｜ [🌐 公式サイト](https://example.com) ｜ [📖 参考情報](https://review-site.com/xxx)
---
```

**Google マップリンクの生成ルール：**
- 施設名 + 住所（または地域名）を使って `https://www.google.com/maps/search/` リンクを生成する
- 日本語はそのままURLに含めてよい（ブラウザが自動エンコードする）
