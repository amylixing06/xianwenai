# 先问 AI

一个基于 React 和 TypeScript 的智能对话应用。

## 功能特点

- 💬 智能对话：与 AI 进行自然语言交流
- 🎨 现代界面：使用 Chakra UI 构建的美观界面
- 📱 响应式设计：完美适配各种设备尺寸
- ⚡️ 高性能：使用 Vite 构建，支持代码分割
- 🔍 实时预览：支持 Markdown 实时渲染
- 🌐 离线支持：实现了 PWA，支持离线访问

## 技术栈

- React 18
- TypeScript
- Vite
- Chakra UI
- React Router
- React Markdown
- Date-fns

## 开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview

# 代码格式化
npm run format

# 类型检查
npm run typecheck

# 生成图标
npm run generate-icons

# 分析构建
npm run analyze
```

## 项目结构

```
src/
  ├── assets/        # 静态资源
  │   ├── images/    # 图片资源
  │   └── styles/    # 样式文件
  ├── components/    # 组件
  ├── services/      # API 服务
  ├── hooks/         # 自定义 Hooks
  ├── utils/         # 工具函数
  ├── types/         # 类型定义
  └── constants/     # 常量定义
```

## 环境变量

创建 `.env` 文件并设置以下变量：

```env
VITE_API_URL=你的API地址
VITE_API_KEY=你的API密钥
```

## 贡献

欢迎提交 Issue 和 Pull Request。

## 许可证

MIT