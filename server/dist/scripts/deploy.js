"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const deploy_1 = require("../config/deploy");
async function main() {
    try {
        console.log('开始部署流程...');
        // 1. 运行部署前检查
        console.log('\n=== 部署前检查 ===');
        const checkPassed = await (0, deploy_1.preDeployCheck)();
        if (!checkPassed) {
            throw new Error('部署前检查未通过，终止部署');
        }
        // 2. 执行部署
        console.log('\n=== 开始部署 ===');
        await (0, deploy_1.deploy)();
        console.log('\n部署完成！');
    }
    catch (error) {
        console.error('部署过程出错:', error);
        process.exit(1);
    }
}
// 执行部署
main();
