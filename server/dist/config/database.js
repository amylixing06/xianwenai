"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbConfig = void 0;
exports.createPool = createPool;
exports.testDatabaseConnection = testDatabaseConnection;
const promise_1 = __importDefault(require("mysql2/promise"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.dbConfig = {
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
};
function createPool() {
    return promise_1.default.createPool(exports.dbConfig);
}
// 用于测试连接的函数
async function testDatabaseConnection() {
    const pool = createPool();
    try {
        const connection = await pool.getConnection();
        console.log('数据库连接成功！');
        connection.release();
        return true;
    }
    catch (error) {
        console.error('数据库连接失败:', error);
        return false;
    }
    finally {
        await pool.end();
    }
}
