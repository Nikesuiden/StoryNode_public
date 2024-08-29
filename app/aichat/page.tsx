import AiChatForm from "@/components/elements/aiChatForm/aiChatForm";
import ChatHistory from "@/components/elements/chatHistory/chatHistory";
import BottomBar from "@/components/layouts/bottomBar/bottomBar";
import TopBar from "@/components/layouts/topBar/topBar";
import { Box } from "@mui/material";

export default function Aichat() {
  return (
    <Box sx={{margin: 2}}>
      <TopBar/>
      
      <ChatHistory />
      <AiChatForm />
      <BottomBar/>
    </Box>
  );
}
