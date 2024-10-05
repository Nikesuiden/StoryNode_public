/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",       // Next.js のページやコンポーネント
    "./components/**/*.{js,ts,jsx,tsx}", // コンポーネントディレクトリ
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

