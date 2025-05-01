"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMessage = sendMessage;
const axios_1 = __importDefault(require("axios"));
const DEEPSEEK_API_URL = 'https://api.deepseek.ai/v1/chat/completions';
async function sendMessage(messages, apiKey) {
    var _a, _b;
    try {
        const response = await axios_1.default.post(DEEPSEEK_API_URL, {
            model: 'deepseek-chat',
            messages,
            temperature: 0.7,
            max_tokens: 2000
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            }
        });
        return response.data.choices[0].message.content;
    }
    catch (error) {
        console.error('DeepSeek API错误:', ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
        if (error.response) {
            throw new Error(`DeepSeek API错误: ${((_b = error.response.data.error) === null || _b === void 0 ? void 0 : _b.message) || error.response.data}`);
        }
        throw new Error('与DeepSeek API通信时出错');
    }
}
