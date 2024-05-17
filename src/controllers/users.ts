import { Request, Response } from "express";
import db from "../connections";

export const listUsers = async (req: Request, res: Response): Promise<void> => {
  const users = await db.user.findMany();
  res.json(users);
};
