import React, { useEffect, useRef } from 'react';
import { Alert, Spin } from 'antd';
import { ChatMessage } from '../ChatMessage';
import { ChatInput } from '../ChatInput';
import { Message } from '../../types/chat';
import './style.css';

interface ChatWindowProps {
  messages: Message[];
  loading: boolean;
  error: string | null;
  onSend: (message: string) => void;
  onStop?: () => void;
  onResend?: () => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  messages,
  loading,
  error,
  onSend,
  onStop,
  onResend,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="chat-window">
      <div className="messages-container">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        {loading && (
          <div className="loading-container">
            <Spin tip="正在思考..." />
          </div>
        )}
        {error && (
          <Alert
            message="错误"
            description={error}
            type="error"
            showIcon
            className="error-alert"
          />
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="input-container">
        <ChatInput
          onSend={onSend}
          onStop={onStop}
          onResend={onResend}
          disabled={loading}
          loading={loading}
        />
      </div>
    </div>
  );
}; 