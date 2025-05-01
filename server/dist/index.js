"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_1 = require("./routes/auth");
const auth_2 = require("./middleware/auth");
const cors_1 = __importDefault(require("cors"));
const deepseek_1 = require("./services/deepseek");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
// 中间件
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// 存储对话历史（临时存储在内存中）
const conversations = new Map();
// API路由处理器
const handleChat = async (req, res) => {
    const { message, conversationId = 'default' } = req.body;
    const userId = req.user.id;
    // 获取或初始化对话历史
    const userConversationId = `${userId}-${conversationId}`;
    if (!conversations.has(userConversationId)) {
        conversations.set(userConversationId, []);
    }
    const history = conversations.get(userConversationId);
    // 添加用户消息
    history.push({ role: 'user', content: message });
    // 调用DeepSeek API
    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) {
        throw new Error('未配置DeepSeek API密钥');
    }
    const reply = await (0, deepseek_1.sendMessage)(history, apiKey);
    // 添加助手回复到历史记录
    history.push({ role: 'assistant', content: reply });
    // 如果历史记录太长，删除最早的消息
    if (history.length > 20) {
        history.splice(0, 2); // 每次删除一组对话（用户消息和助手回复）
    }
    res.json({ reply, conversationId });
};
const getHistory = async (req, res) => {
    const { conversationId } = req.params;
    const userId = req.user.id;
    const userConversationId = `${userId}-${conversationId}`;
    const history = conversations.get(userConversationId) || [];
    res.json({ history });
};
const clearHistory = async (req, res) => {
    const { conversationId } = req.params;
    const userId = req.user.id;
    const userConversationId = `${userId}-${conversationId}`;
    conversations.delete(userConversationId);
    res.json({ message: '对话历史已清除' });
};
// 错误处理中间件
const asyncHandler = (fn) => (req, res, next) => {
    return Promise.resolve(fn(req, res, next)).catch(next);
};
// 路由注册
const router = express_1.default.Router();
router.post('/chat', auth_2.authenticateToken, asyncHandler(handleChat));
router.get('/chat/:conversationId', auth_2.authenticateToken, asyncHandler(getHistory));
router.delete('/chat/:conversationId', auth_2.authenticateToken, asyncHandler(clearHistory));
// 添加认证路由
const authRouter = (0, auth_1.createAuthRouter)();
app.use('/api/auth', authRouter);
app.use('/api', router);
// 主页路由
const homeHandler = (req, res) => {
    res.send('XianwenAI API is running');
};
app.get('/', homeHandler);
// 错误处理中间件
const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: '服务器内部错误' });
};
app.use(errorHandler);
// 启动服务器
app.listen(port, () => {
    console.log(`服务器运行在端口 ${port}`);
});
