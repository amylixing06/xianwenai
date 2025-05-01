"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productionConfig = void 0;
exports.createProductionPool = createProductionPool;
exports.testProductionConnection = testProductionConnection;
const promise_1 = __importDefault(require("mysql2/promise"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// 生产环境数据库配置
exports.productionConfig = {
    host: process.env.DB_HOST || '35.221.120.166',
    user: process.env.DB_USER || 'xianwenai',
    password: process.env.DB_PASSWORD || 'lgBKIIr?E|E)%d&e',
    database: process.env.DB_NAME || 'xianwenai',
    port: Number(process.env.DB_PORT) || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    // 生产环境 SSL 配置
    ssl: {
        rejectUnauthorized: false,
        ca: process.env.DB_CA_CERT, // 如果需要 CA 证书
        key: process.env.DB_CLIENT_KEY, // 如果需要客户端密钥
        cert: process.env.DB_CLIENT_CERT // 如果需要客户端证书
    }
};
// 创建生产环境连接池
function createProductionPool() {
    return promise_1.default.createPool(exports.productionConfig);
}
// 测试生产环境连接
async function testProductionConnection() {
    const pool = createProductionPool();
    try {
        const connection = await pool.getConnection();
        console.log('生产环境数据库连接成功！');
        connection.release();
        return true;
    }
    catch (error) {
        console.error('生产环境数据库连接失败:', error);
        return false;
    }
    finally {
        await pool.end();
    }
}
