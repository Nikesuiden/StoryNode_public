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
        <Box sx={{ display: "flex", marginRight: 0, position: "absolute", right: 20, top: 28,
         }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Notifications sx={{ color: grey, marginRight: 4, fontSize: 35 }} />
            <Typography sx={{ fontSize: 9, ml:0.35 }}>Update</Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Feedback sx={{ color: grey, fontSize: 35 }} />
            <Typography sx={{ fontSize: 8 }}>FeedBack</Typography>
          </Box>
        </Box>
      </Box>
      <hr />
    </Box>
  );
};

export default TopBar;
