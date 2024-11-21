// topBar.tsx

"use client";

import {
  AutoStories,
  Feedback,
  Lightbulb,
  Notifications,
} from "@mui/icons-material";
import { Box, Divider, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

interface UserProps {
  user: User | null; // MainLayoutから渡されるユーザー情報
}

const TopBar: React.FC<UserProps> = ({ user }) => {
  const router = useRouter();
  const handleNavigation = (path: string) => {
    router.push(path);
  };

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
        <Typography
          style={{
            fontSize: 30,
            fontWeight: "550",
            top: 15,
            position: "absolute",
          }}
        >
          StoryNode
        </Typography>

        <Box
          sx={{
            display: "flex",
            marginRight: 0,
            position: "absolute",
            right: 20,
            top: 18,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              cursor: "pointer",
              marginRight: 4,
            }}
          >
            <Lightbulb sx={{ color: grey, fontSize: 30 }} />
            <Typography sx={{ fontSize: 8, ml: 0.35 }}>使い方</Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              cursor: "pointer",
              marginRight: 4,
            }}
            onClick={() => handleNavigation("/notifications")}
          >
            <Notifications sx={{ color: grey, fontSize: 30 }} />
            <Typography sx={{ fontSize: 8, ml: 0.35 }}>Update</Typography>
          </Box>
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSfvXvSbzokIpUih6UEzyfqMDpcZj8x_8vnGAVrYYAjUcxZwVQ/viewform?usp=sf_link"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                cursor: "pointer",
                position: "relative",
                mr: 1
              }}
            >
              <Feedback sx={{ color: grey, fontSize: 30 }} />
              <Typography sx={{ fontSize: 8 , position: "absolute", top: 30, right: -4}}>FeedBack</Typography>
            </Box>
          </a>
        </Box>
      </Box>
      <Divider sx={{ mt: 3 }} />
    </Box>
  );
};

export default TopBar;
