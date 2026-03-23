import express from "express";
import * as controller from "./user.controller";
import { authMiddleware } from "../../middleware/auth.middleware";

const router = express.Router();

router.get("/profile", authMiddleware, controller.getProfile);
router.put("/profile", authMiddleware, controller.updateProfile);

export default router;
