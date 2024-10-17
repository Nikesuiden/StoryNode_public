"use client";

import { History, PhoneInTalk } from "@mui/icons-material";
import { Box, Button } from "@mui/material";
import { useRouter } from "next/navigation";

export default function ChatHistory() {
  const router = useRouter();
  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const tellCaution = () => {
    alert("音声対話もうちょっとまって🙏")
  }
  return (
    <Box sx={{ display: "flex" }}>
      <Box onClick={() => tellCaution()}>
        <PhoneInTalk sx={{ fontSize: 50, cursor: "pointer" }} />
      </Box>
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
