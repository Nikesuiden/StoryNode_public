import {
  ImportContacts,
  Forum,
  Hub,
  CheckCircle,
  Settings,
  CoPresentSharp,
} from "@mui/icons-material";
import {
  Box,
  Button,
  BottomNavigation,
  BottomNavigationAction,
  makeStyles,
} from "@mui/material";
import { constants } from "buffer";
import { px } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

// const useStyles = makeStyles({
//     root: {
//         width: 500,
//     },
// });

export default function BottomBar() {
    // const classes = useStyles();
    // const [value, setValue] = useState(0);
  return (
    <Box>
      <BottomNavigation showLabels>
        <BottomNavigationAction label="Diary" icon={<ImportContacts fontSize="large"/>} />
        <BottomNavigationAction label="AIchat" icon={<Forum fontSize="large"/>} />
        <BottomNavigationAction label="StoryNode" icon={<Hub fontSize="large"/>} />
        <BottomNavigationAction label="ToDo" icon={<CheckCircle fontSize="large"/>} />
        <BottomNavigationAction label="Settings" icon={<Settings fontSize="large"/>} />
      </BottomNavigation>
    </Box>
  );
}
