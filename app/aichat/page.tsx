import ChatHistory from "@/components/elements/chatHistory/chatHistory";
import BottomBar from "@/components/layouts/bottomBar/bottomBar";
import TopBar from "@/components/layouts/topBar/topBar";
import { Box } from "@mui/material";

export default function Aichat() {
  return (
    <Box>
      <TopBar/>
      <ChatHistory />
      <BottomBar/>
    </Box>
  );
}
