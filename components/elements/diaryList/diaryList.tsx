"use client";

import { createClient } from "@/utils/supabase/client";
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
  IconButton,
  CircularProgress,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useState, useEffect, MouseEvent } from "react";

interface DiaryPost {
  id: number;
  content: string;
  emotion: string;
  createdAt: string;
}

interface DiaryPostProps {
  initialData: {
    data: DiaryPost[] | null;
    isLoading: boolean;
  };
}

const DiaryList: React.FC<DiaryPostProps> = ({ initialData }) => {
  const [listEmotion, setListEmotion] = useState<string>("all");
  const [diaryPosts, setDiaryPosts] = useState<DiaryPost[]>(
    initialData.data || []
  );
  const [editingPostId, setEditingPostId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState<string>("");
  const [editEmotion, setEditEmotion] = useState<string>("none");

  // メニューの表示制御のための状態
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);

  const { data, isLoading } = initialData;

  // ページ移動
  const router = useRouter();
  const handleNavigation = (path: string) => {
    router.push(path);
  };

  // 時間と分を抽出する関数
  const hourAndMinutes = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const ListEmotionChange = (event: SelectChangeEvent) => {
    setListEmotion(event.target.value as string);
  };

  // メニューを開く
  const handleMenuClick = (event: MouseEvent<HTMLElement>, postId: number) => {
    setAnchorEl(event.currentTarget);
    setSelectedPostId(postId);
  };

  // メニューを閉じる
  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedPostId(null);
  };

  // 編集モードを開始
  const handleEditOpen = () => {
    if (selectedPostId !== null) {
      const post = diaryPosts.find((p) => p.id === selectedPostId);
      if (post) {
        setEditingPostId(post.id);
        setEditContent(post.content);
        setEditEmotion(post.emotion);
      }
      handleMenuClose(); // メニューを閉じる
    }
  };

  const handleEdit = async () => {
    const supabase = await createClient();
    if (editingPostId !== null) {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session?.access_token) {
          return;
        }

        const response = await fetch(`/api/diaryPost/${editingPostId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ content: editContent, emotion: editEmotion }),
        });

        if (response.ok) {
          await fetchDiaryPosts(); // 日記一覧を再取得
          setEditingPostId(null);
        } else {
          const errorMessage = await response.text();
          console.error(
            "Failed to update diary post:",
            response.status,
            errorMessage
          );
        }
      } catch (error) {
        console.error("Error updating diary post:", error);
      }
    }
  };

  // 編集をキャンセル
  const handleCloseEdit = () => {
    setEditingPostId(null);
  };

  // 投稿を削除
  const handleDelete = async () => {
    const supabase = await createClient();
    if (selectedPostId !== null) {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session?.access_token) {
          return;
        }

        const response = await fetch(`/api/diaryPost/${selectedPostId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
        });

        if (response.ok) {
          fetchDiaryPosts(); // 日記一覧を再取得
        } else {
          console.error("Failed to delete diary post");
        }
      } catch (error) {
        console.error("Error deleting diary post:", error);
      }
      handleMenuClose(); // メニューを閉じる
    }
  };

  // APIから日記の一覧を取得する関数
  const fetchDiaryPosts = async () => {
    const supabase = await createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.access_token) {
      return;
    }

    const response = await fetch("/api/diaryPost", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`, // JWTトークンをヘッダーに追加
      },
    });

    if (response.ok) {
      const diaryPostsData = await response.json();
      setDiaryPosts(diaryPostsData);
    } else {
      handleNavigation("/signin");
    }
  };

  // コンポーネントのマウント時にデータを取得
  useEffect(() => {
    fetchDiaryPosts();
  }, []);

  // 親コンポーネントからの fetchDiary の結果を取得
  useEffect(() => {
    setDiaryPosts(initialData.data || []);
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
          <MenuItem value={"painful"}>辛い</MenuItem>
        </Select>
      </FormControl>

      {/* 日記一覧の表示 */}
      {!isLoading ? (
        diaryPosts
          .filter((post) =>
            listEmotion === "all" ? true : post.emotion === listEmotion
          )
          .map((post) =>
            editingPostId === post.id ? (
              // 編集フォームの表示
              <Box
                key={post.id}
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
                    <MenuItem value={"painful"}>辛い</MenuItem>
                  </Select>
                </FormControl>

                <TextField
                  fullWidth
                  label="Content"
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  sx={{ marginBottom: 2 }}
                  multiline
                />
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  <Button variant="contained" onClick={handleEdit}>
                    編集を保存
                  </Button>
                  <Button
                    variant="contained"
                    sx={{ backgroundColor: "gray" }}
                    onClick={handleCloseEdit}
                  >
                    閉じる
                  </Button>
                </Box>
              </Box>
            ) : (
              // 通常の投稿表示
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
                    position: "relative",
                  }}
                >
                  <IconButton
                    sx={{ zIndex: 1 }}
                    onClick={(event) => handleMenuClick(event, post.id)}
                  >
                    <MoreHoriz />
                  </IconButton>
                  <Typography variant="body2">
                    {hourAndMinutes(post.createdAt)}
                  </Typography>
                </Box>
              </Box>
            )
          )
      ) : (
        <Box
          sx={{
            m: 2,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mt: 4,
          }}
        >
          <CircularProgress size={50}/>
        </Box>
      )}

      {/* 編集・削除メニューの表示 */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEditOpen}>編集</MenuItem>
        <MenuItem sx={{ color: "red", mt: 1 }} onClick={handleDelete}>
          削除
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default DiaryList;
