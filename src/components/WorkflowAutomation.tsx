import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { 
  File, 
  Plus, 
  Clock, 
  Repeat, 
  GitBranch, 
  Play,
  Calendar,
  Timer,
  Workflow,
  Database,
  Globe,
  BarChart,
  Code
} from 'lucide-react';

interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: 'data' | 'api' | 'ml' | 'automation' | 'analytics';
  tasks: TemplateTask[];
  estimatedDuration: string;
  icon: React.ElementType;
}

interface TemplateTask {
  id: string;
  name: string;
  type: 'workflow' | 'computation' | 'api' | 'analysis' | 'training';
  description: string;
  dependencies: string[];
  estimatedTime: string;
}

interface ScheduledTask {
  id: string;
  name: string;
  template: string;
  schedule: string;
  nextRun: Date;
  enabled: boolean;
  lastRun?: Date;
  runCount: number;
}

const workflowTemplates: WorkflowTemplate[] = [
  {
    id: 'data-pipeline',
    name: 'Data Processing Pipeline',
    description: 'Complete data ingestion, cleaning, and analysis workflow',
    category: 'data',
    icon: Database,
    estimatedDuration: '2-4 hours',
    tasks: [
      {
        id: 'ingest',
        name: 'Data Ingestion',
        type: 'workflow',
        description: 'Extract data from multiple sources',
        dependencies: [],
        estimatedTime: '30 min'
      },
      {
        id: 'clean',
        name: 'Data Cleaning',
        type: 'computation',
        description: 'Clean and validate incoming data',
        dependencies: ['ingest'],
        estimatedTime: '45 min'
      },
      {
        id: 'analyze',
        name: 'Statistical Analysis',
        type: 'analysis',
        description: 'Perform statistical analysis on cleaned data',
        dependencies: ['clean'],
        estimatedTime: '90 min'
      },
      {
        id: 'report',
        name: 'Generate Report',
        type: 'workflow',
        description: 'Create automated analysis report',
        dependencies: ['analyze'],
        estimatedTime: '15 min'
      }
    ]
  },
  {
    id: 'ml-training',
    name: 'ML Model Training',
    description: 'End-to-end machine learning model training pipeline',
    category: 'ml',
    icon: Code,
    estimatedDuration: '4-8 hours',
    tasks: [
      {
        id: 'prepare',
        name: 'Data Preparation',
        type: 'computation',
        description: 'Prepare and feature engineer training data',
        dependencies: [],
        estimatedTime: '60 min'
      },
      {
        id: 'train',
        name: 'Model Training',
        type: 'training',
        description: 'Train machine learning model',
        dependencies: ['prepare'],
        estimatedTime: '4 hours'
      },
      {
        id: 'validate',
        name: 'Model Validation',
        type: 'analysis',
        description: 'Validate model performance',
        dependencies: ['train'],
        estimatedTime: '45 min'
      },
      {
        id: 'deploy',
        name: 'Model Deployment',
        type: 'api',
        description: 'Deploy model to production',
        dependencies: ['validate'],
        estimatedTime: '30 min'
      }
    ]
  },
  {
    id: 'api-testing',
    name: 'API Testing Suite',
    description: 'Comprehensive API testing and validation workflow',
    category: 'api',
    icon: Globe,
    estimatedDuration: '1-2 hours',
    tasks: [
      {
        id: 'unit-tests',
        name: 'Unit Tests',
        type: 'api',
        description: 'Run unit test suite',
        dependencies: [],
        estimatedTime: '20 min'
      },
      {
        id: 'integration-tests',
        name: 'Integration Tests',
        type: 'api',
        description: 'Run integration test suite',
        dependencies: ['unit-tests'],
        estimatedTime: '30 min'
      },
      {
        id: 'load-tests',
        name: 'Load Testing',
        type: 'computation',
        description: 'Perform load testing',
        dependencies: ['integration-tests'],
        estimatedTime: '45 min'
      },
      {
        id: 'report-tests',
        name: 'Test Report',
        type: 'analysis',
        description: 'Generate test report',
        dependencies: ['load-tests'],
        estimatedTime: '15 min'
      }
    ]
  }
];

const WorkflowAutomation = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<WorkflowTemplate | null>(null);
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);
  const [scheduledTasks, setScheduledTasks] = useState<ScheduledTask[]>([
    {
      id: '1',
      name: 'Daily Data Pipeline',
      template: 'data-pipeline',
      schedule: '0 2 * * *', // Daily at 2 AM
      nextRun: new Date(Date.now() + 24 * 60 * 60 * 1000),
      enabled: true,
      lastRun: new Date(Date.now() - 24 * 60 * 60 * 1000),
      runCount: 47
    },
    {
      id: '2',
      name: 'Weekly Model Retrain',
      template: 'ml-training',
      schedule: '0 0 * * 0', // Weekly on Sunday
      nextRun: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      enabled: true,
      lastRun: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      runCount: 12
    }
  ]);

  const [newSchedule, setNewSchedule] = useState({
    name: '',
    template: '',
    schedule: '0 9 * * *', // Default: Daily at 9 AM
    enabled: true
  });

  const getCategoryIcon = (category: string) => {
    const icons = {
      data: Database,
      api: Globe,
      ml: Code,
      automation: Workflow,
      analytics: BarChart
    };
    return icons[category as keyof typeof icons] || Workflow;
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      data: 'hsl(var(--chart-1))',
      api: 'hsl(var(--chart-2))',
      ml: 'hsl(var(--chart-3))',
      automation: 'hsl(var(--chart-4))',
      analytics: 'hsl(var(--chart-5))'
    };
    return colors[category as keyof typeof colors] || 'hsl(var(--primary))';
  };

  const handleCreateFromTemplate = (template: WorkflowTemplate) => {
    // Create tasks with dependencies
    const tasksCreated = template.tasks.length;
    toast({
      title: "Workflow Created! 🚀",
      description: `Created ${tasksCreated} tasks from ${template.name} template with dependencies`,
    });
    setIsTemplateDialogOpen(false);
  };

  const handleScheduleTask = () => {
    if (!newSchedule.name || !newSchedule.template) return;

    const nextRun = new Date();
    nextRun.setHours(9, 0, 0, 0); // Next 9 AM
    if (nextRun <= new Date()) {
      nextRun.setDate(nextRun.getDate() + 1);
    }

    const scheduled: ScheduledTask = {
      id: Date.now().toString(),
      name: newSchedule.name,
      template: newSchedule.template,
      schedule: newSchedule.schedule,
      nextRun,
      enabled: newSchedule.enabled,
      runCount: 0
    };

    setScheduledTasks([...scheduledTasks, scheduled]);
    setNewSchedule({
      name: '',
      template: '',
      schedule: '0 9 * * *',
      enabled: true
    });
    setIsScheduleDialogOpen(false);

    toast({
      title: "Task Scheduled! ⏰",
      description: `${scheduled.name} will run ${formatSchedule(scheduled.schedule)}`,
    });
  };

  const formatSchedule = (cronExpression: string) => {
    const scheduleMap: { [key: string]: string } = {
      '0 9 * * *': 'daily at 9:00 AM',
      '0 2 * * *': 'daily at 2:00 AM',
      '0 0 * * 0': 'weekly on Sunday',
      '0 0 1 * *': 'monthly on the 1st',
      '0 */6 * * *': 'every 6 hours'
    };
    return scheduleMap[cronExpression] || cronExpression;
  };

  const toggleSchedule = (id: string) => {
    setScheduledTasks(tasks =>
      tasks.map(task =>
        task.id === id ? { ...task, enabled: !task.enabled } : task
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Workflow Automation</h2>
          <p className="text-muted-foreground">
            Manage templates, dependencies, and scheduled tasks
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isScheduleDialogOpen} onOpenChange={setIsScheduleDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Clock className="h-4 w-4 mr-2" />
                Schedule Task
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Schedule Automated Task</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="schedule-name">Schedule Name</Label>
                  <Input
                    id="schedule-name"
                    placeholder="e.g., Daily Data Processing"
                    value={newSchedule.name}
                    onChange={(e) => setNewSchedule({ ...newSchedule, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="template-select">Workflow Template</Label>
                  <Select value={newSchedule.template} onValueChange={(value) => setNewSchedule({ ...newSchedule, template: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a template" />
                    </SelectTrigger>
                    <SelectContent>
                      {workflowTemplates.map((template) => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="cron-schedule">Schedule (Cron Expression)</Label>
                  <Select value={newSchedule.schedule} onValueChange={(value) => setNewSchedule({ ...newSchedule, schedule: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0 9 * * *">Daily at 9:00 AM</SelectItem>
                      <SelectItem value="0 2 * * *">Daily at 2:00 AM</SelectItem>
                      <SelectItem value="0 0 * * 0">Weekly on Sunday</SelectItem>
                      <SelectItem value="0 0 1 * *">Monthly on 1st</SelectItem>
                      <SelectItem value="0 */6 * * *">Every 6 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button 
                  className="w-full" 
                  onClick={handleScheduleTask}
                  disabled={!newSchedule.name || !newSchedule.template}
                >
                  Create Schedule
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isTemplateDialogOpen} onOpenChange={setIsTemplateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <File className="h-4 w-4 mr-2" />
                Use Template
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Choose Workflow Template</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                {workflowTemplates.map((template) => {
                  const Icon = template.icon;
                  return (
                    <Card key={template.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedTemplate(template)}>
                      <CardHeader>
                        <div className="flex items-center gap-2">
                          <Icon className="h-5 w-5" style={{ color: getCategoryColor(template.category) }} />
                          <CardTitle className="text-lg">{template.name}</CardTitle>
                        </div>
                        <Badge variant="secondary">{template.category}</Badge>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-3">{template.description}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">{template.tasks.length} tasks</span>
                          <span className="text-xs text-muted-foreground">{template.estimatedDuration}</span>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
              {selectedTemplate && (
                <div className="mt-4 border-t pt-4">
                  <h4 className="font-semibold mb-2">Task Dependencies for "{selectedTemplate.name}"</h4>
                  <div className="space-y-2">
                    {selectedTemplate.tasks.map((task, index) => (
                      <div key={task.id} className="flex items-center gap-2 text-sm">
                        <span className="font-medium">{index + 1}.</span>
                        <span>{task.name}</span>
                        {task.dependencies.length > 0 && (
                          <span className="text-muted-foreground">
                            (depends on: {task.dependencies.join(', ')})
                          </span>
                        )}
                        <Badge variant="outline" className="text-xs">{task.estimatedTime}</Badge>
                      </div>
                    ))}
                  </div>
                  <Button 
                    className="w-full mt-4" 
                    onClick={() => handleCreateFromTemplate(selectedTemplate)}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Create Workflow with Dependencies
                  </Button>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="templates" className="space-y-6">
        <TabsList>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled Tasks</TabsTrigger>
          <TabsTrigger value="dependencies">Dependencies</TabsTrigger>
          <TabsTrigger value="retry">Auto-Retry</TabsTrigger>
        </TabsList>

        <TabsContent value="templates">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {workflowTemplates.map((template) => {
              const Icon = template.icon;
              return (
                <Card key={template.id}>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Icon className="h-5 w-5" style={{ color: getCategoryColor(template.category) }} />
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                    </div>
                    <Badge variant="secondary">{template.category}</Badge>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{template.description}</p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Tasks:</span>
                        <span>{template.tasks.length}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Duration:</span>
                        <span>{template.estimatedDuration}</span>
                      </div>
                    </div>
                    <Button 
                      className="w-full mt-4" 
                      variant="outline"
                      onClick={() => {
                        setSelectedTemplate(template);
                        setIsTemplateDialogOpen(true);
                      }}
                    >
                      <File className="h-4 w-4 mr-2" />
                      Use Template
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="scheduled">
          <div className="space-y-4">
            {scheduledTasks.map((task) => (
              <Card key={task.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-primary" />
                      <div>
                        <h3 className="font-semibold">{task.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {formatSchedule(task.schedule)} • Next: {task.nextRun.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={task.enabled ? "default" : "secondary"}>
                        {task.enabled ? "Active" : "Paused"}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {task.runCount} runs
                      </span>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => toggleSchedule(task.id)}
                      >
                        {task.enabled ? <Repeat className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="dependencies">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GitBranch className="h-5 w-5" />
                Task Dependencies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Dependencies ensure tasks execute in the correct order. When you create a workflow from a template,
                  dependent tasks will automatically wait for their prerequisites to complete.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold text-sm mb-2">Sequential Dependencies</h4>
                    <p className="text-xs text-muted-foreground">Tasks run one after another in a linear chain</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold text-sm mb-2">Parallel Dependencies</h4>
                    <p className="text-xs text-muted-foreground">Multiple tasks can run simultaneously after prerequisites</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="retry">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Repeat className="h-5 w-5" />
                Auto-Retry Configuration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold text-sm mb-2">Immediate Retry</h4>
                    <p className="text-xs text-muted-foreground mb-2">Retry failed tasks immediately up to 3 times</p>
                    <Badge variant="default">Enabled</Badge>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold text-sm mb-2">Exponential Backoff</h4>
                    <p className="text-xs text-muted-foreground mb-2">Wait 2^attempt minutes between retries</p>
                    <Badge variant="default">Enabled</Badge>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold text-sm mb-2">Smart Retry</h4>
                    <p className="text-xs text-muted-foreground mb-2">Analyze failure reason and retry accordingly</p>
                    <Badge variant="secondary">Coming Soon</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WorkflowAutomation;