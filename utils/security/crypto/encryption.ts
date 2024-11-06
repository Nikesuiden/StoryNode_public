// utils/crypto.ts

import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
  CipherGCMTypes,
} from "crypto";

const algorithm: CipherGCMTypes = "aes-256-gcm";


if (!process.env.ENCRYPTION_KEY) {
  throw new Error("ENCRYPTION_KEY is not set in the environment variables");
}

// キー生成 (AES-256のため32バイト)
const keyBuffer = Buffer.from(process.env.ENCRYPTION_KEY, "hex");

const key = new Uint8Array(keyBuffer); // BufferからUint8Arrayに変換

/**
 * AES-256-GCMを使用して平文文字列を暗号化します。
 * @param plaintext - 暗号化する平文文字列。
 * @returns 暗号化された文字列。
 */
export function encrypt(plaintext: string): string {
  const ivBuffer = randomBytes(12); // GCMのため12バイトのIV
  const iv = new Uint8Array(ivBuffer); // BufferからUint8Arrayに変換

  const cipher = createCipheriv(algorithm, key, iv);

  let encrypted = cipher.update(plaintext, "utf8", "hex");
  encrypted += cipher.final("hex");

  const authTag = cipher.getAuthTag();

  const result = [
    ivBuffer.toString("hex"),
    authTag.toString("hex"),
    encrypted,
  ].join(":");

  return result;
}
/**
 * AES-256-GCMを使用して暗号化された文字列を復号化します。
 * @param ciphertext - 復号化する暗号化された文字列。
 * @returns 復号化された平文文字列。
 */
export function decrypt(ciphertext: string): string {
  const [ivHex, authTagHex, encrypted] = ciphertext.split(":");

  const ivBuffer = Buffer.from(ivHex, "hex");
  const iv = new Uint8Array(ivBuffer); // BufferからUint8Arrayに変換

  const authTagBuffer = Buffer.from(authTagHex, "hex");
  const authTag = new Uint8Array(authTagBuffer); // BufferからUint8Arrayに変換

  const decipher = createDecipheriv(algorithm, key, iv);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}



