// routes/vaultRoutes.js

import express from "express";
import {
  createVaultItem,
  getVaultItem,
  listVaults,
} from "../controllers/vaultController.js"; // Removed getVaultLogs
import { createShareLink } from "../controllers/linkController.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import VaultItem from "../models/VaultItem.js";
import AccessLog from "../models/AccessLog.js"; // ← Keep this import!

const router = express.Router();

router.post("/", requireAuth, createVaultItem);
router.get("/:id", requireAuth, getVaultItem);
router.post("/:id/share", requireAuth, createShareLink);
router.get("/", requireAuth, listVaults);

// ONLY THIS ONE logs route — inline and working
router.get("/:id/logs", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;

    // Check ownership
    const vault = await VaultItem.findOne({ _id: id, owner: req.user._id });
    if (!vault) {
      return res
        .status(404)
        .json({ error: "Vault not found or access denied" });
    }

    // Fetch all access logs for this vault
    const logs = await AccessLog.find({ vaultItem: id })
      .sort({ accessedAt: -1 })
      .select("accessedAt success outcome ipAddress userAgent -_id")
      .lean();

    res.json(logs);
  } catch (err) {
    console.error("Error fetching logs:", err);
    res.status(500).json({ error: "Failed to fetch logs" });
  }
});

export default router;
