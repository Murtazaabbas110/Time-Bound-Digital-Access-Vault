import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import rateLimit from "express-rate-limit";

import authRoutes from "./routes/authRoutes.js";
import vaultRoutes from "./routes/vaultRoutes.js";
import linkRoutes from "./routes/linkRoutes.js";
import errorHandler from "./middleware/errorHandler.js";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "20kb" }));
app.use(morgan("dev"));

// global rate limit (light)
const globalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 200,
});
app.use(globalLimiter);

app.get("/", (req, res) => res.send("Time-Bound Vault API"));

app.use("/api/auth", authRoutes);
app.use("/api/vault", vaultRoutes);
app.use("/api", linkRoutes); // /api/access/:token and link actions

// error handler
app.use(errorHandler);

export default app;
