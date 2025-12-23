import mongoose from "mongoose";
const { Schema } = mongoose;

const AccessLinkSchema = new Schema({
  vaultItem: { type: Schema.Types.ObjectId, ref: "VaultItem", required: true },
  tokenHash: { type: String, required: true, unique: true },
  expiresAt: { type: Date, required: true },
  maxViews: { type: Number, default: 1 },
  currentViews: { type: Number, default: 0 },
  revoked: { type: Boolean, default: false },
  passwordHash: { type: String, default: null }, // bcrypt hash if password protected
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("AccessLink", AccessLinkSchema);
