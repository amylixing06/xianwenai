import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());

// 静态文件服务
app.use(express.static(path.join(__dirname, '../../dist')));

// API路由
app.get('/api', (req, res) => {
  res.json({ message: '先问AI API 服务运行中' });
});

// SPA路由处理
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../dist/index.html'));
});

// 启动服务器
app.listen(port, () => {
  console.log(`服务器运行在端口 ${port}`);
}); 