// next.config.mjs

import nextPWA from "next-pwa"; // ESモジュールでのインポート

const withPWA = nextPWA({
  disable: process.env.NODE_ENV === "development", // 開発モードでは無効化
  dest: "public", // PWA ファイルの出力先
  register: true, // Service Worker を自動登録
  skipWaiting: true, // 古い Service Worker を即時更新
});

const nextConfig = withPWA({
  reactStrictMode: true, // React の厳密モード
  output: "standalone", // スタンドアロンモードでビルド
});

export default nextConfig;
