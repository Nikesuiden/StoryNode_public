// setting/page.tsx

"use client";

import DeleteUser from "@/components/elements/deleteUser/deleteUser";
import LogoutButton from "@/components/elements/LogoutButton/LogoutButton";
import MainLayout from "@/components/layouts/mainLayout/mainLayout";
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

      <DeleteUser />
    </MainLayout>
  );
}
