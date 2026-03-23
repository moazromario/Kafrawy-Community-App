import { Request, Response } from "express";
import * as userService from "./user.service";

export const getProfile = async (req: Request, res: Response) => {
  try {
    const user = await userService.getProfile((req as any).user.id);
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching profile" });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const updated = await userService.updateProfile((req as any).user.id, req.body);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Error updating profile" });
  }
};
