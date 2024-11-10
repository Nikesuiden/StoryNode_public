// pages/notifications.tsx
"use client";

import React from "react";
import { Container } from "@mui/material";
import NotificationList from "@/components/elements/notificationList/notificationList";
import MainLayout from "@/components/layouts/mainLayout/mainLayout";

const Notifications: React.FC = () => {
  return (
    <MainLayout>
      <Container maxWidth="md" style={{ paddingTop: "2rem" }}>
        <NotificationList />
      </Container>
    </MainLayout>
  );
};

export default Notifications;
