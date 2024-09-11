"use client";

import { MoreHoriz } from "@mui/icons-material";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  Select,
  TextField,
  Typography,
  MenuItem,
  SelectChangeEvent,
  Menu,
  MenuItem as MuiMenuItem,
  IconButton,
} from "@mui/material";

import { useState, useEffect, MouseEvent } from "react";

interface DiaryPost {
  id: number;
  content: string;
  emotion: string;
  createdAt: string;
}

interface DiaryListProps {
  initialData: DiaryPost[] | null;
}

const DiaryList: React.FC<DiaryListProps> = ({ initialData }) => {
  const [listEmotion, setListEmotion] = useState<string>("all");
  const [diaryPosts, setDiaryPosts] = useState<DiaryPost[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedPost, setSelectedPost] = useState<DiaryPost | null>(null);
  const [editContent, setEditContent] = useState<string>("");
  const [editEmotion, setEditEmotion] = useState<string>("none");

  // 時間と分を抽出する関数
  const hourAndMinutes = (dateTimeString: string) => {
    const date = new Date(dateTimeString); // 文字列をDateオブジェクトに変換
    const hours = date.getHours().toString().padStart(2, "0"); // 時間を取得
    const minutes = date.getMinutes().toString().padStart(2, "0"); // 分を取得
    return `${hours}:${minutes}`; // "HH:MM"の形式で返す
  };

  // メニューの表示制御
  const handleClick = (event: MouseEvent<HTMLElement>, post: DiaryPost) => {
    setAnchorEl(event.currentTarget);
    setSelectedPost(post);
    setEditContent(post.content);
    setEditEmotion(post.emotion);
  };

  const ListEmotionChange = (event: SelectChangeEvent) => {
    setListEmotion(event.target.value as string);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEditOpen = () => {
    if (selectedPost) {
      setEditContent(selectedPost.content);
      setEditEmotion(selectedPost.emotion);
    }
    handleClose(); // メニューを閉じる
  };

  const handleEdit = async () => {
    console.log("1");

    if (selectedPost) {
      try {
        const response = await fetch(`/api/diaryPost/${selectedPost.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: editContent, emotion: editEmotion }),
        });

        console.log("2"); // リクエストが送信された後のログ

        if (response.ok) {
          console.log("3"); // 正常に更新された場合のログ
          await fetchDiaryPosts(); // 日記一覧を再取得
        } else {
          const errorMessage = await response.text();
          console.error(
            "Failed to update diary post:",
            response.status,
            errorMessage
          );
        }

        console.log("4"); // fetchDiaryPosts()の後に表示
      } catch (error) {
        console.error("Error updating diary post:", error);
      }
    }

    handleClose();
  };

  const handleDelete = async () => {
    if (selectedPost) {
      try {
        const response = await fetch(`/api/diaryPost/${selectedPost.id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          fetchDiaryPosts(); // 日記一覧を再取得
        } else {
          console.error("Failed to delete diary post");
        }
      } catch (error) {
        console.error("Error deleting diary post:", error);
      }
    }
    handleClose();
  };

  // APIから日記の一覧を取得する関数
  const fetchDiaryPosts = async () => {
    try {
      const response = await fetch("/api/diaryPost", {
        method: "GET",
      });
      if (response.ok) {
        const data = await response.json();
        setDiaryPosts(data); // 取得した日記データを状態に保存
      } else {
        console.error("Failed to fetch diary posts");
      }
    } catch (error) {
      console.error("Error fetching diary posts:", error);
    }
  };

  // initialData を使って日記データの初期値をセット
  useEffect(() => {
    if (initialData) {
      setDiaryPosts(initialData); // initialData が存在する場合にセット
    }
  }, [initialData]);



  return (
    <Box sx={{ mt: 1.5 }}>
      <FormControl sx={{ minWidth: 120 }} fullWidth>
        <Select
          sx={{ width: "30%", height: 40 }}
          value={listEmotion}
          onChange={ListEmotionChange}
        >
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

      {/* 編集用のフォーム */}
      {selectedPost && (
        <Box
          sx={{
            marginTop: 2,
            border: "1px solid gray",
            borderRadius: 1,
            padding: 2,
            backgroundColor: "white",
          }}
        >
          <Typography variant="h6">編集フォーム</Typography>
          <br />

          <FormControl fullWidth sx={{ marginBottom: 2, width: "30%" }}>
            <InputLabel
              style={{
                backgroundColor: "white",
                paddingLeft: "5px",
                paddingRight: "5px",
              }}
            >
              Emotion
            </InputLabel>
            <Select
              value={editEmotion}
              onChange={(e) => setEditEmotion(e.target.value as string)}
            >
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

          <TextField
            fullWidth
            label="Content"
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            sx={{ marginBottom: 2 }}
          />
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Button variant="contained" onClick={handleEdit}>
              編集を保存
            </Button>
            <Button variant="contained" sx={{ backgroundColor: "gray" }}>
              閉じる
            </Button>
          </Box>
        </Box>
      )}

      {/* 日記一覧の表示 */}
      {diaryPosts
        .filter((post) =>
          listEmotion === "all" ? true : post.emotion === listEmotion
        )
        .map((post) => (
          <Box
            key={post.id}
            sx={{
              border: "1px solid gray",
              borderRadius: 1,
              padding: 2,
              marginTop: 1,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Box>
              <Typography variant="body2">感情: {post.emotion}</Typography>
              <Typography variant="h6">{post.content}</Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                ml: "2px",
              }}
            >
              <IconButton onClick={(event) => handleClick(event, post)}>
                <MoreHoriz />
              </IconButton>
              <Typography variant="body2">
                {hourAndMinutes(post.createdAt)}
              </Typography>
            </Box>
          </Box>
        ))}

      {/* 編集・削除メニューの表示 */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MuiMenuItem onClick={handleEdit}>編集</MuiMenuItem>
        <MuiMenuItem onClick={handleDelete}>削除</MuiMenuItem>
      </Menu>
    </Box>
  );
};

export default DiaryList;
