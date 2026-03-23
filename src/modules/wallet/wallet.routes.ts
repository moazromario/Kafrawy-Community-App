import express, { Request, Response } from "express";
import * as walletService from "./wallet.service";
import { authMiddleware } from "../../middleware/auth.middleware";

const router = express.Router();

router.get("/", authMiddleware, async (req: Request, res: Response) => {
  try {
    const balance = await walletService.getBalance((req as any).user.id);
    res.json({ balance });
  } catch (error) {
    res.status(500).json({ message: "Error fetching wallet balance" });
  }
});

export default router;
