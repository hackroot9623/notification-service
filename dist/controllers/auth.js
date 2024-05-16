"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const hash_1 = require("../utils/hash");
const jwt_1 = require("../utils/jwt");
const conections_1 = __importDefault(require("../conections"));
// Register
const register = async (req, res) => {
    const { email, pass } = req.body;
    const existingUser = await conections_1.default.user.findUnique({
        where: { email },
    });
    if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await (0, hash_1.hashPassword)(pass);
    await conections_1.default.user.create({
        data: {
            email,
            pass: hashedPassword,
        },
    });
    res.status(201).json({ message: "User registered successfully" });
};
exports.register = register;
// Login
const login = async (req, res) => {
    const { email, pass } = req.body;
    const user = await conections_1.default.user.findUnique({
        where: { email },
    });
    if (!user || !(await (0, hash_1.verifyPassword)(pass, user.pass))) {
        return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = (0, jwt_1.generateToken)(user.id);
    res.status(200).json({ token });
};
exports.login = login;
