import mongoose from "mongoose";
const { Schema } = mongoose;

const AccessLogSchema = new Schema({
  link: { type: Schema.Types.ObjectId, ref: "AccessLink", default: null },
  vaultItem: { type: Schema.Types.ObjectId, ref: "VaultItem", default: null },
  accessedAt: { type: Date, default: Date.now, immutable: true },
  success: { type: Boolean, required: true, immutable: true },
  outcome: { type: String, required: true, immutable: true }, // allowed|denied_{reason}
  ipAddress: { type: String },
  userAgent: { type: String },
});

// Ensure logs are append-only by not exposing delete endpoints in the API.

export default mongoose.model("AccessLog", AccessLogSchema);
