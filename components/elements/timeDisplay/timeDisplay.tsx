import { Box, Typography } from "@mui/material";

export default function TimeDisplay() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1; // 0からカウントするため
  const day = now.getDate();
  return (
    <Box sx={{mb: 2}}>
      <Typography style={{ fontSize: 30, fontWeight: "normal" }}>
        {year}年{month}月{day}日
      </Typography>
    </Box>
  );
}
