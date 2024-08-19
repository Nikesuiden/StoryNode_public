import { Flex } from "@chakra-ui/react";
import { Box, Typography } from "@mui/material";

export default function TopBar() {
  return (
    <Box
      style={{
        display: "flex",
        textAlign: "center",
        paddingTop: 10,
        paddingBottom: 30,
      }}
    >
      <Typography style={{ fontSize: 30, fontWeight: "normal" }}>
        StoryNode
      </Typography>
      <Typography
        style={{
          fontSize: 16,
          marginLeft: 12,
          marginTop: 15,
          fontWeight: 550,
        }}
      >
        Essential
      </Typography>
    </Box>
  );
}
