# IT相談窓口（静的サイト）

## 構成
- GitHub Pages: フロント（index.html / styles.css / app.js）
- Vercel Serverless: 問い合わせ受付 + お礼メール送信（api/contact.js）
- メール送信: Resend

## セットアップ
1. `app.js` の `API_ENDPOINT` を自分のVercel URLに変更
2. Vercel環境変数を設定
   - RESEND_API_KEY
   - ADMIN_TO_EMAIL
   - FROM_EMAIL
3. GitHub Pagesを有効化
