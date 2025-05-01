"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAuthRouter = createAuthRouter;
const express_1 = require("express");
const User_1 = require("../models/User");
// 错误处理中间件
const asyncHandler = (fn) => (req, res, next) => {
    return Promise.resolve(fn(req, res, next)).catch(next);
};
function createAuthRouter() {
    const router = (0, express_1.Router)();
    const userModel = new User_1.UserModel();
    const handleRegister = async (req, res) => {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ error: 'Email and password are required' });
            return;
        }
        const existingUser = await userModel.findUserByEmail(email);
        if (existingUser) {
            res.status(400).json({ error: 'Email already registered' });
            return;
        }
        const user = await userModel.createUser(email, password);
        const token = userModel.generateToken(user);
        res.status(201).json({
            user: {
                id: user.id,
                email: user.email
            },
            token
        });
    };
    const handleLogin = async (req, res) => {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ error: 'Email and password are required' });
            return;
        }
        const user = await userModel.findUserByEmail(email);
        if (!user) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }
        const isValidPassword = await userModel.validatePassword(user, password);
        if (!isValidPassword) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }
        const token = userModel.generateToken(user);
        res.json({
            user: {
                id: user.id,
                email: user.email
            },
            token
        });
    };
    router.post('/register', asyncHandler(handleRegister));
    router.post('/login', asyncHandler(handleLogin));
    return router;
}
