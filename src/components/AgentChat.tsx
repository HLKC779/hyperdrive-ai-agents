import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useVoiceChat } from '@/hooks/useVoiceChat';
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
  X,
  Mic,
  MicOff,
  Volume2,
  VolumeX
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
      content: 'Hello! I\'m your AI assistant. I can help you with technical problems, code issues, research, and general questions. You can also upload files for me to analyze or use voice commands. What can I help you with today?',
      timestamp: new Date(),
      agentId: 'agent-001',
      agentName: 'Support Agent',
      category: 'general'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [conversationContext, setConversationContext] = useState<string[]>([]);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Voice chat functionality
  const {
    isRecording,
    isProcessing,
    isPlaying,
    startRecording,
    stopRecording,
    speakText,
    stopPlaying,
  } = useVoiceChat({
    onTranscriptionComplete: (text) => {
      setInputValue(text);
    }
  });

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

  const generateResponse = (query: string, agent: any, files?: UploadedFile[], context?: string[]): string => {
    // If files are uploaded, prioritize file analysis
    if (files && files.length > 0) {
      return generateFileResponse(files, query);
    }

    const category = determineCategory(query);
    const lowerQuery = query.toLowerCase();
    const recentContext = context?.slice(-3) || []; // Last 3 user messages for context

    // Check if user is asking for follow-up or clarification
    if (lowerQuery.includes('what about') || lowerQuery.includes('how about') || lowerQuery.includes('tell me more')) {
      if (recentContext.some(msg => msg.includes('performance') || msg.includes('optimization'))) {
        return `Let me dive deeper into performance optimization techniques:

**Frontend Performance:**
• Use React.memo() for components that don't need frequent re-renders
• Implement virtual scrolling for large lists
• Optimize bundle size with tree shaking and code splitting
• Minimize CSS and use CSS-in-JS efficiently

**Backend Performance:**
• Database indexing and query optimization
• Implement caching layers (Redis, CDN)
• Use compression for API responses
• Monitor and profile server performance

**Monitoring Tools:**
• Lighthouse for web performance audits
• React DevTools Profiler
• Chrome DevTools Performance tab
• Real User Monitoring (RUM) tools

What specific performance area interests you most?`;
      }
    }

    // Context-aware responses for repeated topics
    if (recentContext.length > 0) {
      const hasRepeatedTopic = recentContext.some(msg => 
        (msg.includes('help') && lowerQuery.includes('help')) ||
        (msg.includes('best practices') && lowerQuery.includes('best practices'))
      );
      
      if (hasRepeatedTopic) {
        return `I notice we've been discussing this topic. Let me provide a different perspective or more specific guidance:

**Since you're looking for continued assistance**, here are some next steps:
• Share your specific project details for targeted advice
• Upload relevant files or screenshots for analysis  
• Ask about particular challenges you're facing
• Request examples or code snippets for implementation

**Alternative approaches I can help with:**
• Step-by-step tutorials and walkthroughs
• Troubleshooting specific error messages
• Code reviews and optimization suggestions
• Architecture and design pattern recommendations

What specific aspect would you like to explore further?`;
      }
    }

    // Enhanced keyword responses
    if (lowerQuery.includes('optimize') || lowerQuery.includes('images') || lowerQuery.includes('assets')) {
      return `Let me help you optimize images and assets! Here's a comprehensive approach:

**Image Optimization:**
• **Format selection**: Use WebP for photos, SVG for icons, PNG for transparency
• **Compression**: Tools like TinyPNG, ImageOptim, or Squoosh
• **Responsive images**: Use srcset and sizes attributes
• **Lazy loading**: Implement intersection observer or native loading="lazy"

**Asset Optimization:**
• **CSS**: Minify, remove unused styles, use critical CSS
• **JavaScript**: Bundle splitting, tree shaking, minification
• **Fonts**: Use font-display: swap, preload critical fonts
• **CDN**: Distribute assets globally for faster loading

**Implementation tools:**
• Webpack optimization plugins
• Vite build optimizations  
• Next.js automatic optimizations
• Cloudinary or similar image services

What type of assets are you primarily working with?`;
    }

    // Dynamic help responses based on context
    if (lowerQuery.includes('help') || lowerQuery.includes('assist')) {
      const helpVariations = [
        `I'm here to help! Based on our conversation, I can provide targeted assistance. What specific challenge are you facing right now?`,
        `How can I support you today? Whether it's debugging, optimization, research, or implementation - I'm ready to dive in!`,
        `Let's solve this together! Tell me about the specific issue or project you're working on, and I'll provide detailed guidance.`,
        `I'm ready to assist! Share more details about what you're trying to accomplish, and I'll help you find the best approach.`
      ];
      return helpVariations[Math.floor(Math.random() * helpVariations.length)];
    }

    // Enhanced category-specific responses
    if (category === 'technical') {
      if (lowerQuery.includes('error') || lowerQuery.includes('bug') || lowerQuery.includes('issue')) {
        return `Let me help you debug this issue systematically:

**Debugging Process:**
1. **Identify the error**: What exactly is happening vs. what you expect?
2. **Reproduce consistently**: Can you make it happen again?
3. **Check the basics**: Console errors, network requests, component state
4. **Isolate the problem**: Test individual components or functions

**Common debugging tools:**
• Browser DevTools (Console, Network, Elements tabs)
• React DevTools for component inspection
• Debugger statements and breakpoints
• Console.log strategically placed

**Next steps:**
• Share the specific error message
• Describe when it occurs
• Show relevant code snippets

What error are you encountering?`;
      }
    }

    if (category === 'code') {
      if (lowerQuery.includes('react') || lowerQuery.includes('component')) {
        return `React development expertise at your service! Let me help you build better components:

**Modern React Patterns:**
• Functional components with hooks
• Custom hooks for reusable logic
• Context for state management
• Error boundaries for graceful failures

**Performance Best Practices:**
• Use React.memo() wisely
• Optimize re-renders with useCallback/useMemo
• Lazy load components with React.lazy()
• Implement proper key props for lists

**Development Workflow:**
• TypeScript for type safety
• ESLint and Prettier for code quality
• React Testing Library for testing
• Storybook for component development

What React challenge can I help you tackle?`;
      }
    }

    // Default responses with more variety
    const dynamicResponses = [
      `Hi! I'm ${agent.name}, your technical assistant. I'm here to help you solve problems and build better solutions. What are you working on?`,
      `Hello there! ${agent.name} here, ready to assist with ${agent.capabilities.slice(0, 2).join(', ').toLowerCase()}, and more. What can we tackle together?`,
      `Welcome! I'm ${agent.name} and I specialize in helping developers succeed. Whether you need debugging help, optimization tips, or implementation guidance - I'm here for you!`,
      `Great to connect! As ${agent.name}, I can help you with technical challenges, code reviews, research, and problem-solving. What's on your mind today?`
    ];

    return dynamicResponses[Math.floor(Math.random() * dynamicResponses.length)];
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
    setConversationContext(prev => [...prev, inputValue || 'file upload'].slice(-5)); // Keep last 5 messages
    setInputValue('');
    setUploadedFiles([]); // Clear uploaded files after sending
    setIsLoading(true);

    // Simulate agent processing time
    setTimeout(() => {
      const selectedAgent = getAgentForQuery(inputValue || 'file analysis');
      const response = generateResponse(
        inputValue || 'file analysis', 
        selectedAgent, 
        userMessage.files,
        conversationContext
      );
      
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
      
      // Auto-speak agent responses (optional - you can remove this if not wanted)
      if (response.length < 300) { // Only speak shorter responses
        speakText(response);
      }
    }, 1200); // Slightly faster response time
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
                    
                    {/* Voice controls for agent messages */}
                    {message.type === 'agent' && (
                      <div className="flex gap-2 mt-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => speakText(message.content)}
                          disabled={isPlaying}
                          className="h-6 px-2 text-xs"
                        >
                          <Volume2 className="h-3 w-3 mr-1" />
                          {isPlaying ? 'Playing...' : 'Speak'}
                        </Button>
                        {isPlaying && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={stopPlaying}
                            className="h-6 px-2 text-xs"
                          >
                            <VolumeX className="h-3 w-3 mr-1" />
                            Stop
                          </Button>
                        )}
                      </div>
                    )}
                    
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
            
            {/* Voice recording button */}
            <Button
              size="icon"
              variant={isRecording ? "destructive" : "outline"}
              onClick={isRecording ? stopRecording : startRecording}
              disabled={isProcessing || isLoading}
              className="shrink-0"
            >
              {isProcessing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : isRecording ? (
                <MicOff className="h-4 w-4" />
              ) : (
                <Mic className="h-4 w-4" />
              )}
            </Button>
            
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={isRecording ? "Recording..." : isProcessing ? "Processing speech..." : "Ask for help, upload files, or use voice..."}
              disabled={isLoading || isRecording || isProcessing}
              className="flex-1"
            />
            <Button
              onClick={handleSendMessage}
              disabled={(!inputValue.trim() && uploadedFiles.length === 0) || isLoading || isRecording || isProcessing}
              size="icon"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
          
          {/* Voice status indicator */}
          {(isRecording || isProcessing || isPlaying) && (
            <div className="mt-2 text-sm text-muted-foreground flex items-center gap-2">
              {isRecording && (
                <>
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  Recording... Click the microphone again to stop
                </>
              )}
              {isProcessing && (
                <>
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Converting speech to text...
                </>
              )}
              {isPlaying && (
                <>
                  <Volume2 className="h-3 w-3" />
                  Playing audio response...
                </>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AgentChat;