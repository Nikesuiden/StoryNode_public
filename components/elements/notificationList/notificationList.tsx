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
  {
    id: 2,
    title: "PWAに対応する予定です。",
    date: "2024-11-21",
    content: (
      <Typography>
        PWAとは、Web上でネイティブアプリ同等のUXを実現できる技術のことです。
      </Typography>
    ),
  },
  {
    id: 3,
    title: "<重要> PWAを実装しました。",
    date: "2024-11-23",
    content: (
      <Typography>
        UX向上のため、ホーム画面にアイコンを追加して利用することを推奨します。
      </Typography>
    ),
  },
];

// 日付を降順にソート
const sortedNotifications = notifications.sort((a, b) => {
  // `date`を新しい順にソート
  return new Date(b.date).getTime() - new Date(a.date).getTime();
});

export default function NotificationList() {
  return (
    <Stack spacing={4}>
      {sortedNotifications.map((notification) => (
        <NotificationItem key={notification.id} {...notification} />
      ))}
    </Stack>
  );
}
