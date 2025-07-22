import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { 
  Send, 
  Bot, 
  User, 
  Loader2,
  MessageCircle,
  Code,
  Lightbulb,
  Search,
  Wrench,
  Paperclip,
  Image as ImageIcon,
  FileText,
  File,
  X
} from 'lucide-react';

interface UploadedFile {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  preview?: string;
}

interface Message {
  id: string;
  type: 'user' | 'agent';
  content: string;
  timestamp: Date;
  agentId?: string;
  agentName?: string;
  category?: 'general' | 'technical' | 'code' | 'research';
  files?: UploadedFile[];
}

interface AgentChatProps {
  agents: Array<{
    id: string;
    name: string;
    type: string;
    status: string;
    capabilities: string[];
  }>;
}

const AgentChat = ({ agents }: AgentChatProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'agent',
      content: 'Hello! I\'m your AI assistant. I can help you with technical problems, code issues, research, and general questions. You can also upload files for me to analyze. What can I help you with today?',
      timestamp: new Date(),
      agentId: 'agent-001',
      agentName: 'Support Agent',
      category: 'general'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getAgentForQuery = (query: string): any => {
    const lowerQuery = query.toLowerCase();
    
    // Determine category and find best agent
    if (lowerQuery.includes('code') || lowerQuery.includes('programming') || lowerQuery.includes('debug')) {
      return agents.find(a => a.type === 'Development') || agents[0];
    } else if (lowerQuery.includes('research') || lowerQuery.includes('search') || lowerQuery.includes('find')) {
      return agents.find(a => a.type === 'Research') || agents[0];
    } else if (lowerQuery.includes('text') || lowerQuery.includes('language') || lowerQuery.includes('translate')) {
      return agents.find(a => a.type === 'Language') || agents[0];
    }
    
    // Default to first available agent
    return agents[0];
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'technical': return <Wrench className="h-3 w-3" />;
      case 'code': return <Code className="h-3 w-3" />;
      case 'research': return <Search className="h-3 w-3" />;
      default: return <Lightbulb className="h-3 w-3" />;
    }
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return <ImageIcon className="h-4 w-4" />;
    if (fileType.includes('text') || fileType.includes('document')) return <FileText className="h-4 w-4" />;
    return <File className="h-4 w-4" />;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const fileUrl = URL.createObjectURL(file);
      const uploadedFile: UploadedFile = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        name: file.name,
        type: file.type,
        size: file.size,
        url: fileUrl,
        preview: file.type.startsWith('image/') ? fileUrl : undefined
      };
      
      setUploadedFiles(prev => [...prev, uploadedFile]);
    });

    // Clear the input
    if (event.target) {
      event.target.value = '';
    }
  };

  const removeUploadedFile = (fileId: string) => {
    setUploadedFiles(prev => {
      const file = prev.find(f => f.id === fileId);
      if (file) {
        URL.revokeObjectURL(file.url);
      }
      return prev.filter(f => f.id !== fileId);
    });
  };

  const generateFileResponse = (files: UploadedFile[], query: string): string => {
    const hasImages = files.some(f => f.type.startsWith('image/'));
    const hasDocuments = files.some(f => f.type.includes('text') || f.type.includes('document'));
    const hasCode = files.some(f => f.name.includes('.js') || f.name.includes('.ts') || f.name.includes('.py') || f.name.includes('.css') || f.name.includes('.html'));

    let response = "I've analyzed your uploaded files. Here's what I can help you with:\n\n";

    if (hasImages) {
      response += "📸 **Images**: I can help you with:\n";
      response += "• Image analysis and description\n";
      response += "• Identifying objects, text, or issues in images\n";
      response += "• Suggesting improvements or modifications\n";
      response += "• Converting formats or optimizing for web use\n\n";
    }

    if (hasDocuments) {
      response += "📄 **Documents**: I can assist with:\n";
      response += "• Reviewing and analyzing document content\n";
      response += "• Suggesting improvements or edits\n";
      response += "• Answering questions about the content\n";
      response += "• Formatting and structure recommendations\n\n";
    }

    if (hasCode) {
      response += "💻 **Code Files**: I can help with:\n";
      response += "• Code review and optimization\n";
      response += "• Bug identification and fixes\n";
      response += "• Best practices and improvements\n";
      response += "• Testing and documentation suggestions\n\n";
    }

    response += `**Files uploaded** (${files.length}):\n`;
    files.forEach(file => {
      response += `• ${file.name} (${formatFileSize(file.size)})\n`;
    });

    response += "\nWhat specific aspect would you like me to focus on?";
    return response;
  };

  const determineCategory = (query: string): Message['category'] => {
    const lowerQuery = query.toLowerCase();
    if (lowerQuery.includes('code') || lowerQuery.includes('programming')) return 'code';
    if (lowerQuery.includes('error') || lowerQuery.includes('bug') || lowerQuery.includes('fix')) return 'technical';
    if (lowerQuery.includes('research') || lowerQuery.includes('find') || lowerQuery.includes('search')) return 'research';
    return 'general';
  };

  const generateResponse = (query: string, agent: any, files?: UploadedFile[]): string => {
    // If files are uploaded, prioritize file analysis
    if (files && files.length > 0) {
      return generateFileResponse(files, query);
    }

    const category = determineCategory(query);
    const lowerQuery = query.toLowerCase();

    // Technical support responses
    if (category === 'technical') {
      if (lowerQuery.includes('error') || lowerQuery.includes('bug')) {
        return `I can help you troubleshoot that issue. Based on my analysis, here are some common solutions:

1. **Check the console** - Look for any error messages in the browser console (F12)
2. **Verify dependencies** - Ensure all required packages are installed and up to date
3. **Clear cache** - Try clearing your browser cache or restarting your development server
4. **Check network requests** - Verify that API calls are working correctly

Could you provide more details about the specific error message you're seeing?`;
      }
      
      if (lowerQuery.includes('performance') || lowerQuery.includes('slow')) {
        return `Performance issues can have several causes. Let me help you optimize:

1. **Bundle size** - Check if your JavaScript bundles are too large
2. **Image optimization** - Ensure images are properly compressed and sized
3. **Code splitting** - Implement lazy loading for better performance
4. **Caching** - Verify proper caching strategies are in place

Would you like me to analyze any specific performance metrics?`;
      }
    }

    // Code-related responses
    if (category === 'code') {
      if (lowerQuery.includes('react') || lowerQuery.includes('component')) {
        return `I can help you with React development! Here are some best practices:

1. **Component structure** - Keep components small and focused
2. **State management** - Use appropriate state management (useState, useReducer, context)
3. **Performance** - Implement useMemo and useCallback when needed
4. **Testing** - Write tests for your components

What specific React issue are you working on?`;
      }
      
      if (lowerQuery.includes('api') || lowerQuery.includes('fetch')) {
        return `For API integration, I recommend:

1. **Error handling** - Always implement proper try-catch blocks
2. **Loading states** - Show loading indicators during API calls
3. **Type safety** - Use TypeScript interfaces for API responses
4. **Caching** - Consider using React Query or SWR for better data management

What type of API are you working with?`;
      }
    }

    // Research responses
    if (category === 'research') {
      return `I can help you research that topic. Based on my capabilities, I can:

1. **Search documentation** - Find relevant technical documentation
2. **Best practices** - Provide industry-standard approaches
3. **Code examples** - Show practical implementation examples
4. **Troubleshooting guides** - Help you find solutions to common problems

What specific information are you looking for?`;
    }

    // General responses
    return `I'm here to help! As ${agent.name}, I specialize in ${agent.capabilities.join(', ').toLowerCase()}. 

I can assist you with:
• Technical troubleshooting
• Code review and optimization
• Research and documentation
• Best practices and recommendations

Please let me know what specific issue you're facing, and I'll provide detailed assistance.`;
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() && uploadedFiles.length === 0) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue || 'Uploaded files for analysis',
      timestamp: new Date(),
      category: determineCategory(inputValue),
      files: uploadedFiles.length > 0 ? [...uploadedFiles] : undefined
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setUploadedFiles([]); // Clear uploaded files after sending
    setIsLoading(true);

    // Simulate agent processing time
    setTimeout(() => {
      const selectedAgent = getAgentForQuery(inputValue || 'file analysis');
      const response = generateResponse(inputValue || 'file analysis', selectedAgent, userMessage.files);
      
      const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'agent',
        content: response,
        timestamp: new Date(),
        agentId: selectedAgent.id,
        agentName: selectedAgent.name,
        category: determineCategory(inputValue || 'general')
      };

      setMessages(prev => [...prev, agentMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          Agent Support Chat
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col flex-1 p-0">
        <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                  <div
                    className={`rounded-lg p-3 ${
                      message.type === 'user'
                        ? 'bg-primary text-primary-foreground ml-auto'
                        : 'bg-muted'
                    }`}
                  >
                    {message.type === 'agent' && (
                      <div className="flex items-center gap-2 mb-2 text-sm">
                        <Bot className="h-4 w-4" />
                        <span className="font-medium">{message.agentName}</span>
                        {message.category && (
                          <Badge variant="outline" className="text-xs">
                            {getCategoryIcon(message.category)}
                            <span className="ml-1">{message.category}</span>
                          </Badge>
                        )}
                      </div>
                    )}
                    <div className="whitespace-pre-wrap">{message.content}</div>
                    
                    {/* Display uploaded files */}
                    {message.files && message.files.length > 0 && (
                      <div className="mt-3 space-y-2">
                        <div className="text-xs font-medium opacity-70">Uploaded files:</div>
                        <div className="grid grid-cols-1 gap-2">
                          {message.files.map((file) => (
                            <div key={file.id} className="flex items-center gap-2 p-2 bg-background/50 rounded border">
                              {getFileIcon(file.type)}
                              <div className="flex-1 min-w-0">
                                <div className="text-xs font-medium truncate">{file.name}</div>
                                <div className="text-xs opacity-70">{formatFileSize(file.size)}</div>
                              </div>
                              {file.preview && (
                                <img src={file.preview} alt={file.name} className="w-8 h-8 object-cover rounded" />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className={`text-xs mt-2 ${
                      message.type === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                    }`}>
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
                <div className={`${message.type === 'user' ? 'order-1 mr-2' : 'order-2 ml-2'} self-end`}>
                  {message.type === 'user' ? (
                    <User className="h-6 w-6 text-muted-foreground" />
                  ) : (
                    <Bot className="h-6 w-6 text-primary" />
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[80%]">
                  <div className="bg-muted rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2 text-sm">
                      <Bot className="h-4 w-4" />
                      <span className="font-medium">Agent Processing...</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Analyzing your request...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        
        {/* File Upload Preview */}
        {uploadedFiles.length > 0 && (
          <div className="border-t p-4 bg-muted/30">
            <div className="text-sm font-medium mb-2">Files to upload:</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-32 overflow-y-auto">
              {uploadedFiles.map((file) => (
                <div key={file.id} className="flex items-center gap-2 p-2 bg-background rounded border">
                  {getFileIcon(file.type)}
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium truncate">{file.name}</div>
                    <div className="text-xs text-muted-foreground">{formatFileSize(file.size)}</div>
                  </div>
                  {file.preview && (
                    <img src={file.preview} alt={file.name} className="w-8 h-8 object-cover rounded" />
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeUploadedFile(file.id)}
                    className="h-6 w-6 p-0 hover:bg-destructive hover:text-destructive-foreground"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="border-t p-4">
          <div className="flex gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              multiple
              accept="image/*,.pdf,.doc,.docx,.txt,.js,.ts,.py,.css,.html,.json,.xml"
              className="hidden"
            />
            <Button
              onClick={triggerFileUpload}
              variant="outline"
              size="icon"
              disabled={isLoading}
              className="shrink-0"
            >
              <Paperclip className="h-4 w-4" />
            </Button>
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask for help or upload files for analysis..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button
              onClick={handleSendMessage}
              disabled={(!inputValue.trim() && uploadedFiles.length === 0) || isLoading}
              size="icon"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AgentChat;