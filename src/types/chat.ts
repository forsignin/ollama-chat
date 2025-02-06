/** 单条聊天消息的接口定义 */
export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: number; // Unix timestamp in milliseconds
}

/** 聊天会话的接口定义 */
export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  model: string;
  createdAt: number;
  updatedAt: number;
}

/** 聊天状态管理的接口定义 */
export interface ChatState {
  chats: Chat[];
  currentChatId: string | null;
  loading: boolean;
  error: string | null;
}

/** Ollama API请求参数接口 */
export interface OllamaRequest {
  model: string;
  prompt: string;
  stream?: boolean;
  temperature?: number;  // 控制响应的随机性 (0-1)
  top_p?: number;       // 控制词汇选择的多样性 (0-1)
  top_k?: number;       // 控制每一步可以选择的词汇数量
  context?: number[];   // 上下文窗口
  messages?: { role: 'user' | 'assistant', content: string }[]; // 历史消息
}

/** Ollama API响应接口 */
export interface OllamaResponse {
  model: string;
  created_at: string;
  response: string;
  done: boolean;
  context?: number[]; // 返回的上下文窗口
}

/** Ollama 模型信息接口 */
export interface ModelInfo {
  name: string;
  size: number;
  digest: string;
  modified_at: string;
  details: {
    format: string;
    family: string;
    parameter_size: string;
    quantization_level: string;
  };
}

/** 模型列表响应接口 */
export interface ModelsResponse {
  models: ModelInfo[];
} 