"use client";

import { History } from "@mui/icons-material";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";

export default function ChatHistory() {
  const router = useRouter();
  const handleNavigation = (path: string) => {
    router.push(path);
  };
  return (
    <Button
      variant="contained"
      color="primary"
      sx={{ justifyContent: "center" }}
      onClick={() => handleNavigation("/chatHistory")}
    >
      <History style={{ marginRight: 8 }} />
      チャット履歴
    </Button>
  );
}
