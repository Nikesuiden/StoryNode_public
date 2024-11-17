// components/NotificationList.tsx
import React from "react";
import { Stack, Typography } from "@mui/material";
import NotificationItem from "../notificationItem/notificationItem";

interface Notification {
  id: number;
  title: string;
  date: string;
  content: JSX.Element;
}

const notifications: Notification[] = [
  {
    id: 1,
    title: "追加する予定の機能",
    date: "2024-11-17",
    content: (
      <Typography>
        1. アカウント削除機能 <br />
        2. 説明書機能 <br />
        3. 日記から感情を統計分析する機能
      </Typography>
    ),
  },
];

const NotificationList: React.FC = () => {
  return (
    <Stack spacing={4}>
      {notifications.map((notification) => (
        <NotificationItem key={notification.id} {...notification} />
      ))}
    </Stack>
  );
};

export default NotificationList;
