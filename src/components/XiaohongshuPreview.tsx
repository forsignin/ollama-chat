import React, { useState, useEffect } from 'react';
import { Modal, Input, Button, Space, message, Tabs } from 'antd';
import styled from 'styled-components';
import { CopyOutlined, EditOutlined, EyeOutlined, FileTextOutlined } from '@ant-design/icons';
import { markdownToXiaohongshu } from '../utils/markdownToXiaohongshu';

const { TextArea } = Input;
const { TabPane } = Tabs;

const PreviewContent = styled.div`
  padding: 16px;
  background: #fff;
  border-radius: 8px;
  white-space: pre-wrap;
  max-height: 60vh;
  overflow-y: auto;
  font-size: 14px;
  line-height: 1.8;

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
`;

const StyledTextArea = styled(TextArea)`
  font-size: 14px;
  line-height: 1.8;
  resize: none;
  height: 60vh !important;
`;

interface XiaohongshuPreviewProps {
  visible: boolean;
  onClose: () => void;
  content: string;
  originalMarkdown: string;
  onContentChange?: (content: string) => void;
}

export const XiaohongshuPreview: React.FC<XiaohongshuPreviewProps> = ({
  visible,
  onClose,
  content,
  originalMarkdown,
  onContentChange,
}) => {
  const [editableContent, setEditableContent] = useState(content);
  const [activeTab, setActiveTab] = useState('preview');

  useEffect(() => {
    setEditableContent(content);
  }, [content]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(editableContent);
      message.success('已复制到剪贴板');
      onClose();
    } catch (err) {
      message.error('复制失败，请手动复制');
    }
  };

  const handleCopyWithThinking = async () => {
    try {
      const fullContent = markdownToXiaohongshu(originalMarkdown, false);
      await navigator.clipboard.writeText(fullContent);
      message.success('已复制完整内容到剪贴板');
      onClose();
    } catch (err) {
      message.error('复制失败，请手动复制');
    }
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setEditableContent(newContent);
    onContentChange?.(newContent);
  };

  const handleSave = () => {
    onContentChange?.(editableContent);
    setActiveTab('preview');
    message.success('内容已更新');
  };

  return (
    <Modal
      title="小红书文案预览"
      open={visible}
      onCancel={onClose}
      width={800}
      footer={
        <Space>
          <Button onClick={onClose}>关闭</Button>
          <Button 
            type="primary" 
            icon={<CopyOutlined />} 
            onClick={handleCopy}
          >
            复制并关闭
          </Button>
          <Button 
            icon={<FileTextOutlined />}
            onClick={handleCopyWithThinking}
          >
            复制完整内容
          </Button>
        </Space>
      }
    >
      <Tabs 
        activeKey={activeTab} 
        onChange={setActiveTab}
        items={[
          {
            key: 'preview',
            label: (
              <span>
                <EyeOutlined />
                预览
              </span>
            ),
            children: (
              <PreviewContent>
                {editableContent}
              </PreviewContent>
            ),
          },
          {
            key: 'edit',
            label: (
              <span>
                <EditOutlined />
                编辑
              </span>
            ),
            children: (
              <div>
                <StyledTextArea
                  value={editableContent}
                  onChange={handleContentChange}
                  placeholder="编辑文案内容..."
                />
                <div style={{ marginTop: 16, textAlign: 'right' }}>
                  <Button type="primary" onClick={handleSave}>
                    保存修改
                  </Button>
                </div>
              </div>
            ),
          },
        ]}
      />
    </Modal>
  );
}; 