import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET || "your_jwt_secret";

export const generateToken = (userId: string): string => {
  return jwt.sign({ id: userId }, secret, { expiresIn: "1h" });
};
