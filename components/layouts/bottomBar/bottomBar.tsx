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

export default function BottomBar() {
  return (
    <Box style={{top: 0, left: 0}}>
      <BottomNavigation showLabels>
        <BottomNavigationAction
          label="Diary"
          icon={<ImportContacts fontSize="large" />}
        />
        <BottomNavigationAction
          label="AIchat"
          icon={<Forum fontSize="large" />}
        />
        <BottomNavigationAction
          label="StoryNode"
          icon={<Hub fontSize="large" />}
        />
        <BottomNavigationAction
          label="ToDo"
          icon={<CheckCircle fontSize="large" />}
        />
        <BottomNavigationAction
          label="Settings"
          icon={<Settings fontSize="large" />}
        />
      </BottomNavigation>
    </Box>
  );
}
