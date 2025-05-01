"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const production_1 = require("../config/production");
async function testProduction() {
    console.log('正在测试生产环境数据库连接...');
    try {
        // 测试基本连接
        const isConnected = await (0, production_1.testProductionConnection)();
        if (!isConnected) {
            throw new Error('生产环境数据库连接失败');
        }
        // 测试数据库操作
        const pool = (0, production_1.createProductionPool)();
        try {
            // 测试数据库访问
            await pool.query('USE xianwenai');
            console.log('✓ 生产环境数据库访问成功');
            // 测试表查询
            const [tables] = await pool.query('SHOW TABLES');
            console.log('✓ 生产环境表查询成功');
            console.log('生产环境数据库中的表:', tables);
            console.log('所有生产环境测试通过！');
        }
        finally {
            await pool.end();
        }
    }
    catch (error) {
        console.error('生产环境测试失败:', error);
        throw error;
    }
}
// 执行测试
testProduction().catch(console.error);
