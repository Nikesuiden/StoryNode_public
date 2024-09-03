import AiChatForm from "@/components/elements/aiChatForm/aiChatForm";
import ChatHistory from "@/components/elements/chatHistory/chatHistory";
import BottomBar from "@/components/layouts/bottomBar/bottomBar";
import SideBar from "@/components/layouts/sideBar/sideBar";
import TopBar from "@/components/layouts/topBar/topBar";
import { Box, Typography } from "@mui/material";

export default function Aichat() {
  return (
    <Box>
      <Box
        sx={{
          margin: 2,
          "@media screen and (min-width:700px)": {
            display: "flex",
          },
        }}
      >
        {/* スマホレスポンシブ */}
        <Box
          sx={{
            "@media screen and (min-width:700px)": {
              display: "none",
            },
          }}
        >
          <BottomBar />
        </Box>

        {/* PCレスポンシブ */}
        <Box
          sx={{
            "@media screen and (max-width:700px)": {
              display: "none",
            },
          }}
        >
          <SideBar />
        </Box>

        {/* アプリ情報情報 */}
        <Box sx={{ flex: 4 }}>
          <TopBar />
          <Typography style={{ flexGrow: 1, fontSize: 30, fontWeight: "550" }}>
            AI Chat
          </Typography>

          <AiChatForm />
        </Box>
      </Box>
    </Box>
  );
}
