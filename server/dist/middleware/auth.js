"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = authenticateToken;
const jwt_1 = require("../utils/jwt");
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: '未提供认证令牌' });
    }
    try {
        const user = (0, jwt_1.verifyToken)(token);
        req.user = user;
        next();
    }
    catch (error) {
        return res.status(403).json({ error: '无效的认证令牌' });
    }
}
