// components/NotificationItem.tsx
import React from "react";
import { Box, Typography } from "@mui/material";

interface NotificationItemProps {
  title: string;
  date: string;
  content: JSX.Element;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  title,
  date,
  content,
}) => {
  return (
    <Box
      sx={{
        marginTop: 2,
        border: "1px solid gray",
        borderRadius: 1,
        padding: 2,
        backgroundColor: "white",
      }}
    >
      <Typography variant="h5" gutterBottom component="div">
        {title}
      </Typography>
      <Typography
        variant="caption"
        display="block"
        gutterBottom
        component="div"
      >
        {date}
      </Typography>
      <Box>{content}</Box>
    </Box>
  );
};

export default NotificationItem;
