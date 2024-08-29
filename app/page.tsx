import ChatHistory from "@/components/elements/chatHistory/chatHistory";
import DiaryInput from "@/components/elements/diaryInput/diaryInput";
import DiaryList from "@/components/elements/diaryList/diaryList";
import TimeDisplay from "@/components/elements/timeDisplay/timeDisplay";
import BottomBar from "@/components/layouts/bottomBar/bottomBar";
import TopBar from "@/components/layouts/topBar/topBar";
import { Box } from "@mui/material";

export default function Index() {

  return (
    <Box sx={{ margin: 2 }}>
      <TopBar />
      <TimeDisplay />
      <DiaryInput />
      <hr />
      <DiaryList />
      <BottomBar />
    </Box>
  );
}
