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

  const generateResponse = (query: string, agent: any, files?: UploadedFile[]): string => {
    // If files are uploaded, prioritize file analysis
    if (files && files.length > 0) {
      return generateFileResponse(files, query);
    }

    const category = determineCategory(query);
    const lowerQuery = query.toLowerCase();

    // Check for specific keywords and provide varied responses
    if (lowerQuery.includes('help') || lowerQuery.includes('assist')) {
      const helpResponses = [
        `I'm ready to help you! What specific challenge are you facing today? I can assist with technical issues, code problems, research questions, or general guidance.`,
        `How can I assist you? Whether it's debugging code, solving technical problems, or providing recommendations - I'm here to help!`,
        `I'm here to support you! Tell me more about what you're working on and I'll provide targeted assistance.`
      ];
      return helpResponses[Math.floor(Math.random() * helpResponses.length)];
    }

    if (lowerQuery.includes('best practices') || lowerQuery.includes('recommendations')) {
      return `Here are some general best practices I recommend:

**Development:**
• Follow consistent coding standards and naming conventions
• Implement proper error handling and logging
• Write tests for critical functionality
• Use version control with meaningful commit messages

**Performance:**
• Optimize images and assets
• Implement lazy loading where appropriate
• Monitor and profile performance regularly
• Use caching strategies effectively

**Security:**
• Validate all user inputs
• Use HTTPS and secure authentication
• Keep dependencies updated
• Follow the principle of least privilege

What specific area would you like me to dive deeper into?`;
    }

    // Technical support responses
    if (category === 'technical') {
      if (lowerQuery.includes('error') || lowerQuery.includes('bug') || lowerQuery.includes('issue')) {
        return `Let me help you troubleshoot that issue. To provide the best assistance, please share:

1. **Error details** - What specific error message are you seeing?
2. **Context** - When does this happen? (on page load, user interaction, etc.)
3. **Browser console** - Any JavaScript errors or warnings?
4. **Steps to reproduce** - How can I recreate the issue?

Common solutions I can help with:
• Debugging JavaScript/React errors
• Fixing CSS layout issues
• Resolving API integration problems
• Performance optimization`;
      }
      
      if (lowerQuery.includes('performance') || lowerQuery.includes('slow') || lowerQuery.includes('optimization')) {
        return `Performance optimization is crucial! Let me help you identify bottlenecks:

**Quick wins:**
• Compress and optimize images
• Minimize JavaScript bundles
• Enable browser caching
• Use a CDN for static assets

**Advanced optimizations:**
• Implement code splitting
• Use React.memo() for expensive components
• Optimize database queries
• Add performance monitoring

What specific performance issues are you experiencing?`;
      }
    }

    // Code-related responses
    if (category === 'code') {
      if (lowerQuery.includes('react') || lowerQuery.includes('component')) {
        return `I'd be happy to help with React development! Here's how I can assist:

**Component best practices:**
• Keep components small and focused
• Use proper prop types or TypeScript
• Implement proper state management
• Follow React hooks rules

**Common patterns I can help with:**
• Custom hooks creation
• Context API usage
• Performance optimization
• Testing strategies

What specific React challenge are you working on?`;
      }
      
      if (lowerQuery.includes('api') || lowerQuery.includes('fetch') || lowerQuery.includes('backend')) {
        return `API integration support! I can help you with:

**Frontend API calls:**
• Setting up fetch requests with proper error handling
• Managing loading states and user feedback
• Implementing authentication flows
• Data validation and transformation

**Backend considerations:**
• RESTful API design principles
• Database query optimization
• Caching strategies
• Security best practices

What type of API integration are you working on?`;
      }
    }

    // Research responses
    if (category === 'research') {
      return `I can help you research and find information! My capabilities include:

**Technical research:**
• Finding documentation and tutorials
• Comparing different solutions and technologies
• Identifying best practices and patterns
• Troubleshooting guides and solutions

**Areas I can research:**
• JavaScript frameworks and libraries
• Development tools and workflows
• Performance optimization techniques
• Security implementation guides

What specific topic would you like me to research for you?`;
    }

    // Default varied responses based on agent type
    const responses = [
      `Hello! I'm ${agent.name}, and I'm here to help you succeed. What specific challenge can I assist you with today?`,
      `Hi there! As ${agent.name}, I specialize in ${agent.capabilities.slice(0, 2).join(' and ').toLowerCase()}. What would you like to work on?`,
      `Great to meet you! I'm ${agent.name} and I'm ready to help. Whether you need technical guidance, code assistance, or problem-solving support - just let me know what you're working on!`,
      `Welcome! I'm ${agent.name}, your dedicated assistant. I can help with technical issues, development questions, research, and much more. What brings you here today?`
    ];

    return responses[Math.floor(Math.random() * responses.length)];
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
      
      // Auto-speak agent responses (optional - you can remove this if not wanted)
      if (response.length < 500) { // Only speak shorter responses
        speakText(response);
      }
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