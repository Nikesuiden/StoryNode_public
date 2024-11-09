"use client";

import { decrypt, encrypt } from "@/utils/security/crypto/encryption";
import { Box, Button, TextField, Typography } from "@mui/material";
import { useState } from "react";

export default function Test() {
  const [cryptoKey, setCryptoKey] = useState<string>("");
  const [cryptoIv, setCryptoIv] = useState<string>("");
  const [text, setText] = useState<string>("");
  const [encryptedText, setEncryptedText] = useState<string>("");
  const [decryptedText, setDecryptedText] = useState<string>("");

  const crypto = require("crypto");

  const createKey = () => {
    // 32バイトのランダムキーを生成
    const key = crypto.randomBytes(32).toString("base64");
    setCryptoKey(key);

    // 16バイトのランダムIVを生成
    const iv = crypto.randomBytes(16).toString("base64");
    setCryptoIv(iv);
  };

  const handleEncrypt = async () => {
    const encrypted = await encrypt(text);
    setEncryptedText(encrypted);
  };

  const handleDecrypt = async() => {
    const decrypted = await decrypt(encryptedText);
    setDecryptedText(decrypted);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Button variant="contained" color="primary" onClick={createKey}>
        キー生成
      </Button>
      <Typography variant="h6" mt={2}>
        KEY: {cryptoKey}
      </Typography>
      <Typography variant="h6" mt={1}>
        IV: {cryptoIv}
      </Typography>

      <TextField
        label="テキストを入力"
        variant="outlined"
        fullWidth
        margin="normal"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <Button
        variant="contained"
        color="secondary"
        onClick={handleEncrypt}
        disabled={!text}
        sx={{ mt: 2 }}
      >
        暗号化
      </Button>
      {encryptedText && (
        <>
          <Typography variant="body1" mt={2}>
            暗号化されたテキスト: {encryptedText}
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleDecrypt}
            sx={{ mt: 2 }}
          >
            復号化
          </Button>
          {decryptedText && (
            <Typography variant="body1" mt={2}>
              復号化されたテキスト: {decryptedText}
            </Typography>
          )}
        </>
      )}
    </Box>
  );
}
