import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());

// 基本路由
app.get('/', (req, res) => {
  res.json({ message: '先问AI API 服务运行中' });
});

// 启动服务器
app.listen(port, () => {
  console.log(`服务器运行在端口 ${port}`);
}); 