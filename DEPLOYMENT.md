# 請求書・在庫管理システム - デプロイガイド

## 📋 システム概要

完全自動化された請求書・在庫管理システム
- 納品書の写真をアップロード → AI自動読み取り → 在庫に追加
- 請求書作成 → ワンクリックでPDF生成（日本語対応）
- クラウドベース（どこからでもアクセス可能）
- スマホ・タブレット対応

---

## 🚀 セットアップ手順

### ステップ1: Supabaseプロジェクト作成

1. [Supabase](https://supabase.com) にアクセス
2. 「Start your project」をクリック
3. 新しいプロジェクトを作成
4. プロジェクトURL と Anon Key をコピー

#### データベース設定
1. Supabaseダッシュボードで「SQL Editor」を開く
2. `database/schema.sql` の内容をコピー&ペースト
3. 「Run」をクリックしてテーブルを作成

---

### ステップ2: Anthropic API キー取得

1. [Anthropic Console](https://console.anthropic.com) にアクセス
2. API Keysセクションで新しいキーを作成
3. キーをコピー（後で使用）

---

### ステップ3: Vercelデプロイ

#### 方法A: GitHubから（推奨）

1. GitHubアカウントを作成
2. このプロジェクトをGitHubにプッシュ
3. [Vercel](https://vercel.com) にアクセス
4. 「Import Project」からGitHubリポジトリを選択
5. 環境変数を設定：
   - `ANTHROPIC_API_KEY`: あなたのAnthropicキー
   - `NEXT_PUBLIC_SUPABASE_URL`: SupabaseプロジェクトURL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase Anon Key
6. 「Deploy」をクリック

#### 方法B: Vercel CLI

```bash
# Vercel CLIインストール
npm install -g vercel

# プロジェクトディレクトリで実行
cd invoice-system
vercel

# 環境変数を設定
vercel env add ANTHROPIC_API_KEY
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY

# 再デプロイ
vercel --prod
```

---

### ステップ4: アクセス

デプロイ完了後、VercelがURLを発行します（例: `your-app.vercel.app`）

このURLをブックマークすれば：
- ✅ パソコンからアクセス
- ✅ スマホからアクセス
- ✅ タブレットからアクセス
- ✅ どこからでも使える！

---

## 💰 コスト概算

### 無料枠（月間）
- **Vercel**: 無料（Hobbyプラン）
- **Supabase**: 無料（500MB DB、2GB転送量）
- **Anthropic API**: 使用量に応じて（約$5〜20/月）

### 予想月額コスト
- 納品書20枚/月 + 請求書20枚/月 = 約 **$10〜15/月**

---

## 📱 使い方

### 納品書から在庫追加
1. 「📦 在庫管理」タブを開く
2. 「📸 納品書アップロード」で写真を選択
3. AI が自動で商品情報を読み取り
4. 「インポート」をクリック → 完了！

### 請求書作成
1. 「📄 請求書作成」タブを開く
2. 顧客情報を入力
3. 在庫から商品を選択
4. 「📄 PDF生成」ボタンをクリック
5. PDFが自動ダウンロード → 完了！

### 購入履歴確認
1. 「📊 購入履歴」タブを開く
2. 顧客でフィルター
3. 過去の請求書を確認
4. 必要に応じてPDF再生成

---

## 🔧 トラブルシューティング

### 納品書が読み取れない
- 写真を明るい場所で撮影
- 納品書全体が写っているか確認
- 手ぶれに注意

### PDFに文字化け
- 日本語フォントが自動ダウンロードされます
- 初回生成時は少し時間がかかる場合があります

### データが保存されない
- Supabaseの接続を確認
- 環境変数が正しく設定されているか確認

---

## 📞 サポート

問題が発生した場合：
1. ブラウザのコンソールでエラーを確認
2. Vercelのログを確認
3. Supabaseのログを確認

---

## 🎯 今後の拡張機能

- [ ] ユーザー認証（複数ユーザー対応）
- [ ] メール送信機能（請求書を自動送信）
- [ ] データエクスポート（Excel, CSV）
- [ ] 売上レポート・分析
- [ ] 在庫アラート（在庫が少なくなったら通知）
- [ ] モバイルアプリ版

---

## ✅ チェックリスト

デプロイ前の確認：
- [ ] Supabaseプロジェクト作成完了
- [ ] データベーステーブル作成完了
- [ ] Anthropic APIキー取得完了
- [ ] 環境変数設定完了
- [ ] Vercelデプロイ完了
- [ ] 動作確認完了

---

**これで完全自動化・クラウド化されたシステムが完成です！** 🎉
