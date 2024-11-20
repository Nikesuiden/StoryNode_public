// topBar.tsx

"use client";

import {
  AutoStories,
  Feedback,
  Lightbulb,
  Notifications,
} from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
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
    <Box sx={{ mb: "1rem" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          paddingTop: "0.625rem",     // 10px → 0.625rem
          paddingBottom: "0.75rem",   // 12px → 0.75rem
        }}
      >
        <Typography sx={{ fontSize: "1.875rem", fontWeight: 550 }}> {/* 30px → 1.875rem */}
          StoryNode
        </Typography>

        <Box
          sx={{
            display: "flex",
            position: "absolute",
            right: "1.25rem",   // 20px → 1.25rem
            top: "1.75rem",     // 28px → 1.75rem
          }}
        >
          {/* 「使い方」アイコン */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              cursor: "pointer",
              marginRight: "1rem", // 適宜調整
            }}
            onClick={() => handleNavigation("/howto")}
          >
            <Lightbulb sx={{ fontSize: "2.1875rem" }} /> {/* 35px → 2.1875rem */}
            <Typography sx={{ fontSize: "0.625rem", marginLeft: "0.021875rem" }}> {/* 10px → 0.625rem, 0.35px → 0.021875rem */}
              使い方
            </Typography>
          </Box>

          {/* 「Update」アイコン */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              cursor: "pointer",
              marginRight: "1rem", // 適宜調整
            }}
            onClick={() => handleNavigation("/notifications")}
          >
            <Notifications sx={{ fontSize: "2.1875rem" }} />
            <Typography sx={{ fontSize: "0.5625rem", marginLeft: "0.021875rem" }}> {/* 9px → 0.5625rem */}
              Update
            </Typography>
          </Box>

          {/* 「FeedBack」アイコン */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              cursor: "pointer",
            }}
          >
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLSfvXvSbzokIpUih6UEzyfqMDpcZj8x_8vnGAVrYYAjUcxZwVQ/viewform?usp=sf_link"
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <Feedback sx={{ fontSize: "2.1875rem" }} />
              <Typography sx={{ fontSize: "0.5rem" }}> {/* 8px → 0.5rem */}
                FeedBack
              </Typography>
            </a>
          </Box>
        </Box>
      </Box>
      <hr />
    </Box>
  );
};

export default TopBar;
