// 将Markdown转换为小红书格式的工具函数

const emojiMap = {
  h1: '📌',
  h2: '🔍',
  h3: '💡',
  list: '📝',
  code: '💻',
  quote: '💭',
};

// 移除thinking内容
const removeThinkingContent = (text: string): string => {
  // 移除<think>...</think>格式的内容
  text = text.replace(/<think>[\s\S]*?<\/think>/g, '');
  
  // 移除```thinking ... ```格式的内容
  text = text.replace(/```thinking[\s\S]*?```/g, '');
  
  // 移除以thinking:开头的行及其后续内容，直到遇到空行
  text = text.replace(/^thinking:.*$[\s\S]*?(?=\n\s*\n|$)/gm, '');
  
  // 移除多余的空行
  text = text.replace(/\n{3,}/g, '\n\n');
  
  return text.trim();
};

const convertHeadings = (text: string): string => {
  return text
    .replace(/^# (.*$)/gm, `${emojiMap.h1} $1`)
    .replace(/^## (.*$)/gm, `${emojiMap.h2} $1`)
    .replace(/^### (.*$)/gm, `${emojiMap.h3} $1`);
};

const convertLists = (text: string): string => {
  return text
    .replace(/^[\*\-] (.*$)/gm, `${emojiMap.list} $1`)
    .replace(/^\d+\. (.*$)/gm, `${emojiMap.list} $1`);
};

const convertCodeBlocks = (text: string): string => {
  // 排除thinking代码块
  return text.replace(/```(?!thinking)[\s\S]*?```/g, (match) => {
    return `${emojiMap.code} 代码片段:\n${match.slice(3, -3).trim()}`;
  });
};

const convertQuotes = (text: string): string => {
  return text.replace(/^> (.*$)/gm, `${emojiMap.quote} $1`);
};

const addSeparators = (text: string): string => {
  // 先分割成段落
  const paragraphs = text.split('\n\n').filter(p => p.trim());
  // 只在非空段落之间添加分隔符
  return paragraphs.join('\n\n- - - - - - \n\n');
};

export const markdownToXiaohongshu = (markdown: string, removeThinking: boolean = false): string => {
  let result = markdown;
  
  // 如果需要移除thinking内容
  if (removeThinking) {
    result = removeThinkingContent(result);
  }
  
  // 转换各种markdown元素
  result = convertHeadings(result);
  result = convertLists(result);
  result = convertCodeBlocks(result);
  result = convertQuotes(result);
  
  // 添加段落分隔符
  result = addSeparators(result);
  
  // 添加小红书特色的结尾标记
  result += '\n\n🌟 希望这些内容对你有帮助 🌟';
  
  return result;
}; 