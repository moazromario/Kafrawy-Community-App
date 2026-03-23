// src/modules/user/user.validation.ts
import { Request, Response, NextFunction } from 'express';

export const validateUserUpdate = (req: Request, res: Response, next: NextFunction) => {
  const { name, email, phone } = req.body;

  if (!name || !email || !phone) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  // Add more validation logic here (e.g., email format, phone length)
  next();
};
