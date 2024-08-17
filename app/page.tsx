import ChatHistory from "@/components/elements/chatHistory/chatHistory";
import DiaryInput from "@/components/elements/diaryInput/diaryInput";
import BottomBar from "@/components/layouts/bottomBar/bottomBar";
import TopBar from "@/components/layouts/topBar/topBar";
import { BackHand } from "@mui/icons-material";
import { Box } from "@mui/material";

export default function Index() {
  return (
    <Box>
      <Box style={{ margin: 15 }}>
        <TopBar />
        <ChatHistory />
        <DiaryInput />
      </Box>
      <BottomBar />
    </Box>
  );
}
