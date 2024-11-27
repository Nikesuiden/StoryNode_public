import { Box } from "@mui/material";

export default function LoadingProgress() {
  return (
    <Box
      sx={{
        // カスタムプロパティの定義
        "--size": "35px",
        "--color": "currentColor", // currentColorを使用
        "--animation-timing-function": "linear",
        "--animation-duration": "1s",

        // 基本スタイル
        width: "var(--size)",
        height: "var(--size)",
        borderRadius: "50%",
        color: "primary.main", // テーマのprimary色を設定

        // マスクと背景の設定
        maskImage:
          "radial-gradient(circle at 50% 50%, transparent calc(var(--size) / 3), black calc(var(--size) / 3))",
        backgroundImage:
          "conic-gradient(transparent, transparent 135deg, currentColor)",

        // アニメーションの設定
        animation:
          "circle-spin-8-animation var(--animation-duration) var(--animation-timing-function) infinite",

        // キーフレームの定義
        "@keyframes circle-spin-8-animation": {
          from: {
            transform: "rotate(0deg)",
          },
          to: {
            transform: "rotate(360deg)",
          },
        },
      }}
    />
  );
}
