import { Description } from "@mui/icons-material";
import { Box, Button } from "@mui/material";
import { constants } from "buffer";
import { constrainedMemory } from "process";
import { use, useState } from "react";

export default function PromptTemplate() {
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
  const [isCreateFormOpen, setIsCreateFormOpen] = useState<boolean>(false);
  const [template, setTemplate] = useState<string>("");

  // Popupをオープンにする
  const handlePopupOpen = () => {
    setIsPopupOpen(true);
  };

  // Popupをクローズする
  const handlePopupClose = () => {
    setIsPopupOpen(false);
  };

  // template読み込み
  const fetchPromptTemplate = async () => {};
  
  // 新規template保存
  const handlePromptTemplateSubmit = async () => {};

  // 既存templateを呼び出す
  const callPromptTemplate = () => {};

  // template作成Formを開く
  const handleCreateFormOpen = () => {
    // Popupを閉じ、Formを開く
    setIsPopupOpen(false);
    setIsCreateFormOpen(true);
  };

  // template作成Formを閉じる
  const handleCreateFormClose = () => {
    // Popup, Form両方閉じる
    setIsCreateFormOpen(false);
    setIsPopupOpen(false);
  };

  // template作成FormからPopupに戻る
  const backToPopup = () => {
    // Formを閉じ、Popupを開く
    setIsCreateFormOpen(false);
    setIsPopupOpen(true);
  };

  return (
    <Box>
      <Box>
        <Description onClick={() => handlePopupOpen} />
      </Box>
      {isPopupOpen ? (
        <Box>
          <Button onClick={handleCreateFormOpen}>新規テンプレートを作成</Button>
        </Box>
      ) : (
        <Box sx={{ display: "none" }} />
      )}
    </Box>
  );
}
