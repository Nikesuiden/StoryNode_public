import { Box, List, ListItem, ListItemText, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RecommendOS() {
  const [isIphone, setIphone] = useState<boolean>(false);
  return (
    <Box
      sx={{
        padding: 2,
        borderRadius: 2,
        backgroundColor: "#f5f5f5",
        maxWidth: 400, // サイズを縮小
        margin: "0 auto", // 全体を中央揃え
      }}
    >
      {/* 推奨環境セクション */}
      <Box sx={{ marginBottom: 2, textAlign: "center" }}>
        <Typography
          variant="h6"
          sx={{ color: "#1976d2", fontWeight: "bold", fontSize: "1rem" }} // サイズ縮小
        > 
          推奨環境
        </Typography>
        <List>
          <ListItem sx={{ justifyContent: "center" }}> {/* リストアイテムを中央揃え */}
            <ListItemText primary="iPhone版 Chrome" sx={{ textAlign: "center" }} />
          </ListItem>
          <ListItem sx={{ justifyContent: "center" }}>
            <ListItemText primary="Android版 Chrome" sx={{ textAlign: "center" }} />
          </ListItem>
          <ListItem sx={{ justifyContent: "center" }}>
            <ListItemText primary="Windows版 Chrome" sx={{ textAlign: "center" }} />
          </ListItem>
          <ListItem sx={{ justifyContent: "center" }}>
            <ListItemText primary="Mac版 Safari" sx={{ textAlign: "center" }} />
          </ListItem>
          <ListItem sx={{ justifyContent: "center" }}>
            <ListItemText primary="Mac版 Chrome" sx={{ textAlign: "center" }} />
          </ListItem>
        </List>
      </Box>

      {/* 非推奨環境セクション */}
      <Box sx={{ marginTop: 2, textAlign: "center" }}>
        <Typography
          variant="h6"
          sx={{ color: "#d32f2f", fontWeight: "bold", fontSize: "1rem" }} // サイズ縮小
        >
          非推奨環境
        </Typography>
        <List>
          <ListItem sx={{ justifyContent: "center" }}>
            <ListItemText primary="iPhone版 Safari" sx={{ textAlign: "center" }} />
          </ListItem>
          <ListItem sx={{ justifyContent: "center" }}>
            <ListItemText primary="iPad版 Safari" sx={{ textAlign: "center" }} />
          </ListItem>
        </List>
        <Typography
          sx={{
            cursor: "pointer",
            color: "#1976d2",
            fontSize: "0.9rem", // サイズ縮小
            "&:hover": {
              color: "#004ba0",
            },
          }}
        >
          iPhone版 iPad版 Safariの方はこちら
        </Typography>
      </Box>
    </Box>
  );
}
