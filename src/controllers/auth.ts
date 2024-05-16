import { Request, Response } from "express";
import { hashPassword, verifyPassword } from "../utils/hash";
import { generateToken } from "../utils/jwt";
import db from "../conections";

// Register
export const register = async (req: Request, res: Response) => {
  const { email, pass } = req.body;

  const existingUser = await db.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = await hashPassword(pass);
  await db.user.create({
    data: {
      email,
      pass: hashedPassword,
    },
  });

  res.status(201).json({ message: "User registered successfully" });
};

// Login
export const login = async (req: Request, res: Response) => {
  const { email, pass } = req.body;

  const user = await db.user.findUnique({
    where: { email },
  });

  if (!user || !(await verifyPassword(pass, user.pass))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = generateToken(user.id);
  res.status(200).json({ token });
};
