import crypto from "crypto";

const ENC_KEY_B64 = process.env.ENC_KEY_BASE64?.trim();

if (!ENC_KEY_B64) {
  console.error("FATAL: ENC_KEY_BASE64 is missing or empty!");
  process.exit(1); // Crash early if missing
}

export function getEncKeyBuffer() {
  const buffer = Buffer.from(ENC_KEY_B64, "base64");
  if (buffer.length !== 32) {
    throw new Error("ENC_KEY_BASE64 must be 32 bytes (44 chars base64)");
  }
  return buffer;
}

export function encryptText(plain) {
  const key = getEncKeyBuffer();
  const iv = crypto.randomBytes(12); // 96-bit recommended for GCM
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv, {
    authTagLength: 16,
  });
  const encrypted = Buffer.concat([
    cipher.update(plain, "utf8"),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();
  return {
    encryptedContent: encrypted.toString("base64"),
    iv: iv.toString("base64"),
    tag: tag.toString("base64"),
  };
}

export function decryptText(encryptedB64, ivB64, tagB64) {
  const key = getEncKeyBuffer();
  const iv = Buffer.from(ivB64, "base64");
  const tag = Buffer.from(tagB64, "base64");
  const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv, {
    authTagLength: 16,
  });
  decipher.setAuthTag(tag);
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(encryptedB64, "base64")),
    decipher.final(),
  ]);
  return decrypted.toString("utf8");
}
