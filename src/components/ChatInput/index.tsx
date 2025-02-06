import React, { useState, KeyboardEvent } from 'react';
import { Input, Button } from 'antd';
import { 
  SendOutlined, 
  StopOutlined, 
  RedoOutlined,
} from '@ant-design/icons';
import './style.css';

const { TextArea } = Input;

interface ChatInputProps {
  onSend: (message: string) => void;
  onStop?: () => void;
  onResend?: () => void;
  disabled?: boolean;
  loading?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSend,
  onStop,
  onResend,
  disabled,
  loading,
}) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSend(message);
      setMessage('');
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      <div className="chat-input">
        <TextArea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="输入消息，按Enter发送，Shift+Enter换行..."
          autoSize={{ minRows: 1, maxRows: 6 }}
          disabled={disabled}
        />
        <div className="button-group">
          {loading ? (
            <Button
              type="primary"
              danger
              icon={<StopOutlined />}
              onClick={onStop}
            >
              停止生成
            </Button>
          ) : disabled && onResend ? (
            <Button
              type="primary"
              icon={<RedoOutlined />}
              onClick={onResend}
            >
              重新生成
            </Button>
          ) : (
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={handleSend}
              disabled={!message.trim() || disabled}
            >
              发送
            </Button>
          )}
        </div>
      </div>
      <div className="input-footer">
        内容由 AI 生成，请仔细甄别
      </div>
    </>
  );
}; 