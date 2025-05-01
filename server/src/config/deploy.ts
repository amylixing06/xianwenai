import { createProductionPool } from './production';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// 部署配置
export const deployConfig = {
  // 服务器配置
  server: {
    host: process.env.DEPLOY_HOST || '35.221.120.166',
    port: process.env.DEPLOY_PORT || '22',
    user: process.env.DEPLOY_USER || 'xianwenai',
    // 密钥路径，建议使用环境变量配置
    keyPath: process.env.DEPLOY_KEY_PATH || '~/.ssh/id_rsa'
  },
  
  // 应用配置
  app: {
    name: 'xianwenai',
    port: process.env.PORT || '3000',
    env: 'production'
  }
};

// 部署前检查
export async function preDeployCheck() {
  console.log('开始部署前检查...');
  
  try {
    // 1. 检查数据库连接
    const pool = createProductionPool();
    try {
      await pool.getConnection();
      console.log('✓ 数据库连接检查通过');
    } finally {
      await pool.end();
    }

    // 2. 检查 Node.js 版本
    const { stdout: nodeVersion } = await execAsync('node -v');
    console.log('✓ Node.js 版本检查通过:', nodeVersion.trim());

    // 3. 检查 npm 版本
    const { stdout: npmVersion } = await execAsync('npm -v');
    console.log('✓ npm 版本检查通过:', npmVersion.trim());

    console.log('所有部署前检查通过！');
    return true;
  } catch (error) {
    console.error('部署前检查失败:', error);
    return false;
  }
}

// 部署脚本
export async function deploy() {
  console.log('开始部署...');
  
  try {
    // 1. 运行部署前检查
    const checkPassed = await preDeployCheck();
    if (!checkPassed) {
      throw new Error('部署前检查未通过');
    }

    // 2. 构建应用
    console.log('构建应用...');
    await execAsync('npm run build');
    console.log('✓ 应用构建完成');

    // 3. 启动应用
    console.log('启动应用...');
    await execAsync('npm run start');
    console.log('✓ 应用启动成功');

    console.log('部署完成！');
  } catch (error) {
    console.error('部署失败:', error);
    throw error;
  }
} 