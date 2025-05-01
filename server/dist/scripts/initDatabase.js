"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../config/database");
async function initDatabase() {
    const pool = (0, database_1.createPool)();
    try {
        console.log('开始初始化数据库...');
        // 1. 创建数据库（如果不存在）
        await pool.query('CREATE DATABASE IF NOT EXISTS xianwenai');
        console.log('✓ 数据库创建成功');
        // 2. 使用数据库
        await pool.query('USE xianwenai');
        console.log('✓ 切换到数据库成功');
        // 3. 创建用户表
        await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
        console.log('✓ 用户表创建成功');
        // 4. 创建消息表
        await pool.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        content TEXT NOT NULL,
        role ENUM('user', 'assistant') NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);
        console.log('✓ 消息表创建成功');
        console.log('数据库初始化完成！');
    }
    catch (error) {
        console.error('数据库初始化失败:', error);
        throw error;
    }
    finally {
        await pool.end();
    }
}
// 执行初始化
initDatabase().catch(console.error);
