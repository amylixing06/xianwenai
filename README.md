# 先问AI：基于Chrome扩展的AI助手

**【完全开源】** 基于Chrome扩展的最佳实践开发，AI助手能够基于当前网页内容进行智能问答。支持自定义API和本地大模型。

## 项目结构

项目分为两个主要部分：

1. Chrome扩展部分：
   - `manifest.json` - 扩展配置文件
   - `background.js` - 后台脚本
   - `content.js` - 内容脚本
   - `icons/` - 扩展图标
   - `popup/` - 弹出窗口
   - `options/` - 选项页面
   - `styles/` - 样式文件

2. 网站部分（xianwenai.com）：
   - `xianwen/` - 网站前端代码

## 功能特性

- ✅🤖 基于网页内容的智能问答
- ✅💬 流式输出回答内容
- ✅📝 消息渲染支持Markdown格式
- ✅🛠️ 支持自定义API和本地模型
- ✅🔍 聊天支持上下文
- ✅🔢 自定义保留对话轮数(避免超出模型上下文长度限制)
- ✅✍️ 自定义系统提示词(不会影响其作为网页AI助手的本质)

## 安装方法

1. 从 GitHub 克隆或下载项目代码
2. 打开Chrome扩展管理页面 (chrome://extensions/)
3. 开启"开发者模式"
4. 点击"加载已解压的扩展程序"
5. 选择项目文件夹

## 基本使用说明

- 点击插件图标打开 xianwenai.com 网站
- 在网页上输入问题并等待AI回答
- 右键点击历史消息可复制内容

## 支持的API

### 自定义API
- 支持OpenAI兼容的API接口
- 可配置自定义端点

### Ollama本地部署开源模型
1. 从[官网](https://ollama.ai)下载安装 Ollama
2. 设置允许跨域并启动：
- macOS：
```bash
launchctl setenv OLLAMA_ORIGINS "*"
```
- Windows：
1. 打开控制面板-系统属性-环境变量
2. 在用户环境变量中新建：
- 变量名：`OLLAMA_HOST`，变量值：`0.0.0.0`
- 变量名：`OLLAMA_ORIGINS`，变量值：`*`
- Linux：
```bash
OLLAMA_ORIGINS="*" ollama serve
```
3. 安装模型：
```bash
ollama pull qwen2.5
```
4. 启动或重启Ollama服务
```bash
ollama serve
```
5. 注意事项
可使用自定义 API 接口地址来请求ollama服务：
`http://localhost:11434/v1/chat/completions` 
如果你是在局域网内其他主机运行的ollama服务，那么请将localhost替换为你的主机IP地址。

## 注意事项

1. 使用自定义API需要配置API密钥
2. 使用本地模型需要先安装并启动ollama，并确保服务在后台运行
3. 确保网络连接正常

## 隐私说明

- 本插件完全开源，不会收集任何个人信息
- 配置信息默认保存在本地浏览器中

## 开发说明

### Chrome扩展开发
1. 修改扩展配置：编辑 `manifest.json`
2. 修改后台脚本：编辑 `background.js`
3. 修改内容脚本：编辑 `content.js`
4. 修改弹出窗口：编辑 `popup/` 目录下的文件
5. 修改选项页面：编辑 `options/` 目录下的文件

### 网站开发
1. 进入 `xianwen` 目录
2. 安装依赖：`npm install`
3. 启动开发服务器：`npm run dev`
4. 构建生产版本：`npm run build`

## 许可证

本项目采用 MIT 许可证，详见 [LICENSE](LICENSE) 文件。