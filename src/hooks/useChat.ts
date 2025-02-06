import { useState, useCallback, useRef, useEffect } from 'react';
import { Message, Chat, ChatState } from '../types/chat';
import { ollamaApi } from '../services/ollama';

const STORAGE_KEY = 'ollama-chats';

const createChat = (model: string): Chat => ({
  id: Math.random().toString(36).substring(7),
  title: '新对话',
  messages: [],
  model,
  createdAt: Date.now(),
  updatedAt: Date.now(),
});

export const useChat = () => {
  const [state, setState] = useState<ChatState>(() => {
    const savedState = localStorage.getItem(STORAGE_KEY);
    if (savedState) {
      return JSON.parse(savedState);
    }
    const initialChat = createChat('deepseek-r1:8b');
    return {
      chats: [initialChat],
      currentChatId: initialChat.id,
      loading: false,
      error: null,
    };
  });

  const [currentModel, setCurrentModel] = useState<string>(() => {
    const currentChat = state.chats.find(chat => chat.id === state.currentChatId);
    return currentChat?.model || 'deepseek-r1:8b';
  });

  const abortControllerRef = useRef<AbortController | null>(null);
  const lastMessageRef = useRef<string | null>(null);

  // 保存状态到localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const getCurrentChat = useCallback(() => {
    return state.chats.find(chat => chat.id === state.currentChatId);
  }, [state.chats, state.currentChatId]);

  const addMessage = useCallback((message: Omit<Message, 'id' | 'timestamp'>) => {
    const newMessage: Message = {
      ...message,
      id: Math.random().toString(36).substring(7),
      timestamp: Date.now(),
    };

    setState((prev) => {
      const updatedChats = prev.chats.map(chat => {
        if (chat.id === prev.currentChatId) {
          return {
            ...chat,
            messages: [...chat.messages, newMessage],
            updatedAt: Date.now(),
            title: chat.messages.length === 0 && message.role === 'user' 
              ? message.content.slice(0, 50) 
              : chat.title,
          };
        }
        return chat;
      });

      return {
        ...prev,
        chats: updatedChats,
      };
    });

    return newMessage;
  }, []);

  const createNewChat = useCallback(() => {
    const newChat = createChat(currentModel);
    setState((prev) => ({
      ...prev,
      chats: [newChat, ...prev.chats],
      currentChatId: newChat.id,
    }));
    return newChat;
  }, [currentModel]);

  const switchChat = useCallback((chatId: string) => {
    setState((prev) => ({
      ...prev,
      currentChatId: chatId,
    }));
    const chat = state.chats.find(c => c.id === chatId);
    if (chat) {
      setCurrentModel(chat.model);
    }
  }, [state.chats]);

  const deleteChat = useCallback((chatId: string) => {
    setState((prev) => {
      const updatedChats = prev.chats.filter(chat => chat.id !== chatId);
      let newCurrentChatId = prev.currentChatId;
      
      if (chatId === prev.currentChatId) {
        newCurrentChatId = updatedChats[0]?.id || null;
      }
      
      return {
        ...prev,
        chats: updatedChats,
        currentChatId: newCurrentChatId,
      };
    });
  }, []);

  const stopGeneration = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setState((prev) => ({ ...prev, loading: false }));
    }
  }, []);

  const resendLastMessage = useCallback(async () => {
    if (lastMessageRef.current) {
      await sendMessage(lastMessageRef.current);
    }
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    // 保存当前消息用于重发
    lastMessageRef.current = content;

    // 添加用户消息
    addMessage({ content, role: 'user' });

    // 创建助手消息
    const assistantMessage = addMessage({ content: '', role: 'assistant' });

    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      // 如果存在之前的请求，取消它
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // 获取当前对话的历史消息
      const currentChat = getCurrentChat();
      const historyMessages = currentChat?.messages.slice(0, -2) || []; // 不包括刚刚添加的两条消息

      abortControllerRef.current = new AbortController();
      const response = await ollamaApi.generate(content, currentModel, historyMessages);
      const reader = response.body?.getReader();
      
      if (!reader) {
        throw new Error('Failed to get response reader');
      }

      let fullResponse = '';
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = new TextDecoder().decode(value);
        const lines = chunk.split('\n').filter(Boolean);
        
        for (const line of lines) {
          const data = JSON.parse(line);
          fullResponse += data.response;
          
          setState((prev) => ({
            ...prev,
            chats: prev.chats.map(chat => {
              if (chat.id === prev.currentChatId) {
                return {
                  ...chat,
                  messages: chat.messages.map(msg =>
                    msg.id === assistantMessage.id
                      ? { ...msg, content: fullResponse }
                      : msg
                  ),
                };
              }
              return chat;
            }),
          }));
        }
      }
    } catch (error) {
      // 如果是中断请求，不显示错误
      if (error.name === 'AbortError') return;

      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : '发送消息失败',
      }));
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
      abortControllerRef.current = null;
    }
  }, [currentModel, addMessage, getCurrentChat]);

  const setModel = useCallback((model: string) => {
    setCurrentModel(model);
    setState((prev) => ({
      ...prev,
      chats: prev.chats.map(chat => {
        if (chat.id === prev.currentChatId) {
          return {
            ...chat,
            model,
          };
        }
        return chat;
      }),
    }));
  }, []);

  const clearCurrentChat = useCallback(() => {
    setState((prev) => ({
      ...prev,
      chats: prev.chats.map(chat => {
        if (chat.id === prev.currentChatId) {
          return {
            ...chat,
            messages: [],
            updatedAt: Date.now(),
          };
        }
        return chat;
      }),
    }));
    lastMessageRef.current = null;
  }, []);

  return {
    chats: state.chats,
    currentChat: getCurrentChat(),
    loading: state.loading,
    error: state.error,
    sendMessage,
    clearCurrentChat,
    createNewChat,
    switchChat,
    deleteChat,
    setModel,
    stopGeneration,
    resendLastMessage,
  };
}; 