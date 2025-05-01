"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promise_1 = __importDefault(require("mysql2/promise"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
async function testConnection() {
    console.log('正在尝试连接到数据库服务器...');
    console.log('连接配置:', {
        host: '35.221.120.166',
        user: 'root',
        port: 3306
    });
    const pool = promise_1.default.createPool({
        host: '35.221.120.166',
        user: 'root',
        password: 'Veo>mHEoROUC{`Z0',
        port: 3306,
        waitForConnections: true,
        connectionLimit: 1,
        queueLimit: 0,
        connectTimeout: 10000,
        ssl: {
            rejectUnauthorized: false
        }
    });
    try {
        // 删除已存在的用户（如果有）
        console.log('删除已存在的用户...');
        await pool.execute("DROP USER IF EXISTS 'xianwenai'@'%'");
        // 创建新用户
        console.log('创建新用户...');
        await pool.execute("CREATE USER 'xianwenai'@'%' IDENTIFIED BY 'Veo>mHEoROUC{`Z0'");
        // 创建数据库（如果不存在）
        console.log('创建数据库...');
        await pool.execute('CREATE DATABASE IF NOT EXISTS xianwenai');
        // 授予权限
        console.log('授予权限...');
        await pool.execute("GRANT ALL PRIVILEGES ON xianwenai.* TO 'xianwenai'@'%' WITH GRANT OPTION");
        await pool.execute('FLUSH PRIVILEGES');
        // 切换到数据库
        console.log('切换到数据库...');
        await pool.query('USE xianwenai');
        // 创建用户表
        console.log('创建用户表...');
        await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
        // 验证权限
        console.log('验证用户权限...');
        const [grants] = await pool.query("SHOW GRANTS FOR 'xianwenai'@'%'");
        console.log('用户权限:', grants);
        console.log('所有操作完成！');
    }
    catch (error) {
        const mysqlError = error;
        console.error('数据库操作错误:', mysqlError);
        if (mysqlError.code === 'ETIMEDOUT') {
            console.error('连接超时 - 可能的原因:');
            console.error('1. 防火墙规则未生效');
            console.error('2. 数据库实例未启动');
            console.error('3. 网络连接问题');
        }
        else if (mysqlError.code === 'ER_ACCESS_DENIED_ERROR') {
            console.error('访问被拒绝 - 用户名或密码错误');
        }
        else if (mysqlError.code === 'ECONNREFUSED') {
            console.error('连接被拒绝 - 可能数据库端口未开放');
        }
    }
    finally {
        console.log('正在关闭连接池...');
        await pool.end();
    }
}
testConnection();
