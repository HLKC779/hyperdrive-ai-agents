import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Monitor, Chrome, Smartphone, Tablet, Play, Pause, Square, Download, Globe } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface BrowserSession {
  id: string;
  browser: string;
  device: string;
  url: string;
  status: 'running' | 'paused' | 'stopped' | 'error';
  startTime: string;
  actions: number;
  lastAction: string;
}

interface AutomationScript {
  id: string;
  name: string;
  description: string;
  steps: Array<{
    action: string;
    target: string;
    value?: string;
  }>;
  lastRun: string;
  successRate: number;
}

const activeSessions: BrowserSession[] = [
  {
    id: 'sess-1',
    browser: 'Chrome',
    device: 'Desktop',
    url: 'https://example.com',
    status: 'running',
    startTime: '2024-01-15 10:30:00',
    actions: 12,
    lastAction: 'Click button'
  },
  {
    id: 'sess-2',
    browser: 'Firefox',
    device: 'Mobile',
    url: 'https://another-site.com',
    status: 'paused',
    startTime: '2024-01-15 09:45:00',
    actions: 8,
    lastAction: 'Fill form field'
  }
];

const automationScripts: AutomationScript[] = [
  {
    id: 'script-1',
    name: 'E-commerce Product Scraper',
    description: 'Automatically extract product information from e-commerce sites',
    steps: [
      { action: 'navigate', target: 'https://example-shop.com' },
      { action: 'click', target: '.product-category' },
      { action: 'wait', target: '2000' },
      { action: 'extract', target: '.product-info' }
    ],
    lastRun: '2024-01-14',
    successRate: 94
  },
  {
    id: 'script-2',
    name: 'Form Automation',
    description: 'Fill and submit forms automatically',
    steps: [
      { action: 'navigate', target: 'https://forms.example.com' },
      { action: 'fill', target: '#email', value: 'test@example.com' },
      { action: 'fill', target: '#name', value: 'Test User' },
      { action: 'click', target: '.submit-btn' }
    ],
    lastRun: '2024-01-13',
    successRate: 87
  }
];

export default function HeadlessBrowserAutomation() {
  const [sessions, setSessions] = useState<BrowserSession[]>(activeSessions);
  const [scripts, setScripts] = useState<AutomationScript[]>(automationScripts);
  const [newUrl, setNewUrl] = useState('');
  const [selectedBrowser, setSelectedBrowser] = useState('chrome');
  const [selectedDevice, setSelectedDevice] = useState('desktop');
  const [isCreatingSession, setIsCreatingSession] = useState(false);
  const [automationProgress, setAutomationProgress] = useState(0);
  const { toast } = useToast();

  const getBrowserIcon = (browser: string) => {
    switch (browser.toLowerCase()) {
      case 'chrome': return <Chrome className="h-4 w-4" />;
      case 'firefox': return <Globe className="h-4 w-4" />;
      case 'safari': return <Globe className="h-4 w-4" />;
      default: return <Monitor className="h-4 w-4" />;
    }
  };

  const getDeviceIcon = (device: string) => {
    switch (device.toLowerCase()) {
      case 'mobile': return <Smartphone className="h-4 w-4" />;
      case 'tablet': return <Tablet className="h-4 w-4" />;
      default: return <Monitor className="h-4 w-4" />;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'running': return 'default';
      case 'paused': return 'secondary';
      case 'stopped': return 'outline';
      case 'error': return 'destructive';
      default: return 'outline';
    }
  };

  const createNewSession = async () => {
    if (!newUrl.trim()) return;

    setIsCreatingSession(true);
    try {
      // Simulate session creation
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newSession: BrowserSession = {
        id: `sess-${Date.now()}`,
        browser: selectedBrowser.charAt(0).toUpperCase() + selectedBrowser.slice(1),
        device: selectedDevice.charAt(0).toUpperCase() + selectedDevice.slice(1),
        url: newUrl,
        status: 'running',
        startTime: new Date().toLocaleString(),
        actions: 0,
        lastAction: 'Session started'
      };
      
      setSessions(prev => [...prev, newSession]);
      setNewUrl('');
      
      toast({
        title: "Session created",
        description: `New ${selectedBrowser} session started for ${newUrl}`,
      });
    } catch (error) {
      toast({
        title: "Session creation failed",
        description: "Unable to create browser session. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCreatingSession(false);
    }
  };

  const controlSession = (sessionId: string, action: 'pause' | 'resume' | 'stop') => {
    setSessions(prev => prev.map(session => {
      if (session.id === sessionId) {
        let newStatus: BrowserSession['status'];
        switch (action) {
          case 'pause':
            newStatus = 'paused';
            break;
          case 'resume':
            newStatus = 'running';
            break;
          case 'stop':
            newStatus = 'stopped';
            break;
          default:
            newStatus = session.status;
        }
        return { ...session, status: newStatus, lastAction: `Session ${action}d` };
      }
      return session;
    }));

    toast({
      title: `Session ${action}d`,
      description: `Browser session has been ${action}d successfully.`,
    });
  };

  const runScript = async (scriptId: string) => {
    const script = scripts.find(s => s.id === scriptId);
    if (!script) return;

    setAutomationProgress(0);
    
    try {
      // Simulate script execution
      for (let i = 0; i <= 100; i += 20) {
        await new Promise(resolve => setTimeout(resolve, 500));
        setAutomationProgress(i);
      }
      
      toast({
        title: "Script completed",
        description: `${script.name} executed successfully`,
      });
    } catch (error) {
      toast({
        title: "Script failed",
        description: "Automation script encountered an error.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="sessions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="sessions">Active Sessions</TabsTrigger>
          <TabsTrigger value="automation">Automation Scripts</TabsTrigger>
          <TabsTrigger value="create">Create Session</TabsTrigger>
        </TabsList>

        <TabsContent value="sessions" className="space-y-4">
          <div className="grid gap-4">
            {sessions.map((session) => (
              <Card key={session.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getBrowserIcon(session.browser)}
                      {getDeviceIcon(session.device)}
                      <div>
                        <CardTitle className="text-sm">{session.browser} - {session.device}</CardTitle>
                        <CardDescription className="text-xs">{session.url}</CardDescription>
                      </div>
                    </div>
                    <Badge variant={getStatusVariant(session.status)}>
                      {session.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-xs space-y-1">
                      <div>Started: {session.startTime}</div>
                      <div>Actions: {session.actions}</div>
                      <div>Last: {session.lastAction}</div>
                    </div>
                    <div className="flex gap-2">
                      {session.status === 'running' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => controlSession(session.id, 'pause')}
                        >
                          <Pause className="h-3 w-3" />
                        </Button>
                      )}
                      {session.status === 'paused' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => controlSession(session.id, 'resume')}
                        >
                          <Play className="h-3 w-3" />
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => controlSession(session.id, 'stop')}
                      >
                        <Square className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="automation" className="space-y-4">
          {automationProgress > 0 && automationProgress < 100 && (
            <Card className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Running automation script...</span>
                <span className="text-sm text-muted-foreground">{automationProgress}%</span>
              </div>
              <Progress value={automationProgress} className="w-full" />
            </Card>
          )}

          <div className="grid gap-4">
            {scripts.map((script) => (
              <Card key={script.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-sm">{script.name}</CardTitle>
                      <CardDescription className="text-xs">{script.description}</CardDescription>
                    </div>
                    <Badge variant="outline">
                      {script.successRate}% success
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-xs">
                      <div className="font-medium mb-1">Script Steps:</div>
                      <div className="space-y-1">
                        {script.steps.slice(0, 3).map((step, index) => (
                          <div key={index} className="flex gap-2">
                            <span className="text-muted-foreground">{index + 1}.</span>
                            <span>{step.action} {step.target}</span>
                          </div>
                        ))}
                        {script.steps.length > 3 && (
                          <div className="text-muted-foreground">
                            ... and {script.steps.length - 3} more steps
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        Last run: {script.lastRun}
                      </span>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => runScript(script.id)}
                          disabled={automationProgress > 0 && automationProgress < 100}
                        >
                          <Play className="h-3 w-3 mr-1" />
                          Run
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="create" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Create New Browser Session</CardTitle>
              <CardDescription>
                Start a new headless browser session for automation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Browser</label>
                  <select 
                    value={selectedBrowser}
                    onChange={(e) => setSelectedBrowser(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md bg-background"
                  >
                    <option value="chrome">Chrome</option>
                    <option value="firefox">Firefox</option>
                    <option value="safari">Safari</option>
                    <option value="edge">Edge</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Device Type</label>
                  <select 
                    value={selectedDevice}
                    onChange={(e) => setSelectedDevice(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md bg-background"
                  >
                    <option value="desktop">Desktop</option>
                    <option value="mobile">Mobile</option>
                    <option value="tablet">Tablet</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Target URL</label>
                <Input
                  placeholder="https://example.com"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                />
              </div>
              <Button 
                onClick={createNewSession}
                disabled={isCreatingSession || !newUrl.trim()}
                className="w-full"
              >
                {isCreatingSession ? (
                  <>
                    <Play className="h-4 w-4 mr-2 animate-spin" />
                    Creating Session...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Create Session
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}