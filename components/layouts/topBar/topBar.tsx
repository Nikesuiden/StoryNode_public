"use client";

import { Box, Typography } from "@mui/material";
import { User } from "@supabase/supabase-js";

interface TopBarProps {
  user: User | null; // MainLayoutから渡されるユーザー情報
}

const TopBar: React.FC<TopBarProps> = ({ user }) => {
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

        <Typography style={{ fontSize: 15 }}>
          {user ? `${user.email}` : "ログインしていません"}
        </Typography>
      </Box>
      <hr />
    </Box>
  );
};

export default TopBar;
