import { Request, Response } from "express";
import db from "../conections";
import { userSchema } from "../validators/userValidator";

// export const createUser = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   try {
//     const userData = userSchema.parse(req.body);

//     // console.log(userData)

//     const user = await db.user.create({
//       data: userData,
//     });

//     // console.log(user)

//     res.status(201).json(user);
//   } catch (error: any) {
//     console.error("Validation Error:", error);
//     res.status(400).json({ error: error.message });
//   }
// };

export const listUsers = async (req: Request, res: Response): Promise<void> => {
  const users = await db.user.findMany();
  res.json(users);
};
