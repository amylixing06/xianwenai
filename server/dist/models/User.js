"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const promise_1 = __importDefault(require("mysql2/promise"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jwt_1 = require("../utils/jwt");
class UserModel {
    constructor() {
        this.pool = promise_1.default.createPool({
            host: process.env.DB_HOST || '35.221.120.166',
            user: process.env.DB_USER || 'xianwenai',
            password: process.env.DB_PASSWORD || 'lgBKIIr?E|E)%d&e',
            database: process.env.DB_NAME || 'xianwenai',
            port: Number(process.env.DB_PORT) || 3306,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0,
            ssl: {
                rejectUnauthorized: false
            }
        });
    }
    async createUser(email, password) {
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const [result] = await this.pool.execute('INSERT INTO users (email, password) VALUES (?, ?)', [email, hashedPassword]);
        const insertId = result.insertId;
        const [rows] = await this.pool.execute('SELECT * FROM users WHERE id = ?', [insertId]);
        return rows[0];
    }
    async findUserByEmail(email) {
        const [rows] = await this.pool.execute('SELECT * FROM users WHERE email = ?', [email]);
        return rows[0] || null;
    }
    async validatePassword(user, password) {
        return bcryptjs_1.default.compare(password, user.password);
    }
    generateToken(user) {
        return (0, jwt_1.generateToken)({ id: user.id, email: user.email });
    }
}
exports.UserModel = UserModel;
