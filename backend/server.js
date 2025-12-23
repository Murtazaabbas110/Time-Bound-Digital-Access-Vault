import "dotenv/config";

console.log(
  "ENC_KEY_BASE64 loaded:",
  process.env.ENC_KEY_BASE64
    ? "YES (length: " + process.env.ENC_KEY_BASE64.length + ")"
    : "NO — MISSING!"
);

import app from "./app.js";
import connectDB from "./config/db.js";

const PORT = process.env.PORT || 4000;

async function start() {
  await connectDB(process.env.MONGO_URI);
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

start().catch((err) => {
  console.error("Startup error", err);
  process.exit(1);
});
