"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listUsers = void 0;
const conections_1 = __importDefault(require("../conections"));
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
const listUsers = async (req, res) => {
    const users = await conections_1.default.user.findMany();
    res.json(users);
};
exports.listUsers = listUsers;
