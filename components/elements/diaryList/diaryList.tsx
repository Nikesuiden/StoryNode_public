"use client";

import {
  Box,
  Button,
  FormControl,
  InputLabel,
  Select,
  TextField,
  Typography,
  MenuItem,
} from "@mui/material";
import { useState } from "react";

export default function DiaryList() {
  const [listEmotion, setListEmotion] = useState<string>("all");

  const ListEmotionChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setListEmotion(event.target.value as string);
  };

  return (
    <Box sx={{ mt: 1.5 }}>
      <FormControl
        sx={{
          minWidth: 120,
        }}
        fullWidth
      >
        {/* <InputLabel>Emotion</InputLabel> */}
        <Select sx={{ width: "30%", height: 40 }} value={listEmotion} onChange={ListEmotionChange}>
          <MenuItem value={"all"}>すべて</MenuItem>
          <MenuItem value={"none"}>--未設定--</MenuItem>
          <MenuItem value={"grad"}>嬉しい</MenuItem>
          <MenuItem value={"Funny"}>楽しみ</MenuItem>
          <MenuItem value={"expectations"}>期待</MenuItem>
          <MenuItem value={"happy"}>幸せ</MenuItem>
          <MenuItem value={"surprise"}>驚き</MenuItem>
          <MenuItem value={"sad"}>悲しい</MenuItem>
          <MenuItem value={"angry"}>怒り</MenuItem>
          <MenuItem value={"anxiety"}>不安</MenuItem>
        </Select>
      </FormControl>
      <Typography>{listEmotion}</Typography>
    </Box>
  );
}
