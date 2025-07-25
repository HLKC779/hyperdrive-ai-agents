import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import appCover from '@/assets/app-cover.jpg';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';
import { 
  Camera, 
  Mic, 
  FileText, 
  Image, 
  Video, 
  Music,
  Upload,
  Download,
  Play,
  Pause,
  Square,
  RotateCcw,
  Settings,
  Eye,
  Ear,
  Brain,
  Zap,
  CheckCircle,
  XCircle,
  Clock,
  Activity,
  Filter,
  Search,
  Plus,
  Edit,
  Trash2,
  TrendingUp,
  FileAudio,
  Globe,
  Code
} from "lucide-react";

interface MultiModalTask {
  id: string;
  name: string;
  type: 'vision' | 'speech' | 'document' | 'video' | 'audio';
  status: 'processing' | 'completed' | 'failed' | 'queued';
  inputFile: string;
  outputData: any;
  confidence: number;
  processingTime: number;
  timestamp: string;
}

interface ProcessingModel {
  id: string;
  name: string;
  type: 'vision' | 'speech' | 'nlp' | 'multimodal';
  status: 'active' | 'loading' | 'error';
  accuracy: number;
  speed: number;
  memoryUsage: number;
  capabilities: string[];
}

const mockTasks: MultiModalTask[] = [
  {
    id: '1',
    name: 'Document OCR Processing',
    type: 'vision',
    status: 'completed',
    inputFile: 'contract_scan.pdf',
    outputData: { text: 'Extracted contract terms...', entities: ['Company A', 'Date: 2024-01-15'] },
    confidence: 94.2,
    processingTime: 2.3,
    timestamp: '5 minutes ago'
  },
  {
    id: '2',
    name: 'Meeting Audio Transcription',
    type: 'speech',
    status: 'processing',
    inputFile: 'meeting_recording.mp3',
    outputData: null,
    confidence: 0,
    processingTime: 0,
    timestamp: '2 minutes ago'
  },
  {
    id: '3',
    name: 'Image Content Analysis',
    type: 'vision',
    status: 'completed',
    inputFile: 'product_photo.jpg',
    outputData: { objects: ['laptop', 'desk', 'coffee cup'], scene: 'office workspace' },
    confidence: 87.9,
    processingTime: 1.8,
    timestamp: '10 minutes ago'
  },
  {
    id: '4',
    name: 'Video Scene Detection',
    type: 'video',
    status: 'queued',
    inputFile: 'presentation_video.mp4',
    outputData: null,
    confidence: 0,
    processingTime: 0,
    timestamp: 'Pending'
  }
];

const mockModels: ProcessingModel[] = [
  {
    id: '1',
    name: 'GPT-4 Vision',
    type: 'vision',
    status: 'active',
    accuracy: 95.8,
    speed: 2.1,
    memoryUsage: 1.2,
    capabilities: ['OCR', 'Object Detection', 'Scene Analysis', 'Chart Reading']
  },
  {
    id: '2',
    name: 'Whisper Large',
    type: 'speech',
    status: 'active',
    accuracy: 96.4,
    speed: 1.8,
    memoryUsage: 2.4,
    capabilities: ['Speech-to-Text', 'Language Detection', 'Speaker Diarization']
  },
  {
    id: '3',
    name: 'CLIP ViT-L/14',
    type: 'multimodal',
    status: 'loading',
    accuracy: 89.2,
    speed: 3.5,
    memoryUsage: 3.8,
    capabilities: ['Image-Text Matching', 'Zero-shot Classification', 'Semantic Search']
  },
  {
    id: '4',
    name: 'Document AI',
    type: 'nlp',
    status: 'active',
    accuracy: 92.1,
    speed: 1.3,
    memoryUsage: 0.8,
    capabilities: ['Document Parsing', 'Entity Extraction', 'Table Detection']
  }
];

// Mock data for analytics charts
const processingVolumeData = [
  { name: 'Jan', tasks: 45, documents: 20, images: 15, audio: 10 },
  { name: 'Feb', tasks: 52, documents: 25, images: 18, audio: 9 },
  { name: 'Mar', tasks: 48, documents: 22, images: 16, audio: 10 },
  { name: 'Apr', tasks: 61, documents: 30, images: 20, audio: 11 },
  { name: 'May', tasks: 55, documents: 28, images: 17, audio: 10 },
  { name: 'Jun', tasks: 67, documents: 32, images: 22, audio: 13 },
  { name: 'Jul', tasks: 72, documents: 35, images: 24, audio: 13 }
];

const accuracyTrendsData = [
  { name: 'Week 1', gpt4: 94.2, whisper: 96.1, claude: 92.8, clip: 89.5 },
  { name: 'Week 2', gpt4: 94.8, whisper: 96.3, claude: 93.2, clip: 90.1 },
  { name: 'Week 3', gpt4: 95.1, whisper: 96.5, claude: 93.6, clip: 90.8 },
  { name: 'Week 4', gpt4: 95.5, whisper: 96.8, claude: 94.1, clip: 91.2 },
  { name: 'Week 5', gpt4: 95.8, whisper: 97.0, claude: 94.4, clip: 91.8 },
  { name: 'Week 6', gpt4: 96.1, whisper: 97.2, claude: 94.7, clip: 92.1 }
];

const MultiModalProcessing = () => {
  const [tasks, setTasks] = useState<MultiModalTask[]>(mockTasks);
  const [models, setModels] = useState<ProcessingModel[]>(mockModels);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadType, setUploadType] = useState<string>('document');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [taskName, setTaskName] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isConfigureOpen, setIsConfigureOpen] = useState(false);
  const [selectedTaskDetails, setSelectedTaskDetails] = useState<MultiModalTask | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    confidence: [0, 100],
    dateRange: 'all',
    processingTime: [0, 10]
  });
  const [selectedModelConfig, setSelectedModelConfig] = useState<ProcessingModel | null>(null);
  const [isModelConfigOpen, setIsModelConfigOpen] = useState(false);

  const getTypeIcon = (type: MultiModalTask['type']) => {
    const icons = {
      vision: Camera,
      speech: Mic,
      document: FileText,
      video: Video,
      audio: Music
    };
    return icons[type] || FileText;
  };

  const getStatusIcon = (status: MultiModalTask['status']) => {
    switch (status) {
      case 'processing': return <Activity className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'queued': return <Clock className="h-4 w-4 text-yellow-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusVariant = (status: MultiModalTask['status']) => {
    switch (status) {
      case 'processing': return 'secondary' as const;
      case 'completed': return 'default' as const;
      case 'failed': return 'destructive' as const;
      case 'queued': return 'outline' as const;
      default: return 'outline' as const;
    }
  };

  const getModelStatusColor = (status: ProcessingModel['status']) => {
    switch (status) {
      case 'active': return 'text-green-500';
      case 'loading': return 'text-yellow-500';
      case 'error': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const filteredTasks = tasks.filter(task => {
    // Type filter
    if (selectedType !== 'all' && task.type !== selectedType) return false;
    
    // Status filter from advanced filters
    if (filters.status !== 'all' && task.status !== filters.status) return false;
    
    // Confidence filter
    if (task.confidence > 0 && (task.confidence < filters.confidence[0] || task.confidence > filters.confidence[1])) return false;
    
    // Processing time filter
    if (task.processingTime > 0 && (task.processingTime < filters.processingTime[0] || task.processingTime > filters.processingTime[1])) return false;
    
    return true;
  });

  const taskStats = {
    total: tasks.length,
    processing: tasks.filter(t => t.status === 'processing').length,
    completed: tasks.filter(t => t.status === 'completed').length,
    failed: tasks.filter(t => t.status === 'failed').length,
    queued: tasks.filter(t => t.status === 'queued').length
  };

  const activeModels = models.filter(m => m.status === 'active').length;
  const avgAccuracy = models.reduce((acc, m) => acc + m.accuracy, 0) / models.length;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleStartProcessing = async () => {
    if (!selectedFile || !taskName.trim()) {
      alert('Please select a file and enter a task name');
      return;
    }

    setIsProcessing(true);

    try {
      // Create new task
      const newTask: MultiModalTask = {
        id: Date.now().toString(),
        name: taskName,
        type: uploadType as MultiModalTask['type'],
        status: 'processing',
        inputFile: selectedFile.name,
        outputData: null,
        confidence: 0,
        processingTime: 0,
        timestamp: 'Just now'
      };

      // Add to tasks list
      setTasks(prev => [newTask, ...prev]);

      // Simulate processing
      setTimeout(() => {
        setTasks(prev => prev.map(task => 
          task.id === newTask.id 
            ? {
                ...task,
                status: 'completed' as const,
                confidence: Math.floor(Math.random() * 20) + 80,
                processingTime: Math.random() * 5 + 1,
                outputData: {
                  text: `Processed content from ${selectedFile.name}`,
                  entities: ['Sample Entity 1', 'Sample Entity 2'],
                  confidence: Math.floor(Math.random() * 20) + 80
                }
              }
            : task
        ));
      }, 3000);

      // Reset form and close dialog
      setSelectedFile(null);
      setTaskName('');
      setIsUploadOpen(false);
      
    } catch (error) {
      console.error('Processing failed:', error);
      alert('Processing failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleModelToggle = (modelId: string) => {
    setModels(prev => prev.map(model => 
      model.id === modelId 
        ? { 
            ...model, 
            status: model.status === 'active' ? 'loading' : 'active' as ProcessingModel['status']
          }
        : model
    ));
  };

  const handleViewDetails = (task: MultiModalTask) => {
    setSelectedTaskDetails(task);
    setIsDetailsOpen(true);
  };

  const handleDownloadResults = (task: MultiModalTask) => {
    if (!task.outputData) {
      alert('No results available for download');
      return;
    }

    // Create downloadable content
    const resultData = {
      taskId: task.id,
      taskName: task.name,
      inputFile: task.inputFile,
      processingType: task.type,
      processingTime: task.processingTime,
      confidence: task.confidence,
      timestamp: task.timestamp,
      results: task.outputData
    };

    // Convert to JSON and create blob
    const dataStr = JSON.stringify(resultData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    // Create download link
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${task.name.replace(/\s+/g, '_')}_results.json`;
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleModelConfigure = (model: ProcessingModel) => {
    setSelectedModelConfig(model);
    setIsModelConfigOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Cover Image */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <img 
              src={appCover} 
              alt="Generated App Cover" 
              className="max-w-md w-full h-auto rounded-lg shadow-lg"
            />
          </div>
          <p className="text-center text-muted-foreground mt-4">
            Generated App Cover Image
          </p>
        </CardContent>
      </Card>

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Multi-Modal Processing</h1>
          <p className="text-muted-foreground">
            Advanced AI processing for vision, speech, documents, and multimedia content
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
            <DialogTrigger asChild>
              <Button>
                <Upload className="h-4 w-4 mr-2" />
                Upload & Process
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload Content for Processing</DialogTitle>
                <DialogDescription>
                  Select the type of content and upload files for AI processing
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="processing-type">Processing Type</Label>
                  <select 
                    id="processing-type"
                    value={uploadType}
                    onChange={(e) => setUploadType(e.target.value)}
                    className="w-full border rounded-md px-3 py-2"
                  >
                    <option value="vision">Vision Processing</option>
                    <option value="speech">Speech Recognition</option>
                    <option value="document">Document Analysis</option>
                    <option value="video">Video Processing</option>
                    <option value="audio">Audio Analysis</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="file-upload">Upload File</Label>
                  <Input 
                    id="file-upload" 
                    type="file" 
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.mp3,.mp4,.wav"
                  />
                  {selectedFile && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Selected: {selectedFile.name}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="task-name">Task Name</Label>
                  <Input 
                    id="task-name" 
                    placeholder="Enter task description"
                    value={taskName}
                    onChange={(e) => setTaskName(e.target.value)}
                  />
                </div>
                <Button 
                  className="w-full" 
                  onClick={handleStartProcessing}
                  disabled={isProcessing || !selectedFile || !taskName.trim()}
                >
                  {isProcessing ? 'Processing...' : 'Start Processing'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog open={isConfigureOpen} onOpenChange={setIsConfigureOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Configure Models
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Configure AI Models</DialogTitle>
                <DialogDescription>
                  Manage and configure your AI processing models
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {models.map((model) => (
                    <Card key={model.id} className="relative">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="flex items-center gap-2 text-lg">
                            <Brain className="h-5 w-5" />
                            {model.name}
                          </CardTitle>
                          <Badge 
                            variant={model.status === 'active' ? 'default' : 'secondary'}
                            className="cursor-pointer"
                            onClick={() => handleModelToggle(model.id)}
                          >
                            <div className={`w-2 h-2 rounded-full mr-2 ${getModelStatusColor(model.status)}`} />
                            {model.status}
                          </Badge>
                        </div>
                        <CardDescription className="capitalize">
                          {model.type} Processing Model
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-3 gap-3 text-sm">
                          <div>
                            <p className="text-muted-foreground">Accuracy</p>
                            <p className="font-medium">{model.accuracy}%</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Speed</p>
                            <p className="font-medium">{model.speed}s</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Memory</p>
                            <p className="font-medium">{model.memoryUsage}GB</p>
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-sm text-muted-foreground mb-2">Capabilities</p>
                          <div className="flex flex-wrap gap-1">
                            {model.capabilities.slice(0, 3).map((capability, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {capability}
                              </Badge>
                            ))}
                            {model.capabilities.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{model.capabilities.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button 
                            variant={model.status === 'active' ? 'destructive' : 'default'}
                            size="sm"
                            onClick={() => handleModelToggle(model.id)}
                            className="flex-1"
                          >
                            {model.status === 'active' ? (
                              <>
                                <Pause className="h-3 w-3 mr-1" />
                                Deactivate
                              </>
                            ) : (
                              <>
                                <Play className="h-3 w-3 mr-1" />
                                Activate
                              </>
                            )}
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                <div className="flex justify-between items-center pt-4 border-t">
                  <div className="text-sm text-muted-foreground">
                    {activeModels} of {models.length} models active
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Plus className="h-3 w-3 mr-1" />
                      Add Model
                    </Button>
                    <Button size="sm" onClick={() => setIsConfigureOpen(false)}>
                      Done
                    </Button>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-primary" />
              <div>
                <p className="text-2xl font-bold">{taskStats.total}</p>
                <p className="text-sm text-muted-foreground">Total Tasks</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{taskStats.processing}</p>
                <p className="text-sm text-muted-foreground">Processing</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{taskStats.completed}</p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Brain className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">{activeModels}</p>
                <p className="text-sm text-muted-foreground">Active Models</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">{avgAccuracy.toFixed(1)}%</p>
                <p className="text-sm text-muted-foreground">Avg Accuracy</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="tasks" className="space-y-6">
        <TabsList>
          <TabsTrigger value="tasks">Processing Tasks</TabsTrigger>
          <TabsTrigger value="models">AI Models</TabsTrigger>
          <TabsTrigger value="capabilities">Capabilities</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="tasks" className="space-y-6">
          {/* Filter Controls */}
          <div className="flex gap-4">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="border rounded-md px-3 py-2 bg-background"
            >
              <option value="all">All Types</option>
              <option value="vision">Vision</option>
              <option value="speech">Speech</option>
              <option value="document">Document</option>
              <option value="video">Video</option>
              <option value="audio">Audio</option>
            </select>
            <Dialog open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  More Filters
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Advanced Filters</DialogTitle>
                  <DialogDescription>
                    Apply advanced filters to refine your task search
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-6">
                  {/* Status Filter */}
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <select
                      value={filters.status}
                      onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                      className="w-full border rounded-md px-3 py-2 bg-background"
                    >
                      <option value="all">All Statuses</option>
                      <option value="processing">Processing</option>
                      <option value="completed">Completed</option>
                      <option value="failed">Failed</option>
                      <option value="queued">Queued</option>
                    </select>
                  </div>

                  {/* Confidence Range */}
                  <div className="space-y-3">
                    <Label>Confidence Score Range</Label>
                    <div className="px-3">
                      <Slider
                        value={filters.confidence}
                        onValueChange={(value) => setFilters(prev => ({ ...prev, confidence: value }))}
                        max={100}
                        min={0}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-muted-foreground mt-1">
                        <span>{filters.confidence[0]}%</span>
                        <span>{filters.confidence[1]}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Processing Time Range */}
                  <div className="space-y-3">
                    <Label>Processing Time Range (seconds)</Label>
                    <div className="px-3">
                      <Slider
                        value={filters.processingTime}
                        onValueChange={(value) => setFilters(prev => ({ ...prev, processingTime: value }))}
                        max={10}
                        min={0}
                        step={0.1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-muted-foreground mt-1">
                        <span>{filters.processingTime[0]}s</span>
                        <span>{filters.processingTime[1]}s</span>
                      </div>
                    </div>
                  </div>

                  {/* Date Range */}
                  <div className="space-y-2">
                    <Label>Date Range</Label>
                    <select
                      value={filters.dateRange}
                      onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
                      className="w-full border rounded-md px-3 py-2 bg-background"
                    >
                      <option value="all">All Time</option>
                      <option value="today">Today</option>
                      <option value="week">This Week</option>
                      <option value="month">This Month</option>
                      <option value="quarter">This Quarter</option>
                    </select>
                  </div>

                  {/* Active Filters Summary */}
                  <div className="border-t pt-4">
                    <p className="text-sm font-medium mb-2">Active Filters:</p>
                    <div className="flex flex-wrap gap-2">
                      {filters.status !== 'all' && (
                        <Badge variant="secondary">Status: {filters.status}</Badge>
                      )}
                      {(filters.confidence[0] > 0 || filters.confidence[1] < 100) && (
                        <Badge variant="secondary">
                          Confidence: {filters.confidence[0]}%-{filters.confidence[1]}%
                        </Badge>
                      )}
                      {(filters.processingTime[0] > 0 || filters.processingTime[1] < 10) && (
                        <Badge variant="secondary">
                          Time: {filters.processingTime[0]}s-{filters.processingTime[1]}s
                        </Badge>
                      )}
                      {filters.dateRange !== 'all' && (
                        <Badge variant="secondary">Period: {filters.dateRange}</Badge>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 justify-end pt-4 border-t">
                    <Button 
                      variant="outline" 
                      onClick={() => setFilters({
                        status: 'all',
                        confidence: [0, 100],
                        dateRange: 'all',
                        processingTime: [0, 10]
                      })}
                    >
                      Reset Filters
                    </Button>
                    <Button onClick={() => setIsFiltersOpen(false)}>
                      Apply Filters
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Tasks List */}
          <div className="space-y-4">
            {filteredTasks.map((task) => {
              const TypeIcon = getTypeIcon(task.type);
              return (
                <Card key={task.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <TypeIcon className="h-5 w-5 text-primary" />
                        <div>
                          <CardTitle className="text-lg">{task.name}</CardTitle>
                          <CardDescription>
                            Input: {task.inputFile} • {task.timestamp}
                          </CardDescription>
                        </div>
                      </div>
                      <Badge variant={getStatusVariant(task.status)}>
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(task.status)}
                          <span>{task.status}</span>
                        </div>
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Processing Time</p>
                        <p className="font-medium">
                          {task.processingTime > 0 ? `${task.processingTime}s` : 'In progress...'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Confidence</p>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">
                            {task.confidence > 0 ? `${task.confidence}%` : 'Calculating...'}
                          </p>
                          {task.confidence > 0 && (
                            <Progress value={task.confidence} className="w-16 h-2" />
                          )}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Type</p>
                        <Badge variant="outline" className="capitalize">
                          {task.type}
                        </Badge>
                      </div>
                    </div>

                    {task.outputData && (
                      <div className="border rounded-lg p-3 bg-muted/50">
                        <p className="text-sm font-medium mb-2">Output Data:</p>
                        <pre className="text-xs text-muted-foreground overflow-x-auto">
                          {JSON.stringify(task.outputData, null, 2)}
                        </pre>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleViewDetails(task)}>
                        <Eye className="h-3 w-3 mr-1" />
                        View Details
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleDownloadResults(task)}
                        disabled={!task.outputData}
                      >
                        <Download className="h-3 w-3 mr-1" />
                        Download Results
                      </Button>
                      {task.status === 'processing' && (
                        <Button variant="outline" size="sm">
                          <Square className="h-3 w-3 mr-1" />
                          Cancel
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="models" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {models.map((model) => (
              <Card key={model.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="h-5 w-5" />
                      {model.name}
                    </CardTitle>
                    <Badge variant={model.status === 'active' ? 'default' : 'secondary'}>
                      <div className={`w-2 h-2 rounded-full mr-2 ${getModelStatusColor(model.status)}`} />
                      {model.status}
                    </Badge>
                  </div>
                  <CardDescription className="capitalize">
                    {model.type} Processing Model
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Accuracy</p>
                      <p className="font-medium">{model.accuracy}%</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Speed</p>
                      <p className="font-medium">{model.speed}s</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Memory</p>
                      <p className="font-medium">{model.memoryUsage}GB</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Capabilities</p>
                    <div className="flex flex-wrap gap-1">
                      {model.capabilities.map((capability, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {capability}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Performance</span>
                      <span>{model.accuracy}%</span>
                    </div>
                    <Progress value={model.accuracy} className="h-2" />
                  </div>

                  <div className="flex gap-2">
                    {model.status === 'active' ? (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleModelToggle(model.id)}
                      >
                        <Pause className="h-3 w-3 mr-1" />
                        Pause
                      </Button>
                    ) : (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleModelToggle(model.id)}
                      >
                        <Play className="h-3 w-3 mr-1" />
                        Activate
                      </Button>
                    )}
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleModelConfigure(model)}
                    >
                      <Settings className="h-3 w-3 mr-1" />
                      Configure
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="capabilities" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="h-5 w-5" />
                  Computer Vision
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Object Detection & Recognition</li>
                  <li>• Optical Character Recognition (OCR)</li>
                  <li>• Scene Understanding</li>
                  <li>• Face Detection & Recognition</li>
                  <li>• Image Classification</li>
                  <li>• Document Structure Analysis</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mic className="h-5 w-5" />
                  Speech Processing
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Speech-to-Text Transcription</li>
                  <li>• Language Detection</li>
                  <li>• Speaker Diarization</li>
                  <li>• Emotion Recognition</li>
                  <li>• Real-time Processing</li>
                  <li>• Multi-language Support</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Document Intelligence
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Document Classification</li>
                  <li>• Entity Extraction</li>
                  <li>• Table & Form Processing</li>
                  <li>• Layout Analysis</li>
                  <li>• Handwriting Recognition</li>
                  <li>• Multi-format Support</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Video className="h-5 w-5" />
                  Video Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Scene Detection</li>
                  <li>• Activity Recognition</li>
                  <li>• Object Tracking</li>
                  <li>• Temporal Analysis</li>
                  <li>• Content Moderation</li>
                  <li>• Highlight Generation</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Music className="h-5 w-5" />
                  Audio Processing
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Audio Classification</li>
                  <li>• Music Analysis</li>
                  <li>• Noise Reduction</li>
                  <li>• Audio Enhancement</li>
                  <li>• Sound Event Detection</li>
                  <li>• Audio Synthesis</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Multi-Modal Fusion
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Cross-modal Understanding</li>
                  <li>• Image-Text Alignment</li>
                  <li>• Video-Audio Sync</li>
                  <li>• Contextual Analysis</li>
                  <li>• Semantic Correlation</li>
                  <li>• Unified Representations</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Processing Volume</CardTitle>
                <CardDescription>Tasks processed over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={processingVolumeData}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis 
                        dataKey="name" 
                        fontSize={12}
                        tick={{ fill: 'hsl(var(--muted-foreground))' }}
                      />
                      <YAxis 
                        fontSize={12}
                        tick={{ fill: 'hsl(var(--muted-foreground))' }}
                      />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'hsl(var(--background))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '6px'
                        }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="tasks" 
                        stroke="hsl(var(--primary))" 
                        fill="hsl(var(--primary))"
                        fillOpacity={0.3}
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Accuracy Trends</CardTitle>
                <CardDescription>Model performance over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={accuracyTrendsData}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis 
                        dataKey="name" 
                        fontSize={12}
                        tick={{ fill: 'hsl(var(--muted-foreground))' }}
                      />
                      <YAxis 
                        domain={['dataMin - 5', 'dataMax + 2']}
                        fontSize={12}
                        tick={{ fill: 'hsl(var(--muted-foreground))' }}
                      />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'hsl(var(--background))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '6px'
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="gpt4" 
                        stroke="#8884d8" 
                        strokeWidth={2}
                        name="GPT-4 Vision"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="whisper" 
                        stroke="#82ca9d" 
                        strokeWidth={2}
                        name="Whisper"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="claude" 
                        stroke="#ffc658" 
                        strokeWidth={2}
                        name="Claude"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="clip" 
                        stroke="#ff7300" 
                        strokeWidth={2}
                        name="CLIP"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Processing Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Processing Breakdown by Type</CardTitle>
              <CardDescription>Task distribution across different processing types</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={processingVolumeData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis 
                      dataKey="name" 
                      fontSize={12}
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <YAxis 
                      fontSize={12}
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'hsl(var(--background))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '6px'
                      }}
                    />
                    <Bar dataKey="documents" stackId="a" fill="#8884d8" name="Documents" />
                    <Bar dataKey="images" stackId="a" fill="#82ca9d" name="Images" />
                    <Bar dataKey="audio" stackId="a" fill="#ffc658" name="Audio" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Processing Statistics</CardTitle>
              <CardDescription>Detailed processing metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <p className="text-2xl font-bold">1,247</p>
                  <p className="text-sm text-muted-foreground">Images Processed</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <p className="text-2xl font-bold">89</p>
                  <p className="text-sm text-muted-foreground">Audio Files</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <p className="text-2xl font-bold">456</p>
                  <p className="text-sm text-muted-foreground">Documents</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <p className="text-2xl font-bold">23</p>
                  <p className="text-sm text-muted-foreground">Videos</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Task Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Task Details
            </DialogTitle>
            <DialogDescription>
              Comprehensive information about the processing task
            </DialogDescription>
          </DialogHeader>
          
          {selectedTaskDetails && (
            <div className="space-y-6">
              {/* Task Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Task Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Task Name</p>
                      <p className="font-medium">{selectedTaskDetails.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Task ID</p>
                      <p className="font-medium font-mono text-xs">{selectedTaskDetails.id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Input File</p>
                      <p className="font-medium">{selectedTaskDetails.inputFile}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Processing Type</p>
                      <Badge variant="outline" className="capitalize">
                        {selectedTaskDetails.type}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <Badge variant={getStatusVariant(selectedTaskDetails.status)}>
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(selectedTaskDetails.status)}
                          <span>{selectedTaskDetails.status}</span>
                        </div>
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Timestamp</p>
                      <p className="font-medium">{selectedTaskDetails.timestamp}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Performance Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Processing Time</p>
                      <div className="flex items-center gap-2">
                        <p className="text-2xl font-bold">
                          {selectedTaskDetails.processingTime > 0 
                            ? `${selectedTaskDetails.processingTime.toFixed(1)}s` 
                            : 'In progress...'}
                        </p>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Confidence Score</p>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <p className="text-2xl font-bold">
                            {selectedTaskDetails.confidence > 0 
                              ? `${selectedTaskDetails.confidence}%` 
                              : 'Calculating...'}
                          </p>
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        </div>
                        {selectedTaskDetails.confidence > 0 && (
                          <Progress value={selectedTaskDetails.confidence} className="w-full h-3" />
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Output Results */}
              {selectedTaskDetails.outputData && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Processing Results</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="bg-muted/50 rounded-lg p-4">
                        <p className="text-sm font-medium mb-3">Raw Output Data:</p>
                        <pre className="text-xs bg-background p-3 rounded border overflow-x-auto max-h-64">
                          {JSON.stringify(selectedTaskDetails.outputData, null, 2)}
                        </pre>
                      </div>
                      
                      {/* Formatted Results */}
                      <div className="grid grid-cols-1 gap-4">
                        {selectedTaskDetails.outputData.text && (
                          <div>
                            <p className="text-sm font-medium mb-2">Extracted Text:</p>
                            <p className="text-sm bg-muted/30 p-3 rounded border">
                              {selectedTaskDetails.outputData.text}
                            </p>
                          </div>
                        )}
                        
                        {selectedTaskDetails.outputData.entities && (
                          <div>
                            <p className="text-sm font-medium mb-2">Identified Entities:</p>
                            <div className="flex flex-wrap gap-2">
                              {selectedTaskDetails.outputData.entities.map((entity: string, index: number) => (
                                <Badge key={index} variant="secondary">
                                  {entity}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {selectedTaskDetails.outputData.objects && (
                          <div>
                            <p className="text-sm font-medium mb-2">Detected Objects:</p>
                            <div className="flex flex-wrap gap-2">
                              {selectedTaskDetails.outputData.objects.map((object: string, index: number) => (
                                <Badge key={index} variant="outline">
                                  {object}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 justify-end pt-4 border-t">
                <Button 
                  variant="outline" 
                  onClick={() => handleDownloadResults(selectedTaskDetails)}
                  disabled={!selectedTaskDetails.outputData}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Results
                </Button>
                <Button onClick={() => setIsDetailsOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Individual Model Configuration Dialog */}
      <Dialog open={isModelConfigOpen} onOpenChange={setIsModelConfigOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Configure Model: {selectedModelConfig?.name}
            </DialogTitle>
            <DialogDescription>
              Adjust model parameters and settings for optimal performance
            </DialogDescription>
          </DialogHeader>
          
          {selectedModelConfig && (
            <div className="space-y-6">
              {/* Model Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Model Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Current Status</p>
                      <Badge variant={selectedModelConfig.status === 'active' ? 'default' : 'secondary'}>
                        <div className={`w-2 h-2 rounded-full mr-2 ${getModelStatusColor(selectedModelConfig.status)}`} />
                        {selectedModelConfig.status}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Model Type</p>
                      <p className="font-medium capitalize">{selectedModelConfig.type}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant={selectedModelConfig.status === 'active' ? 'destructive' : 'default'}
                      size="sm"
                      onClick={() => {
                        handleModelToggle(selectedModelConfig.id);
                        setSelectedModelConfig(prev => prev ? {
                          ...prev,
                          status: prev.status === 'active' ? 'loading' : 'active' as ProcessingModel['status']
                        } : null);
                      }}
                    >
                      {selectedModelConfig.status === 'active' ? (
                        <>
                          <Pause className="h-3 w-3 mr-1" />
                          Deactivate Model
                        </>
                      ) : (
                        <>
                          <Play className="h-3 w-3 mr-1" />
                          Activate Model
                        </>
                      )}
                    </Button>
                    <Button variant="outline" size="sm">
                      <RotateCcw className="h-3 w-3 mr-1" />
                      Restart Model
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Performance Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Performance Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label className="text-sm">Accuracy Target</Label>
                      <div className="mt-2">
                        <p className="text-2xl font-bold">{selectedModelConfig.accuracy}%</p>
                        <Progress value={selectedModelConfig.accuracy} className="mt-1 h-2" />
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm">Speed Optimization</Label>
                      <div className="mt-2">
                        <p className="text-2xl font-bold">{selectedModelConfig.speed}s</p>
                        <p className="text-xs text-muted-foreground">Processing time per task</p>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm">Memory Usage</Label>
                      <div className="mt-2">
                        <p className="text-2xl font-bold">{selectedModelConfig.memoryUsage}GB</p>
                        <Progress value={(selectedModelConfig.memoryUsage / 5) * 100} className="mt-1 h-2" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <Label className="text-sm">Resource Allocation</Label>
                    <div className="mt-2 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>CPU Usage</span>
                        <span>65%</span>
                      </div>
                      <Progress value={65} className="h-2" />
                      <div className="flex justify-between text-sm">
                        <span>GPU Usage</span>
                        <span>45%</span>
                      </div>
                      <Progress value={45} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Capabilities */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Model Capabilities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Available Features</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedModelConfig.capabilities.map((capability, index) => (
                          <Badge key={index} variant="outline">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            {capability}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="border-t pt-3">
                      <p className="text-sm text-muted-foreground mb-2">Configuration Options</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm">Auto-scaling</Label>
                          <input type="checkbox" className="rounded" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label className="text-sm">Error Recovery</Label>
                          <input type="checkbox" className="rounded" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label className="text-sm">Load Balancing</Label>
                          <input type="checkbox" className="rounded" />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label className="text-sm">Cache Results</Label>
                          <input type="checkbox" className="rounded" defaultChecked />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex gap-3 justify-end pt-4 border-t">
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export Config
                </Button>
                <Button variant="outline">
                  Reset to Defaults
                </Button>
                <Button onClick={() => setIsModelConfigOpen(false)}>
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MultiModalProcessing;