# ステージ1: アプリケーションのビルド
FROM node:18-alpine AS builder

# 作業ディレクトリを設定
WORKDIR /app

# 依存関係をインストール
COPY package.json package-lock.json ./
RUN npm install

# アプリケーションのソースコードをコピー
COPY . .

# Next.jsアプリケーションをビルド
RUN npm run build

# ステージ2: 本番環境用のイメージ
FROM node:18-alpine AS runner

# 作業ディレクトリを設定
WORKDIR /app

# ビルドステージからビルド済みのアプリケーションをコピー
COPY --from=builder /app/.next /app/.next
COPY --from=builder /app/public /app/public
COPY --from=builder /app/package.json /app/package.json
COPY --from=builder /app/node_modules /app/node_modules

# Next.jsのポートを公開
EXPOSE 3000

# Next.jsアプリケーションを起動
CMD ["npm", "run", "dev"]
