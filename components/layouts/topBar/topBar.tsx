"use client";

import {
  Feedback,
  Notifications,
} from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import { User } from "@supabase/supabase-js";

interface UserProps {
  user: User | null; // MainLayoutから渡されるユーザー情報
}

const TopBar: React.FC<UserProps> = ({ user }) => {

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

        <Box
          sx={{
            display: "flex",
            marginRight: 0,
            position: "absolute",
            right: 20,
            top: 28,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <Notifications sx={{ color: grey, marginRight: 4, fontSize: 35 }} />
            <Typography sx={{ fontSize: 9, ml: 0.35 }}>Update</Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <a href="https://docs.google.com/forms/d/e/1FAIpQLSfvXvSbzokIpUih6UEzyfqMDpcZj8x_8vnGAVrYYAjUcxZwVQ/viewform?usp=sf_link" target="_blank" rel="noopener noreferrer" >
              <Feedback sx={{ color: grey, fontSize: 35 }}  />
              <Typography sx={{ fontSize: 8 }}>FeedBack</Typography>
            </a>
          </Box>
        </Box>
      </Box>
      <hr />
    </Box>
  );
};

export default TopBar;
