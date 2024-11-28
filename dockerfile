# Node.js ランタイムをベースイメージとして使用
FROM node:18-alpine AS base

# アプリのディレクトリを作成
WORKDIR /app

# 依存関係をインストール
COPY package*.json ./
RUN npm install --production=false

# アプリのソースコードをコンテナにコピー
COPY . .

# Prisma クライアントを生成
RUN npx prisma generate

# Prisma マイグレート
RUN npx prisma migrate deploy

# 本番用にアプリをビルド
RUN npm run build

# 本番モードでアプリを実行
ENV NODE_ENV=production
EXPOSE 3000
CMD ["npm", "run", "start"]