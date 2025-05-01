"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../config/database");
async function testConnection() {
    console.log('正在测试数据库连接...');
    const pool = (0, database_1.createPool)();
    try {
        // 测试基本连接
        const connection = await pool.getConnection();
        console.log('✓ 基本连接成功');
        connection.release();
        // 测试数据库访问
        await pool.query('USE xianwenai');
        console.log('✓ 数据库访问成功');
        // 测试表查询
        const [tables] = await pool.query('SHOW TABLES');
        console.log('✓ 表查询成功');
        console.log('当前数据库中的表:', tables);
        console.log('所有测试通过！');
    }
    catch (error) {
        console.error('测试失败:', error);
        throw error;
    }
    finally {
        await pool.end();
    }
}
// 执行测试
testConnection().catch(console.error);
