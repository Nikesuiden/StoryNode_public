"use client";

import {
  Box,
  Button,
  FormControl,
  InputLabel,
  Select,
  TextField,
  Typography,
} from "@mui/material";

export default function DiaryList() {
  return (
    <Box sx={{ mt: 1.5,  }}>
      <FormControl
        sx={{
          minWidth: 120,
        }}
        fullWidth
      >
        {/* <InputLabel>Emotion</InputLabel> */}
        <Select
          sx={{ width: "30%" , height: 40}}
        ></Select>
      </FormControl>
    </Box>
  );
}
