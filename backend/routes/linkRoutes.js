import express from "express";
import {
  accessByToken,
  revokeLink,
  getLinkStatus,
} from "../controllers/linkController.js";
import { accessRateLimiter } from "../middleware/rateLimiter.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public access endpoint — rate limited to prevent brute forcing tokens
// Note: password must be provided in request body for protected links
router.post("/access/:token", accessRateLimiter, accessByToken);
// Change from POST to GET or allow both
router.get("/access/:token", accessRateLimiter, accessByToken);
// or keep POST and add GET alias

// Adminish endpoints for revoking and checking — protected
router.post("/link/:id/revoke", requireAuth, revokeLink);
router.get("/link/:id/status", requireAuth, getLinkStatus);

export default router;
