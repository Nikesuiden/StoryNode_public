"use client";
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

import { useRouter } from "next/navigation";

export default function BottomBar() {
  const router = useRouter();
  const handleNavigation = (path: string) => {
    router.push(path);
  };
  return (
    <Box style={{ position: "fixed", left: 0, bottom: 0, width: "100%" }}>
      <BottomNavigation showLabels sx={{ height: 60 }}>
        <BottomNavigationAction
          label="Diary"
          icon={<ImportContacts fontSize="large" />}
          onClick={() => handleNavigation("/")}
        />
        <BottomNavigationAction
          label="AIchat"
          icon={<Forum fontSize="large" />}
          onClick={() => handleNavigation("/aichat")}
        />
        {/* <BottomNavigationAction
          label="StoryNode"
          icon={<Hub fontSize="large" />}
        /> */}
        <BottomNavigationAction
          label="ToDo"
          icon={<CheckCircle fontSize="large" />}
          onClick={() => handleNavigation("/todo")}
        />
        <BottomNavigationAction
          label="Settings"
          icon={<Settings fontSize="large" />}
        />
      </BottomNavigation>
    </Box>
  );
}

// 背景カラーは#5A5A5A
