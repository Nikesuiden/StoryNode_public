"use client";

import { Mail } from "@mui/icons-material";
import { Avatar, Box, Typography } from "@mui/material";
import { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

interface TopBarProps {
  user: User | null; // MainLayoutから渡されるユーザー情報
}

const TopBar: React.FC<TopBarProps> = ({ user }) => {
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  useEffect(() => {
    if (user) {
      setProfilePicture(user.user_metadata.avatar_url);
    }
  }, []);
  return (
    <Box sx={{ mb: 2 }}>
      <Box
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          paddingTop: 10,
          paddingBottom: 12,
        }}
      >
        <Typography style={{ fontSize: 30, fontWeight: "550" }}>
          StoryNode
        </Typography>

        {/* <Typography style={{ fontSize: 15 }}>
          {user ? `${user.user_metadata.full_name}` : "ログインしていません"}
        </Typography> */}
        
        {profilePicture ? (
          <Avatar
            src={profilePicture}
            alt="User Profile"
            sx={{ width: "70", height: "70", cursor: "pointer" }}
          />
        ) : (
          <Mail sx={{ width: "70", height: "70", cursor: "pointer" }}/>
        )}
      </Box>
      <hr />
    </Box>
  );
};

export default TopBar;
