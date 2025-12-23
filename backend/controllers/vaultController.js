import VaultItem from "../models/VaultItem.js";
import { encryptText } from "../utils/cryptoUtils.js";

export async function createVaultItem(req, res, next) {
  try {
    const { title, content } = req.body;
    if (!title || !content)
      return res.status(400).json({ error: "title and content are required" });
    const { encryptedContent, iv, tag } = encryptText(content);
    const item = await VaultItem.create({
      title,
      encryptedContent,
      iv,
      tag,
      owner: req.user._id,
    });
    return res
      .status(201)
      .json({ id: item._id, title: item.title, createdAt: item.createdAt });
  } catch (err) {
    next(err);
  }
}

export async function getVaultItem(req, res, next) {
  try {
    const { id } = req.params;
    const item = await VaultItem.findById(id)
      .select("title owner createdAt")
      .populate("owner", "email")
      .lean();
    if (!item) return res.status(404).json({ error: "Vault item not found" });
    // Only owner can view metadata; content is only served via access links
    if (String(item.owner._id) !== String(req.user._id))
      return res.status(403).json({ error: "Forbidden" });
    return res.json({
      id: item._id,
      title: item.title,
      owner: item.owner,
      createdAt: item.createdAt,
    });
  } catch (err) {
    next(err);
  }
}

// List all vaults for the logged-in user
export async function listVaults(req, res, next) {
  try {
    const vaults = await VaultItem.find({ owner: req.user._id })
      .select('title createdAt')
      .sort({ createdAt: -1 })
      .lean();
    res.json(vaults);
  } catch (err) {
    next(err);
  }
}

// Get logs for a vault (owner only)
export async function getVaultLogs(req, res, next) {
  try {
    const { id } = req.params;
    const vault = await VaultItem.findOne({ _id: id, owner: req.user._id });
    if (!vault) return res.status(404).json({ error: 'Not found or forbidden' });

    const logs = await AccessLog.find({ vaultItem: id })
      .sort({ accessedAt: -1 })
      .select('accessedAt success outcome ipAddress')
      .lean();
    res.json(logs);
  } catch (err) {
    next(err);
  }
}
