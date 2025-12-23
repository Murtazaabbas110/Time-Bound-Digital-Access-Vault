import crypto from "crypto";

const HMAC_SECRET = process.env.TOKEN_HMAC_SECRET || "dev-secret";

export function generateToken() {
  return crypto.randomBytes(32).toString("hex"); // 64 hex chars
}

export function hashToken(token) {
  return crypto.createHmac("sha256", HMAC_SECRET).update(token).digest("hex");
}
