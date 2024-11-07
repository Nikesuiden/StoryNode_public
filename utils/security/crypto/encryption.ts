// utils/crypto.ts

import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
  CipherGCMTypes,
} from "crypto";

const algorithm: CipherGCMTypes = "aes-256-gcm";

//   if (!process.env.ENCRYPTION_KEY) {
//     throw new Error("ENCRYPTION_KEY is not set in the environment variables");
//   }

// キー生成 (AES-256のため32バイト)
const keyBuffer = Buffer.from(process.env.ENCRYPTION_KEY as string, "base64");
const key = new Uint8Array(keyBuffer); // BufferからUint8Arrayに変換

/**
 * AES-256-GCMを使用して平文文字列を暗号化します。
 * @param plaintext - 暗号化する平文文字列。
 * @returns 暗号化されたBase64エンコード文字列。
 */
export function encrypt(plaintext: string): string {
    // 12バイトのランダムな初期化ベクトル（IV）を生成（GCMモードで必須）
    const ivBuffer = randomBytes(12);
    
    // IVをUint8Array型に変換（暗号化処理に必要）
    const iv = new Uint8Array(ivBuffer);
  
    // AES-256-GCMアルゴリズムを使用して暗号化を初期化
    const cipher = createCipheriv(algorithm, key, iv);
  
    // 平文を暗号化し、途中の暗号文をbase64形式で文字列として取得
    let encrypted = cipher.update(plaintext, "utf8", "base64");
  
    // 暗号化処理を完了し、残りのデータもbase64形式で追加
    encrypted += cipher.final("base64");
  
    // 認証タグ（GCMモードでデータ改ざん防止に必要）を取得
    const authTag = cipher.getAuthTag();
  
    // IV、認証タグ、暗号文をbase64エンコードして文字列として結合
    const result = [
      ivBuffer.toString("base64"),
      authTag.toString("base64"),
      encrypted,
    ].join(":");
  
    // 暗号化された結果を返す（IV、認証タグ、暗号文が結合された文字列）
    return result;
  }
  

/**
 * AES-256-GCMを使用して暗号化されたBase64エンコード文字列を復号化します。
 * @param ciphertext - 復号化する暗号化されたBase64エンコード文字列。
 * @returns 復号化された平文文字列。
 */
export function decrypt(ciphertext: string): string {
    // 暗号文を':'で分割し、IV、認証タグ、暗号化データを取得
    const [ivBase64, authTagBase64, encrypted] = ciphertext.split(":");
  
    // IVをBase64からバイナリ形式にデコード
    const ivBuffer = Buffer.from(ivBase64, "base64");
    const iv = new Uint8Array(ivBuffer)
  
    // 認証タグをBase64からバイナリ形式にデコード
    const authTagBuffer = Buffer.from(authTagBase64, "base64");

    // BufferからUint8Arrayに変換
    const authTag = new Uint8Array(authTagBuffer); 
  
    // AES-256-GCMアルゴリズムを使用して復号器を作成
    const decipher = createDecipheriv(algorithm, key, iv);
  
    // 復号器に認証タグを設定
    decipher.setAuthTag(authTag);
  
    // 暗号化データを復号し、UTF-8形式の平文を取得
    let decrypted = decipher.update(encrypted, "base64", "utf8");
  
    // 復号処理を完了し、残りのデータを取得
    decrypted += decipher.final("utf8");
  
    // 復号された平文を返す
    return decrypted;
  }
  