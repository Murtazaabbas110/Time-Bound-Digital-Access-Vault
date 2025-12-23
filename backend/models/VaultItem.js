import mongoose from "mongoose";
const { Schema } = mongoose;

const VaultItemSchema = new Schema({
  title: { type: String, required: true },
  encryptedContent: { type: String, required: true }, // base64
  iv: { type: String, required: true }, // base64
  tag: { type: String, required: true }, // base64 (auth tag for GCM)
  owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("VaultItem", VaultItemSchema);
