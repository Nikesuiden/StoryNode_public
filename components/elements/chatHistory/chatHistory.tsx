"use client";

import { History, PhoneInTalk } from "@mui/icons-material";
import { Box, Button } from "@mui/material";
import { useRouter } from "next/navigation";

export default function ChatHistory() {
  const router = useRouter();
  const handleNavigation = (path: string) => {
    router.push(path);
  };
  return (
    <Box sx={{display: "flex"}}>
      <PhoneInTalk sx={{fontSize: 50, cursor: 'pointer'}}/>
      <Button
        variant="contained"
        color="primary"
        sx={{ justifyContent: "center" }}
        onClick={() => handleNavigation("/chatHistory")}
      >
        <History style={{ marginRight: 8 }} />
        チャット履歴
      </Button>
    </Box>
  );
}
