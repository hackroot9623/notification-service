import { Request, Response } from "express";
import { hashPassword, verifyPassword } from "../utils/hash";
import { generateToken } from "../utils/jwt";
import db from "../connections";
import logger from "../utils/logger";
import { userSchema } from "../validators/userValidator";

export const register = async (req: Request, res: Response) => {
  try {
    const { email, pass } = req.body;

    // const validationResult = userSchema.safeParse({ email, pass });

    // if (!validationResult.success) {
    //   return res.status(400).json({ message: "Datos de usuario no válidos" });
    // }

    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ message: "El usuario ya está registrado" });
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
      .json({ message: `Usuario ${user?.email} registrado exitosamente` });
    logger.info(`Usuario ${user?.email} registrado exitosamente`, {
      user: user?.email,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Se produjo un error durante el registro" });
    logger.error(`Error al registrar el usuario`);
  }
};

// Login
export const login = async (req: Request, res: Response) => {
  try {
    const { email, pass } = req.body;

    // const validationResult = userSchema.safeParse({ email, pass });

    // if (!validationResult.success) {
    //   return res.status(400).json({ message: "Datos de usuario no válidos" });
    // }

    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user || !(await verifyPassword(pass, user.pass))) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    const token = generateToken(user.id);
    res.status(200).json({ token });
    logger.info(`El usuario ${user?.email} se ha logueado correctamente`, {
      user: user?.email,
    });
  } catch (error) {
    res.status(500).json({ message: "Ha ocurrido un error durante el login" });
    logger.error("Ha ocurrido un error durante el login");
  }
};
