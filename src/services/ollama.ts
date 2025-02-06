import axios from 'axios';
import { OllamaRequest, OllamaResponse, ModelsResponse, Message } from '../types/chat';

const BASE_URL = 'http://localhost:11434';

export const ollamaApi = {
  generate: async (prompt: string, model: string, messages: Message[] = []): Promise<Response> => {
    const request: OllamaRequest = {
      model,
      prompt,
      stream: true,
      temperature: 0.7,
      messages: messages.map(msg => ({
        role: msg.role,
        content: msg.content,
      })),
    };

    return fetch(`${BASE_URL}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });
  },

  // 获取可用模型列表
  getModels: async (): Promise<ModelsResponse> => {
    try {
      const response = await fetch(`${BASE_URL}/api/tags`);
      if (!response.ok) {
        throw new Error('获取模型列表失败');
      }
      return response.json();
    } catch (error) {
      console.error('获取模型列表失败:', error);
      throw error;
    }
  },

  // 用于测试API连接
  checkConnection: async (): Promise<boolean> => {
    try {
      const response = await fetch(`${BASE_URL}/api/version`);
      return response.ok;
    } catch (error) {
      console.error('Ollama 服务连接失败:', error);
      return false;
    }
  },
}; 