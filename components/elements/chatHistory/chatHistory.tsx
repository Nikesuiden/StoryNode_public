import { Flex } from "@chakra-ui/react";
import { History } from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/material";

export default function ChatHistory() {
  return (
    <Box sx={{ display: "flex", alignItems: "center"}}>
      <Typography style={{ flexGrow: 1, fontSize: 30, fontWeight: "550" }}>AI Chat</Typography>
      <Button
        variant="contained"
        color="primary"
        sx={{ justifyContent: "center" }}
      >
        <History style={{ marginRight: 8 }} />
        チャット履歴
      </Button>
    </Box>
  );
}
