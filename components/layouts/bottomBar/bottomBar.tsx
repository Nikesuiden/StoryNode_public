// bottomBar.tsx

"use client";
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

  const router = useRouter();
  const handleNavigation = (path: string) => {
    router.push(path);
  };

  useEffect(() => {
    if (user) {
      setProfilePicture(user.user_metadata.avatar_url);
    }
  }, [user]);

  return (
    <Box
      sx={{ position: "fixed", left: 0, bottom: 0, width: "100%", zIndex: 10 }}
    >
      <Divider />
      <BottomNavigation showLabels sx={{ height: 65 }}>
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
        <BottomNavigationAction
          label="Analysis"
          icon={<BarChart fontSize="large" />}
          onClick={() => handleNavigation("/analysis")}
        />
        <BottomNavigationAction
          label="ToDo"
          icon={<CheckCircle fontSize="large" />}
          onClick={() => handleNavigation("/todo")}
        />
        <BottomNavigationAction
          label="Account"
          icon={
            <Avatar
              src={profilePicture ?? undefined}
              alt="User Profile"
              sx={{ width: 35, height: 35, cursor: "pointer" }}
            />
          }
          onClick={() => handleNavigation("/settings")}
        />
      </BottomNavigation>
    </Box>
  );
};

// 背景カラーは#5A5A5A

export default BottomBar;
