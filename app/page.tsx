import ChatHistory from "@/components/elements/chatHistory/chatHistory";
import BottomBar from "@/components/layouts/bottomBar/bottomBar";
import TopBar from "@/components/layouts/topBar/topBar";

export default function Index() {
  return (
    <div>
      <TopBar />
      <ChatHistory />
      <BottomBar/>
    </div>
  );
}
