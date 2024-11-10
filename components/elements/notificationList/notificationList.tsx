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
    title: "お知らせタイトル1",
    date: "2023-10-01",
    content: (
      <Typography>
        テスト
      </Typography>
    ),
  },
  {
    id: 2,
    title: "お知らせタイトル2",
    date: "2023-09-15",
    content: <Typography>複数の投稿確認</Typography>,
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
