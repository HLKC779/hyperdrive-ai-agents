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
  Wrench
} from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'agent';
  content: string;
  timestamp: Date;
  agentId?: string;
  agentName?: string;
  category?: 'general' | 'technical' | 'code' | 'research';
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
      content: 'Hello! I\'m your AI assistant. I can help you with technical problems, code issues, research, and general questions. What can I help you with today?',
      timestamp: new Date(),
      agentId: 'agent-001',
      agentName: 'Support Agent',
      category: 'general'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

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

  const determineCategory = (query: string): Message['category'] => {
    const lowerQuery = query.toLowerCase();
    if (lowerQuery.includes('code') || lowerQuery.includes('programming')) return 'code';
    if (lowerQuery.includes('error') || lowerQuery.includes('bug') || lowerQuery.includes('fix')) return 'technical';
    if (lowerQuery.includes('research') || lowerQuery.includes('find') || lowerQuery.includes('search')) return 'research';
    return 'general';
  };

  const generateResponse = (query: string, agent: any): string => {
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
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
      category: determineCategory(inputValue)
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Simulate agent processing time
    setTimeout(() => {
      const selectedAgent = getAgentForQuery(inputValue);
      const response = generateResponse(inputValue, selectedAgent);
      
      const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'agent',
        content: response,
        timestamp: new Date(),
        agentId: selectedAgent.id,
        agentName: selectedAgent.name,
        category: determineCategory(inputValue)
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
        
        <div className="border-t p-4">
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask for help with technical issues, coding problems, or general questions..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
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