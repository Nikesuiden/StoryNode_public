import { Box } from "@mui/material";
import SideBar from "../sideBar/sideBar";
import BottomBar from "../bottomBar/bottomBar";
import { ReactNode } from "react";

// Propsとしてchildrenを受け取るための型を定義
interface MainLayoutProps {
    children: ReactNode;  // ReactNodeを使うことで、あらゆる子要素を受け入れられる
  }

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <Box>
      <Box
        sx={{
          margin: 2,
          "@media screen and (min-width:700px)": {
            display: "flex",
          },
          "@media screen and (max-width:700px)": {
            paddingBottom: "60px",
          },
        }}
      >
        {/* スマホレスポンシブ */}
        <Box
          sx={{
            "@media screen and (min-width:700px)": {
              display: "none",
            },
          }}
        >
          <BottomBar />
        </Box>

        {/* PCレスポンシブ */}
        <Box
          sx={{
            "@media screen and (max-width:700px)": {
              display: "none",
            },
          }}
        >
          <SideBar />
        </Box>

        {/* アプリ情報情報 */}
        <Box sx={{ flex: 4 }}>{children}</Box>
      </Box>
    </Box>
  );
};

export default MainLayout;