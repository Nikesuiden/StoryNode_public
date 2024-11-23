// bottomBar.tsx

"use client";
import { background } from "@chakra-ui/react";
import {
  ImportContacts,
  Forum,
  Hub,
  CheckCircle,
  Settings,
  BarChart,
} from "@mui/icons-material";
import {
  Box,
  BottomNavigation,
  BottomNavigationAction,
  Divider,
  Avatar,
} from "@mui/material";
import { User } from "@supabase/supabase-js";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface UserProps {
  user: User | null;
}

const BottomBar: React.FC<UserProps> = ({ user }) => {
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [selectedMenu, SetSelectedMenu] = useState<string>("");

  const router = useRouter();
  const handleNavigation = (path: string) => {
    router.push(path);
  };

  useEffect(() => {
    if (user) {
      setProfilePicture(user.user_metadata.avatar_url);
    }
  }, [user]);

  // マウントするたび、URLの末尾 (path) の名前を取得
  useEffect(() => {
    SetSelectedMenu(window.location.pathname);
  });

  return (
    <Box
      sx={{
        position: "fixed",
        left: 0,
        bottom: 0,
        height: "80px",
        width: "100%",
        zIndex: 10,
      }}
    >
      <Divider />
      <BottomNavigation showLabels sx={{ height: 80, paddingBottom: 2.5 }}>
        <BottomNavigationAction
          label="Diary"
          icon={<ImportContacts fontSize="large" />}
          onClick={() => handleNavigation("/")}
          sx={{ color: selectedMenu === "/" ? "#2092cb" : null }}
        />
        <BottomNavigationAction
          label="AIchat"
          icon={<Forum fontSize="large" />}
          onClick={() => handleNavigation("/aichat")}
          sx={{
            color:
              selectedMenu === "/aichat" || selectedMenu === "/chatHistory"
                ? "#2092cb"
                : null,
          }}
        />
        <BottomNavigationAction
          label="Analysis"
          value={"/analysis"}
          icon={<BarChart fontSize="large" />}
          onClick={() => handleNavigation("/analysis")}
          sx={{ color: selectedMenu === "/analysis" ? "#2092cb" : null }}
        />
        <BottomNavigationAction
          label="ToDo"
          value={"/todo"}
          icon={<CheckCircle fontSize="large" />}
          onClick={() => handleNavigation("/todo")}
          sx={{ color: selectedMenu === "/todo" ? "#2092cb" : null }}
        />
        <BottomNavigationAction
          label="Account"
          value={"/settings"}
          icon={
            <Avatar
              src={profilePicture ?? undefined}
              alt="User Profile"
              sx={{ width: 35, height: 35, cursor: "pointer" }}
            />
          }
          onClick={() => handleNavigation("/settings")}
          sx={{ color: selectedMenu === "/settings" ? "#2092cb" : null }}
        />
      </BottomNavigation>
    </Box>
  );
};

export default BottomBar;
