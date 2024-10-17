"use client";

import LogoutButton from "@/components/elements/LogoutButton/LogoutButton";
import ToDoInput from "@/components/elements/todoInput/todoInput";
import BottomBar from "@/components/layouts/bottomBar/bottomBar";
import MainLayout from "@/components/layouts/mainLayout/mainLayout";
import SideBar from "@/components/layouts/sideBar/sideBar";
import TopBar from "@/components/layouts/topBar/topBar";
import { Button, Typography, Box } from "@mui/material";
import { useRouter } from "next/navigation";

export default function Settings() {
  const router = useRouter();
  const handleNavigation = (path: string) => {
    router.push(path);
  };
  return (
    <MainLayout>
      <Typography style={{ flexGrow: 1, fontSize: 30, fontWeight: "550" }}>
        Settings
      </Typography>

      <LogoutButton />
    </MainLayout>
  );
}
