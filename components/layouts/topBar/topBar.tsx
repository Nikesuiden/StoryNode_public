import { Flex } from "@chakra-ui/react";
import { Box, Typography } from "@mui/material";

export default function TopBar() {
  return (
    <Box style={{display: 'flex', textAlign: 'center', alignItems: "stretch"}}>
      <Typography style={{fontSize: 30}}>StoryNode</Typography>
      <Typography style={{fontSize: 20, marginLeft: 15}}>Essential</Typography>
    </Box>
  );
}
