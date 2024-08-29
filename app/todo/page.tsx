import ToDoInput from "@/components/elements/todoInput/todoInput";
import BottomBar from "@/components/layouts/bottomBar/bottomBar";
import TopBar from "@/components/layouts/topBar/topBar";
import { Box, Typography } from "@mui/material";

export default function ToDoList() {
  return (
    <Box sx={{margin: 2}}>
      <TopBar />
      <Typography style={{ flexGrow: 1, fontSize: 30, fontWeight: "550" }}>ToDoList</Typography>
      <ToDoInput />
      <BottomBar/>
    </Box>
  );
}
