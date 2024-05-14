"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listUsers = exports.createUser = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const prisma = new client_1.PrismaClient();
const userSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
});
const createUser = async (req, res) => {
    try {
        const userData = userSchema.parse(req.body);
        const user = await prisma.user.create({
            data: userData,
        });
        res.status(201).json(user);
    }
    catch (error) {
        res.status(400).json({ error: error.errors });
    }
};
exports.createUser = createUser;
const listUsers = async (req, res) => {
    const users = await prisma.user.findMany();
    res.json(users);
};
exports.listUsers = listUsers;
