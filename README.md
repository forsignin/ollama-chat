# Ollama Chat

一个基于 Ollama 的本地聊天应用，支持多种大语言模型。

## 功能特点

- 🤖 支持多种大语言模型切换
- 💬 实时流式对话
- 🎨 美观的用户界面
- 📋 消息复制功能
- 💾 自动保存上次使用的模型
- ⚡️ 快速响应

## 开始使用

1. 确保已安装 Ollama：
```bash
curl https://ollama.ai/install.sh | sh
```

2. 拉取需要的模型（以 deepseek 为例）：
```bash
ollama pull deepseek-r1:8b
```

3. 启动 Ollama 服务：
```bash
ollama serve
```

4. 安装依赖：
```bash
npm install
```

5. 启动应用：
```bash
npm run dev
```

## 使用说明

1. 在页面顶部的下拉菜单中选择要使用的模型
2. 在输入框中输入消息，按 Enter 发送
3. 使用 Shift + Enter 可以换行
4. 点击消息右上角的复制按钮可以复制消息内容

## 支持的模型

应用会自动显示本地已安装的所有 Ollama 模型，你可以使用 `ollama pull` 命令安装更多模型：

```bash
# 安装 Llama2 模型
ollama pull llama2

# 安装 Deepseek 模型
ollama pull deepseek-r1:8b

# 安装其他模型
ollama pull mistral
ollama pull codellama
```

## 技术栈

- React + TypeScript
- Ant Design
- Styled Components
- Ollama API

## 开发

1. 克隆仓库：
```bash
git clone <repository-url>
```

2. 安装依赖：
```bash
npm install
```

3. 启动开发服务器：
```bash
npm run dev
```

## 贡献

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```
