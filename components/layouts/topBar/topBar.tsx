import { Flex } from "@chakra-ui/react";
import { Box, Typography } from "@mui/material";

export default function TopBar() {
  return (
    <Box style={{display: 'flex', textAlign: 'center'}}>
      <Typography style={{fontSize: 25}}>StoryNode</Typography>
      <Typography style={{fontSize: 15, marginLeft: 12, marginTop:10}}>Essential</Typography>
    </Box>
  );
}
