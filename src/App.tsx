import React, { useEffect, useState } from 'react';
import { Typography, message, Layout, Select, Space, Button, Dropdown } from 'antd';
import type { SelectProps } from 'antd';
import { ChatWindow } from './components/ChatWindow';
import { XiaohongshuPreview } from './components/XiaohongshuPreview';
import { useChat } from './hooks/useChat';
import { ollamaApi } from './services/ollama';
import { ModelInfo, Message, Chat } from './types/chat';
import { markdownToXiaohongshu } from './utils/markdownToXiaohongshu';
import './App.css';
import styled from 'styled-components';
import { 
  RobotOutlined, 
  PlusOutlined, 
  MessageOutlined,
  DeleteOutlined,
  MoreOutlined,
  ClearOutlined,
  MenuOutlined,
  ExportOutlined,
} from '@ant-design/icons';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

const AppContainer = styled(Layout)`
  height: 100vh;
  height: 100dvh;
  background-color: #f5f7fa;
  
  @media (max-width: 768px) {
    position: relative;
  }
`;

const StyledSider = styled(Sider)`
  background-color: #fff;
  border-right: 1px solid #e6e6e6;
  flex: 0 0 300px !important;
  max-width: 300px !important;
  min-width: 300px !important;
  width: 300px !important;
  
  .ant-layout-sider-children {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  
  @media (max-width: 768px) {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    z-index: 1000;
    transform: translateX(${props => props.collapsed ? '-100%' : '0'});
    transition: transform 0.3s ease;
    width: 80% !important;
    min-width: 80% !important;
    max-width: 80% !important;
    flex: 0 0 80% !important;
  }
`;

const SiderMask = styled.div<{ visible: boolean }>`
  display: none;
  
  @media (max-width: 768px) {
    display: ${props => props.visible ? 'block' : 'none'};
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.45);
    z-index: 999;
  }
`;

const SiderHeader = styled.div`
  padding: 16px 12px;
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px 24px;
  border-bottom: 1px solid #f0f0f0;
  height: 64px;
  
  .logo-title {
    font-size: 18px;
    font-weight: 600;
    color: #000;
    margin: 0;
  }
  
  @media (max-width: 768px) {
    height: 56px;
    padding: 16px;
    
    .logo-title {
      font-size: 16px;
    }
  }
`;

const NewChatButton = styled(Button)`
  width: 100%;
  height: 40px;
  background-color: #eef4ff;
  border: none;
  color: #4080ff;
  font-weight: 500;
  font-size: 14px;
  
  &:hover {
    background-color: #e6f0ff;
    color: #3674ff;
  }
  
  .anticon {
    font-size: 16px;
  }
`;

const ChatList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 0 12px 12px;
  
  &::-webkit-scrollbar {
    width: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.1);
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: rgba(0, 0, 0, 0.2);
  }
`;

const ChatItem = styled.div<{ active?: boolean }>`
  padding: 8px 12px;
  margin-bottom: 4px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${props => props.active ? '#000' : '#666'};
  background-color: ${props => props.active ? '#f0f7ff' : 'transparent'};
  font-size: 14px;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: ${props => props.active ? '#f0f7ff' : '#f5f5f5'};
  }
  
  .anticon {
    font-size: 16px;
    color: ${props => props.active ? '#4080ff' : '#999'};
  }
  
  .chat-title {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  
  .chat-actions {
    display: none;
  }
  
  &:hover .chat-actions {
    display: flex;
    align-items: center;
    gap: 4px;
  }
`;

const SiderFooter = styled.div`
  margin-top: auto;
  padding: 16px;
  border-top: 1px solid #f0f0f0;
  display: flex;
  justify-content: center;
`;

const MainContainer = styled(Layout)`
  background-color: #fff;
  
  @media (max-width: 768px) {
    margin-left: 0 !important;
  }
`;

const StyledHeader = styled(Header)`
  background-color: #fff;
  border-bottom: 1px solid #f0f0f0;
  height: 64px;
  line-height: 64px;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 10;
  
  @media (max-width: 768px) {
    height: 56px;
    line-height: 56px;
    padding: 0 12px;
  }
`;

const MenuButton = styled(Button)`
  display: none;
  
  @media (max-width: 768px) {
    display: block;
    margin-right: 12px;
  }
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
`;

const HeaderTitle = styled(Title)`
  margin: 0 !important;
  font-size: 16px !important;
  font-weight: 500 !important;
  color: #000 !important;
  flex: 1;
  padding: 0 16px;
  
  @media (max-width: 768px) {
    font-size: 14px !important;
    padding: 0 8px;
  }
`;

const ModelSelect = styled(Select)`
  width: 200px;
  
  .ant-select-selection-item {
    font-weight: 500;
    color: #000;
    font-size: 14px;
  }
  
  &.ant-select-outlined:not(.ant-select-disabled):not(.ant-select-customize-input):not(.ant-pagination-size-changer) .ant-select-selector {
    background-color: #f5f7fa;
    border-color: #e6e6e6;
    height: 36px;
    padding: 0 12px;
  }
  
  @media (max-width: 768px) {
    width: 120px;
  }
`;

const ChatContainer = styled(Content)`
  position: relative;
  overflow: hidden;
  background-color: #fff;
`;

const App: React.FC = () => {
  const {
    state,
    currentChat,
    loading,
    error,
    sendMessage,
    setModel,
    stopGeneration,
    resendLastMessage,
    createNewChat,
    switchChat,
    deleteChat,
    clearCurrentChat,
  } = useChat();
  const [connectionChecked, setConnectionChecked] = useState(false);
  const [models, setModels] = useState<ModelInfo[]>([]);
  const [loadingModels, setLoadingModels] = useState(false);
  const [siderVisible, setSiderVisible] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [xiaohongshuContent, setXiaohongshuContent] = useState('');
  const [originalMarkdown, setOriginalMarkdown] = useState('');

  // 获取模型列表
  const fetchModels = async () => {
    try {
      setLoadingModels(true);
      const response = await ollamaApi.getModels();
      setModels(response.models);
    } catch (error) {
      message.error('获取模型列表失败');
    } finally {
      setLoadingModels(false);
    }
  };

  // 处理模型选择
  const handleModelChange: SelectProps['onChange'] = (value) => {
    const modelName = String(value);
    setModel(modelName);
    message.success(`已切换到模型: ${modelName}`);
  };

  useEffect(() => {
    const checkConnection = async () => {
      if (!connectionChecked) {
        const isConnected = await ollamaApi.checkConnection();
        if (!isConnected) {
          message.error('无法连接到Ollama服务，请确保服务已启动');
        } else {
          fetchModels();
        }
        setConnectionChecked(true);
      }
    };

    checkConnection();
  }, [connectionChecked]);

  const handleDeleteChat = (chatId: string) => {
    deleteChat(chatId);
    message.success('对话已删除');
  };

  const handleClearChat = () => {
    clearCurrentChat();
    message.success('对话已清空');
  };

  const toggleSider = () => {
    setSiderVisible(!siderVisible);
  };

  const handleSiderClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleExportToXiaohongshu = () => {
    if (!currentChat || currentChat.messages.length === 0) {
      message.warning('当前对话为空');
      return;
    }

    // 获取最新一条AI回复
    const assistantMessages = currentChat.messages.filter(
      (msg: Message) => msg.role === 'assistant'
    );

    if (assistantMessages.length === 0) {
      message.warning('没有找到AI回复');
      return;
    }

    // 获取最新一条消息
    const latestMessage = assistantMessages[assistantMessages.length - 1];
    const markdown = latestMessage.content;

    // 保存原始markdown
    setOriginalMarkdown(markdown);
    
    // 转换为小红书格式（默认去掉thinking内容）
    const xiaohongshuText = markdownToXiaohongshu(markdown, true);
    setXiaohongshuContent(xiaohongshuText);
    setPreviewVisible(true);
  };

  const handlePreviewClose = () => {
    setPreviewVisible(false);
  };

  const handleContentChange = (newContent: string) => {
    setXiaohongshuContent(newContent);
  };

  return (
    <AppContainer>
      <SiderMask visible={siderVisible} onClick={() => setSiderVisible(false)} />
      <StyledSider width={260} collapsed={!siderVisible} onClick={handleSiderClick}>
        <LogoContainer>
          <RobotOutlined style={{ fontSize: 24, color: '#4080ff' }} />
          <h1 className="logo-title">Ollama Chat</h1>
        </LogoContainer>
        <SiderHeader>
          <NewChatButton 
            icon={<PlusOutlined />}
            onClick={createNewChat}
          >
            开启新对话
          </NewChatButton>
        </SiderHeader>
        <ChatList>
          {state.chats.map((chat: Chat) => (
            <ChatItem 
              key={chat.id} 
              active={currentChat?.id === chat.id}
              onClick={() => {
                switchChat(chat.id);
                setSiderVisible(false);
              }}
            >
              <MessageOutlined />
              <span className="chat-title">{chat.title}</span>
              <div className="chat-actions">
                <Button
                  type="text"
                  size="small"
                  icon={<DeleteOutlined />}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteChat(chat.id);
                  }}
                />
              </div>
            </ChatItem>
          ))}
        </ChatList>
        <SiderFooter>
          <Button 
            type="default"
            icon={<ExportOutlined />}
            onClick={handleExportToXiaohongshu}
          >
            转换为小红书格式
          </Button>
        </SiderFooter>
      </StyledSider>
      <MainContainer>
        <StyledHeader>
          <HeaderLeft>
            <MenuButton
              type="text"
              icon={<MenuOutlined />}
              onClick={toggleSider}
            />
            <HeaderTitle level={4}>
              {currentChat?.title || '新对话'}
            </HeaderTitle>
          </HeaderLeft>
          <Space>
            <ModelSelect
              loading={loadingModels}
              value={currentChat?.model}
              onChange={handleModelChange}
              options={models.map(model => ({
                label: model.name,
                value: model.name,
              }))}
              placeholder="选择模型"
            />
            <Dropdown
              menu={{
                items: [
                  {
                    key: 'clear',
                    icon: <ClearOutlined />,
                    label: '清空对话',
                    onClick: handleClearChat,
                  },
                ],
              }}
              trigger={['click']}
            >
              <Button
                type="text"
                icon={<MoreOutlined />}
                style={{ color: '#666' }}
              />
            </Dropdown>
          </Space>
        </StyledHeader>
        <ChatContainer>
          {currentChat && (
            <ChatWindow
              messages={currentChat.messages}
              loading={loading}
              error={error}
              onSend={sendMessage}
              onStop={stopGeneration}
              onResend={resendLastMessage}
            />
          )}
        </ChatContainer>
      </MainContainer>
      <XiaohongshuPreview
        visible={previewVisible}
        onClose={handlePreviewClose}
        content={xiaohongshuContent}
        originalMarkdown={originalMarkdown}
        onContentChange={handleContentChange}
      />
    </AppContainer>
  );
};

export default App; 