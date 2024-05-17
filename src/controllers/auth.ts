import { Request, Response } from "express";
import { hashPassword, verifyPassword } from "../utils/hash";
import { generateToken } from "../utils/jwt";
import db from "../conections";
import logger from "../utils/logger";

// Register
export const register = async (req: Request, res: Response) => {
  try {
    const { email, pass } = req.body;

    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await hashPassword(pass);
    const newUser = await db.user.create({
      data: {
        email,
        pass: hashedPassword,
      },
    });

    const user = await db.user.findUnique({
      where: { email: newUser.email },
    });

    res
      .status(201)
      .json({ message: `User ${user?.email} registered successfully` });
    logger.info(`User ${user?.email} registered successfully`, {
      user: user?.email,
    });
  } catch (error) {
    res.status(500).json({ message: "An error occurred during registration" });
    logger.error(`Error while registering user`);
  }
};

// Login
export const login = async (req: Request, res: Response) => {
  try {
    const { email, pass } = req.body;

    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user || !(await verifyPassword(pass, user.pass))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user.id);
    res.status(200).json({ token });
    logger.info(`User ${user?.email} logged successfully`, {
      user: user?.email,
    });
  } catch (error) {
    res.status(500).json({ message: "An error occurred during login" });
  }
};
