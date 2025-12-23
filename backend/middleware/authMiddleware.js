import { verifyAuthToken } from "../utils/authUtils.js";
import User from "../models/User.js";

export async function requireAuth(req, res, next) {
  try {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith("Bearer "))
      return res.status(401).json({ error: "Missing Authorization header" });
    const token = auth.split(" ")[1];
    let payload;
    try {
      payload = verifyAuthToken(token);
    } catch (err) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }
    const user = await User.findById(payload.id).lean();
    if (!user) return res.status(401).json({ error: "User not found" });
    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
}
