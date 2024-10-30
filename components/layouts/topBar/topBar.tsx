"use client";

import {
  BorderClear,
  Feedback,
  Mail,
  Notifications,
} from "@mui/icons-material";
import { Avatar, Box, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

interface UserProps {
  user: User | null; // MainLayoutから渡されるユーザー情報
}

const TopBar: React.FC<UserProps> = ({ user }) => {
  const [profilePicture, setProfilePicture] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setProfilePicture(user.user_metadata.avatar_url);
    }
  }, [user]);
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
        <Box sx={{display: "flex"}}>
          <Notifications sx={{color: grey}}/>
          <Feedback sx={{color: grey}}/>
        </Box>
      </Box>
      <hr />
    </Box>
  );
};

export default TopBar;
