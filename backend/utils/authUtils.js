import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET || "dev-jwt-secret";

export function signAuthToken(user) {
  const payload = { id: user._id, email: user.email };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "24h" });
}

export function verifyAuthToken(token) {
  return jwt.verify(token, JWT_SECRET);
}
