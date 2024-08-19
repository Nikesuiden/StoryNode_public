import ToDoInput from "@/components/elements/todoInput/todoInput";
import BottomBar from "@/components/layouts/bottomBar/bottomBar";
import TopBar from "@/components/layouts/topBar/topBar";
import { Box } from "@mui/material";

export default function ToDoList() {
  return (
    <Box sx={{margin: 2}}>
      <TopBar />
      <ToDoInput />
      <BottomBar/>
    </Box>
  );
}
