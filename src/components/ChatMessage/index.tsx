import React from 'react';
import { Typography, Button, message } from 'antd';
import { 
  CopyOutlined, 
  UserOutlined, 
  RobotOutlined,
  LikeOutlined,
  DislikeOutlined,
  RedoOutlined,
} from '@ant-design/icons';
import { Message } from '../../types/chat';
import './style.css';

const { Text, Paragraph } = Typography;

interface ChatMessageProps {
  message: Message;
  onResend?: () => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, onResend }) => {
  const isUser = message.role === 'user';

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    message.success('已复制到剪贴板');
  };

  // 处理消息内容，移除 <think> 标签
  const processContent = (content: string) => {
    return content.replace(/<think>.*?<\/think>/g, '').trim();
  };

  return (
    <div className={`message-container ${isUser ? 'user' : 'assistant'}`}>
      <div className="avatar">
        {isUser ? <UserOutlined /> : <RobotOutlined />}
      </div>
      <div className="message-content-wrapper">
        <Paragraph className="message-content">
          {processContent(message.content)}
        </Paragraph>
        <div className="message-footer">
          <Text type="secondary" className="time">
            {new Date(message.timestamp).toLocaleTimeString()}
          </Text>
          <div className="message-actions">
            {!isUser && (
              <>
                <Button
                  type="text"
                  size="small"
                  icon={<LikeOutlined />}
                />
                <Button
                  type="text"
                  size="small"
                  icon={<DislikeOutlined />}
                />
                {onResend && (
                  <Button
                    type="text"
                    size="small"
                    icon={<RedoOutlined />}
                    onClick={onResend}
                  />
                )}
              </>
            )}
            <Button
              type="text"
              icon={<CopyOutlined />}
              onClick={handleCopy}
              size="small"
              className="copy-button"
            />
          </div>
        </div>
      </div>
    </div>
  );
}; 