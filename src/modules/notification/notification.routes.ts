import express, { Request, Response } from "express";
import * as notificationService from "./notification.service";
import { authMiddleware } from "../../middleware/auth.middleware";

const router = express.Router();

router.get("/", authMiddleware, async (req: Request, res: Response) => {
  try {
    const data = await notificationService.getNotifications((req as any).user.id);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching notifications" });
  }
});

router.post("/:id/read", authMiddleware, async (req: Request, res: Response) => {
  try {
    await notificationService.markAsRead(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: "Error marking notification as read" });
  }
});

export default router;
