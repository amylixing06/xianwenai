"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const deploy_1 = require("../config/deploy");
async function main() {
    try {
        console.log('开始部署前检查...');
        const checkPassed = await (0, deploy_1.preDeployCheck)();
        if (checkPassed) {
            console.log('部署前检查通过！');
            process.exit(0);
        }
        else {
            console.error('部署前检查未通过！');
            process.exit(1);
        }
    }
    catch (error) {
        console.error('检查过程中出错:', error);
        process.exit(1);
    }
}
main();
