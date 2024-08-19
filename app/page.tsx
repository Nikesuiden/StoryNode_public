import ChatHistory from "@/components/elements/chatHistory/chatHistory";
import DiaryInput from "@/components/elements/diaryInput/diaryInput";
import BottomBar from "@/components/layouts/bottomBar/bottomBar";
import TopBar from "@/components/layouts/topBar/topBar";
import { Box } from "@mui/material";

export default function Index() {
  return (
    <Box sx={{ margin: 2 }}>
      <TopBar />
      <DiaryInput />
      <hr />
      <BottomBar />
    </Box>
  );
}
