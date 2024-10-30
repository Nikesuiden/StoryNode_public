"use client";

import {
  ImportContacts,
  Forum,
  CheckCircle,
  Settings,
} from "@mui/icons-material";
import {
  AppBar,
  CssBaseline,
  Toolbar,
  Box,
  Typography,
  Drawer,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
} from "@mui/material";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { cloneElement, useEffect, useState } from "react";

interface UserProps {
  user: User | null;
}

const SideBar: React.FC<UserProps> = ({ user }) => {
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const drawerWidth = 180;

  const router = useRouter();
  const handleNavigation = (path: string) => {
    router.push(path);
  };

  useEffect(() => {
    if (user) {
      setProfilePicture(user.user_metadata.avatar_url);
    }
  }, [user]);

  const icons = [
    { component: <ImportContacts fontSize="large" />, key: "importContacts" },
    { component: <Forum fontSize="large" />, key: "forum" },
    { component: <CheckCircle fontSize="large" />, key: "checkCircle" },
    {
      component: (
        <Avatar
          src={profilePicture ?? undefined}
          alt="User Profile"
          sx={{ width: "40", height: "40", cursor: "pointer" }}
        />
      ),
      key: "settings",
    },
  ];

  const urls = ["/", "/aichat", "/todo", "/settings"];

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}
      ></AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <List sx={{ ml: 2 }}>
          {["Diary", "AIchat", "ToDo", "Accounts"].map((text, index) => (
            <ListItem
              key={text}
              disablePadding
              onClick={() => handleNavigation(urls[index])}
            >
              <ListItemButton sx={{ marginTop: 1 }}>
                <ListItemIcon>
                  {cloneElement(icons[index].component, {
                    key: icons[index].key,
                  })}
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </Box>
  );
};

export default SideBar;
