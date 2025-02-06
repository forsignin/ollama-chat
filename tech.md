# Ollama Deepseek 对话应用 - 技术方案文档

## 1. 技术栈选择
- 框架：React 18
- UI组件库：Ant Design 5.x
- 构建工具：Vite
- HTTP客户端：Axios
- 包管理工具：cnpm
- 代码规范：ESLint + Prettier
- 开发语言：TypeScript

## 2. 项目结构
```
src/
  ├── components/        # 组件目录
  │   ├── ChatMessage/  # 消息气泡组件
  │   ├── ChatInput/    # 输入框组件
  │   └── ChatWindow/   # 对话窗口组件
  ├── services/         # API服务
  │   └── ollama.ts     # Ollama API封装
  ├── types/            # 类型定义
  │   └── chat.ts       # 聊天相关类型
  ├── hooks/            # 自定义Hook
  │   └── useChat.ts    # 聊天逻辑Hook
  ├── utils/            # 工具函数
  ├── App.tsx          # 应用入口
  └── main.tsx         # 主入口文件
```

## 3. API接口设计

### 3.1 Ollama API
基础URL: http://localhost:11434/api

#### 生成对话响应
- 接口：POST /generate
- 请求体：
```json
{
  "model": "deepseek",
  "prompt": string,
  "stream": true
}
```
- 响应：Server-Sent Events (SSE)格式
```json
{
  "model": "deepseek",
  "created_at": string,
  "response": string,
  "done": boolean
}
```

## 4. 数据流设计
### 4.1 状态管理
使用React Hooks管理状态：
- messages: 对话历史记录
- loading: 加载状态
- error: 错误信息

### 4.2 数据流转
1. 用户输入 -> ChatInput组件
2. 触发useChat Hook中的sendMessage方法
3. 调用Ollama API
4. 接收SSE响应
5. 更新messages状态
6. 渲染新消息到ChatWindow

## 5. 组件设计

### 5.1 ChatWindow
- 功能：显示对话历史
- 属性：
  - messages: Message[]
  - loading: boolean
- 职责：
  - 渲染消息列表
  - 自动滚动
  - 加载状态显示

### 5.2 ChatMessage
- 功能：显示单条消息
- 属性：
  - content: string
  - role: 'user' | 'assistant'
  - timestamp: number
- 职责：
  - 消息气泡渲染
  - 复制功能
  - 时间显示

### 5.3 ChatInput
- 功能：用户输入界面
- 属性：
  - onSend: (message: string) => void
  - disabled: boolean
- 职责：
  - 文本输入
  - 发送消息
  - 快捷键处理

## 6. 错误处理
### 6.1 API错误
- 网络错误：重试机制
- 超时处理：30s超时限制
- 服务器错误：友好提示

### 6.2 用户输入验证
- 空消息检查
- 最大长度限制
- 特殊字符过滤

## 7. 性能优化
### 7.1 渲染优化
- 虚拟列表（react-window）
- 消息懒加载
- 防抖处理

### 7.2 网络优化
- 请求缓存
- 断线重连
- 消息队列

## 8. 部署方案
### 8.1 开发环境
```bash
cnpm install
cnpm run dev
```

### 8.2 生产环境
```bash
cnpm run build
# 使用nginx部署dist目录
```

## 9. 后续优化计划
- 添加消息持久化
- 实现会话管理
- 添加设置面板
- 支持更多模型
- 优化移动端体验 