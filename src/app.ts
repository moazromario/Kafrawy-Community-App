import express from "express";
import cors from "cors";
import userRoutes from "./modules/user/user.routes";
import notificationRoutes from "./modules/notification/notification.routes";
import walletRoutes from "./modules/wallet/wallet.routes";
import commentsRoutes from "./modules/comments/comments.routes";

const app = express();

app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/user", userRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api/comments", commentsRoutes);

// Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

export default app;
