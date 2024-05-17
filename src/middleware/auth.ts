import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET || "your_jwt_secret";

export const authenticateJWT = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, secret);
    (req as any).user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};
// import jwt from "jsonwebtoken";
// import db from "../conections";

// // declare global {
// //   namespace Express {
// //     interface Request {
// //       user?: any;
// //     }
// //   }
// // }

// // export const authenticateToken = (
// //   req: Request,
// //   res: Response,
// //   next: NextFunction
// // ) => {
// //   const authHeader = req.headers["authorization"];
// //   const token = authHeader && authHeader.split(" ")[1];

// //   if (!token) return res.sendStatus(401);

// //   jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string, (err, user) => {
// //     if (err) return res.sendStatus(403);
// //     req.user = user;
// //     next();
// //   });
// // };

// export const verifyAccess = async (
//   req: any,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const source = req.header("X-App-Origin");

//     // if (source === "Dofleini-Server") {
//     //   const token = req.header("Authorization")?.split(" ")[1];
//     //   const data = { token };

//     //   return next();
//     // }

//     if (
//       !source ||
//       ![
//         "Dofleini-App",
//         "Dofleini-Admin",
//         "Dofleini-Server",
//         "Dofleini-Web",
//       ].includes(source)
//     ) {
//       return res.status(401).json({
//         message: "Origen no válido",
//       });
//     }

//     const token = req.header("Authorization")?.split(" ")[1];

//     console.log(token);

//     if (!token)
//       return res.sendStatus(401).json({
//         message: "Token incorrecto",
//       });

//     jwt.verify(
//       token,
//       process.env.ACCESS_TOKEN_SECRET as string,
//       async (err: any, user: any) => {
//         if (err) return res.sendStatus(403);

//         const { id, email, name } = user;

//         let foundUser = await db.user.findUnique({
//           where: { id },
//         });

//         if (!foundUser) {
//           const newUser = await db.user.create({
//             data: {
//               email,
//               name,
//             },
//           });

//           foundUser = await db.user.findUnique({
//             where: { id: newUser.id },
//           });
//         }

//         req.user = foundUser;
//         next();
//       }
//     );
//   } catch (error: any) {
//     return res.json({ message: error.message ?? "Internal server error" });
//   }
// };
