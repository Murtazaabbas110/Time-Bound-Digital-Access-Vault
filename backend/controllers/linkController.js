import AccessLink from "../models/AccessLink.js";
import AccessLog from "../models/AccessLog.js";
import VaultItem from "../models/VaultItem.js";
import { generateToken, hashToken } from "../utils/tokenUtils.js";
import { decryptText } from "../utils/cryptoUtils.js";
import bcrypt from "bcrypt";

export async function createShareLink(req, res, next) {
  try {
    const { id } = req.params; // vault item id
    const { expiresAt, maxViews = 1, password = null } = req.body;

    // Validate server-side
    if (!expiresAt)
      return res
        .status(400)
        .json({ error: "expiresAt (ISO datetime) is required" });
    const expiry = new Date(expiresAt);
    if (isNaN(expiry.getTime()))
      return res
        .status(400)
        .json({ error: "expiresAt must be a valid datetime" });
    if (expiry <= new Date())
      return res.status(400).json({ error: "expiresAt must be in the future" });

    const vaultItem = await VaultItem.findById(id);
    if (!vaultItem)
      return res.status(404).json({ error: "Vault item not found" });

    // owner check
    if (String(vaultItem.owner) !== String(req.user._id))
      return res.status(403).json({ error: "Forbidden" });

    const token = generateToken();
    const tokenHash = hashToken(token);

    let passwordHash = null;
    if (password) passwordHash = await bcrypt.hash(password, 12);

    const link = await AccessLink.create({
      vaultItem: vaultItem._id,
      tokenHash,
      expiresAt: expiry,
      maxViews: Number(maxViews),
      passwordHash,
    });

    // Shareable URL — frontend will route /access/:token to call backend
    const url = `${process.env.BASE_URL || ""}/api/access/${token}`;

    return res.status(201).json({ linkId: link._id, url, rawToken: token });
  } catch (err) {
    next(err);
  }
}

export async function revokeLink(req, res, next) {
  try {
    const { id } = req.params; // link id
    const link = await AccessLink.findById(id).populate("vaultItem");
    if (!link) return res.status(404).json({ error: "Link not found" });
    // only owner may revoke
    if (String(link.vaultItem.owner) !== String(req.user._id))
      return res.status(403).json({ error: "Forbidden" });
    link.revoked = true;
    await link.save();
    return res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}

export async function getLinkStatus(req, res, next) {
  try {
    const { id } = req.params;
    const link = await AccessLink.findById(id).lean().populate("vaultItem");
    if (!link) return res.status(404).json({ error: "Link not found" });
    // only owner may view
    if (String(link.vaultItem.owner) !== String(req.user._id))
      return res.status(403).json({ error: "Forbidden" });
    const now = new Date();
    const expired = link.expiresAt <= now;
    const exhausted = link.currentViews >= link.maxViews;
    return res.json({
      id: link._id,
      expired,
      exhausted,
      revoked: link.revoked,
      currentViews: link.currentViews,
      maxViews: link.maxViews,
      expiresAt: link.expiresAt,
    });
  } catch (err) {
    next(err);
  }
}

// The access route — public: user presents token (via URL param) and backend enforces rules.
// If link is password protected, the client must POST the password to /api/access/:token with { password }
export async function accessByToken(req, res, next) {
  try {
    const token = req.params.token;
    if (!token) return res.status(400).json({ error: "token param required" });

    const tokenHash = hashToken(token);

    // Try to locate the link by tokenHash
    const link = await AccessLink.findOne({ tokenHash }).populate("vaultItem");
    if (!link) {
      // Log attempt — token invalid
      await AccessLog.create({
        link: null,
        vaultItem: null,
        success: false,
        outcome: "denied_invalid_token",
        ipAddress: req.ip,
        userAgent: req.get("User-Agent"),
      });
      return res.status(404).json({ error: "Invalid token" });
    }

    const now = new Date();

    // checks: revoked, expiry, views
    if (link.revoked) {
      await AccessLog.create({
        link: link._id,
        vaultItem: link.vaultItem._id,
        success: false,
        outcome: "denied_revoked",
        ipAddress: req.ip,
        userAgent: req.get("User-Agent"),
      });
      return res.status(403).json({ error: "This link has been revoked" });
    }
    if (link.expiresAt <= now) {
      await AccessLog.create({
        link: link._id,
        vaultItem: link.vaultItem._id,
        success: false,
        outcome: "denied_expired",
        ipAddress: req.ip,
        userAgent: req.get("User-Agent"),
      });
      return res.status(410).json({ error: "This link has expired" });
    }
    if (link.currentViews >= link.maxViews) {
      await AccessLog.create({
        link: link._id,
        vaultItem: link.vaultItem._id,
        success: false,
        outcome: "denied_views_exhausted",
        ipAddress: req.ip,
        userAgent: req.get("User-Agent"),
      });
      return res
        .status(429)
        .json({ error: "This link has reached its maximum number of views" });
    }

    // If password-protected, validate password from query (GET) OR body (POST)
    if (link.passwordHash) {
      // Support both GET (?password=xxx) and POST { password: "xxx" }
      const password = req.query.password || req.body.password;

      if (!password || password.trim() === "") {
        await AccessLog.create({
          link: link._id,
          vaultItem: link.vaultItem._id,
          success: false,
          outcome: "denied_password_required",
          ipAddress: req.ip,
          userAgent: req.get("User-Agent"),
        });
        return res
          .status(401)
          .json({ error: "Password required for this link" });
      }

      const ok = await bcrypt.compare(password, link.passwordHash);
      if (!ok) {
        await AccessLog.create({
          link: link._id,
          vaultItem: link.vaultItem._id,
          success: false,
          outcome: "denied_wrong_password",
          ipAddress: req.ip,
          userAgent: req.get("User-Agent"),
        });
        return res.status(401).json({ error: "Invalid password" });
      }
    }

    // Atomically increment view count only if constraints still hold (prevents race conditions)
    const updated = await AccessLink.findOneAndUpdate(
      {
        _id: link._id,
        currentViews: { $lt: link.maxViews },
        revoked: false,
        expiresAt: { $gt: now },
      },
      { $inc: { currentViews: 1 } },
      { new: true }
    );

    if (!updated) {
      // Could not increment — likely raced out or constraints changed
      await AccessLog.create({
        link: link._id,
        vaultItem: link.vaultItem._id,
        success: false,
        outcome: "denied_race_or_limit",
        ipAddress: req.ip,
        userAgent: req.get("User-Agent"),
      });
      return res.status(429).json({ error: "This link cannot be accessed" });
    }

    // Decrypt and return content
    const vaultItem = await VaultItem.findById(link.vaultItem._id);
    if (!vaultItem) {
      await AccessLog.create({
        link: link._id,
        vaultItem: null,
        success: false,
        outcome: "denied_vault_missing",
        ipAddress: req.ip,
        userAgent: req.get("User-Agent"),
      });
      return res.status(500).json({ error: "Vault item missing" });
    }

    let plain;
    try {
      plain = decryptText(
        vaultItem.encryptedContent,
        vaultItem.iv,
        vaultItem.tag
      );
    } catch (err) {
      // decryption failed — log and return 500
      await AccessLog.create({
        link: link._id,
        vaultItem: link.vaultItem._id,
        success: false,
        outcome: "error_decrypt_failed",
        ipAddress: req.ip,
        userAgent: req.get("User-Agent"),
      });
      return res.status(500).json({ error: "Failed to decrypt content" });
    }

    await AccessLog.create({
      link: link._id,
      vaultItem: link.vaultItem._id,
      success: true,
      outcome: "allowed",
      ipAddress: req.ip,
      userAgent: req.get("User-Agent"),
    });

    return res.json({
      content: plain,
      meta: {
        remainingViews: Math.max(0, updated.maxViews - updated.currentViews),
        expiresAt: updated.expiresAt,
      },
    });
  } catch (err) {
    next(err);
  }
}
