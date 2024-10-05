# ベースイメージとして公式の Node.js イメージを使用
FROM node:16-alpine

# 作業ディレクトリを設定
WORKDIR /app

# パッケージファイルをコピー
COPY package.json package-lock.json ./

# 依存関係をインストール
RUN npm install

# アプリケーションの全ファイルをコピー
COPY . .

# Prisma クライアントを生成
RUN npx prisma generate

# Next.js アプリケーションをビルド
RUN npm run build

# ポートを公開
EXPOSE 3000

# アプリケーションを起動
CMD ["npm", "run", "start"]
