import ToDoInput from "@/components/elements/todoInput/todoInput";
import BottomBar from "@/components/layouts/bottomBar/bottomBar";
import TopBar from "@/components/layouts/topBar/topBar";
import { Box, Typography } from "@mui/material";
import SideBar from "@/components/layouts/sideBar/sideBar";

export default function ToDoList() {
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
          <Typography style={{ flexGrow: 1, fontSize: 30, fontWeight: "550" }}>
            ToDoList
          </Typography>

          <ToDoInput />
        </Box>
      </Box>
    </Box>
  );
}
