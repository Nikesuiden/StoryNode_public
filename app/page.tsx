import ChatHistory from "@/components/elements/chatHistory/chatHistory";
import DiaryInput from "@/components/elements/diaryInput/diaryInput";
import DiaryList from "@/components/elements/diaryList/diaryList";
import TimeDisplay from "@/components/elements/timeDisplay/timeDisplay";
import BottomBar from "@/components/layouts/bottomBar/bottomBar";
import SideBar from "@/components/layouts/sideBar/sideBar";
import TopBar from "@/components/layouts/topBar/topBar";
import { Box } from "@mui/material";

export default function Index() {
  return (
    <Box>
      <Box
        sx={{
          margin: 2,
          "@media screen and (min-width:700px)": {
            display: "flex",
          },
          "@media screen and (max-width:700px)": {
            paddingBottom: "60px",
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
          <TimeDisplay />
          <DiaryInput />
          <hr />
          <DiaryList />
        </Box>
      </Box>
    </Box>
  );
}
