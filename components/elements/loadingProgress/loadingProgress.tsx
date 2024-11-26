import { Box } from "@mui/material";

export default function LoadingProgress() {
  return (
    <Box
      sx={{
        "--size": "33px",
        "--stroke-width": "calc(var(--size) / 6)",
        "--color": "currentColor",
        "--animation-timing-function": "linear",
        "--animation-duration": "1s",
        width: "var(--size)",
        height: "var(--size)",
        borderWidth: "var(--stroke-width)",
        borderStyle: "solid",
        borderColor: "var(--color) transparent var(--color) transparent",
        borderRadius: "50%",
        transform: "rotate(0deg)",
        animation:
          "circle-spin-3-animation var(--animation-duration) var(--animation-timing-function) infinite",
        "@keyframes circle-spin-3-animation": {
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
