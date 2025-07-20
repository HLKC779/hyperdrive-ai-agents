import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { 
  Download, 
  Filter, 
  Search, 
  Play, 
  Pause, 
  Square, 
  GripVertical,
  CheckSquare,
  Calendar,
  Users,
  Clock,
  FileText,
  BarChart
} from 'lucide-react';

interface Task {
  id: string;
  name: string;
  type: 'workflow' | 'computation' | 'api' | 'analysis' | 'training';
  status: 'running' | 'queued' | 'completed' | 'failed' | 'paused';
  priority: 'low' | 'medium' | 'high' | 'critical';
  progress: number;
  assignedAgent: string;
  createdDate: Date;
  estimatedTime: string;
}

const mockTasks: Task[] = [
  {
    id: '1',
    name: 'Customer Data Analysis',
    type: 'analysis',
    status: 'queued',
    priority: 'high',
    progress: 0,
    assignedAgent: 'Agent-Analytics-01',
    createdDate: new Date(2024, 0, 15),
    estimatedTime: '2 hours'
  },
  {
    id: '2',
    name: 'Model Training Pipeline',
    type: 'training',
    status: 'queued',
    priority: 'critical',
    progress: 0,
    assignedAgent: 'Agent-ML-02',
    createdDate: new Date(2024, 0, 16),
    estimatedTime: '4 hours'
  },
  {
    id: '3',
    name: 'API Integration Test',
    type: 'api',
    status: 'queued',
    priority: 'medium',
    progress: 0,
    assignedAgent: 'Agent-API-03',
    createdDate: new Date(2024, 0, 17),
    estimatedTime: '1 hour'
  },
  {
    id: '4',
    name: 'Document Processing',
    type: 'workflow',
    status: 'queued',
    priority: 'low',
    progress: 0,
    assignedAgent: 'Agent-Doc-01',
    createdDate: new Date(2024, 0, 18),
    estimatedTime: '3 hours'
  }
];

interface SortableTaskProps {
  task: Task;
  isSelected: boolean;
  onSelect: (id: string, selected: boolean) => void;
}

const SortableTask: React.FC<SortableTaskProps> = ({ task, isSelected, onSelect }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      critical: 'text-red-600',
      high: 'text-orange-600',
      medium: 'text-yellow-600',
      low: 'text-green-600'
    };
    return colors[priority as keyof typeof colors] || 'text-gray-600';
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`p-4 border rounded-lg bg-card hover:shadow-md transition-shadow ${
        isSelected ? 'border-primary bg-primary/5' : ''
      }`}
    >
      <div className="flex items-center gap-3">
        <Checkbox
          checked={isSelected}
          onCheckedChange={(checked) => onSelect(task.id, !!checked)}
        />
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab hover:cursor-grabbing"
        >
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">{task.name}</h3>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={getPriorityColor(task.priority)}>
                {task.priority}
              </Badge>
              <Badge variant="secondary">{task.type}</Badge>
            </div>
          </div>
          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
            <span>Agent: {task.assignedAgent}</span>
            <span>ETA: {task.estimatedTime}</span>
            <span>Created: {task.createdDate.toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const EnhancedUX = () => {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [selectedTasks, setSelectedTasks] = useState<Set<string>>(new Set());
  const [filters, setFilters] = useState({
    dateFrom: '',
    dateTo: '',
    agent: '',
    priority: '',
    type: '',
    status: ''
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setTasks((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over?.id);

        const reorderedTasks = arrayMove(items, oldIndex, newIndex);
        
        toast({
          title: "Queue Reordered! 🔄",
          description: `Moved "${items[oldIndex].name}" to position ${newIndex + 1}`,
        });

        return reorderedTasks;
      });
    }
  };

  const handleSelectTask = (id: string, selected: boolean) => {
    setSelectedTasks(prev => {
      const newSet = new Set(prev);
      if (selected) {
        newSet.add(id);
      } else {
        newSet.delete(id);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectedTasks.size === filteredTasks.length) {
      setSelectedTasks(new Set());
    } else {
      setSelectedTasks(new Set(filteredTasks.map(task => task.id)));
    }
  };

  const handleBulkAction = (action: 'pause' | 'resume' | 'stop') => {
    const count = selectedTasks.size;
    if (count === 0) return;

    setTasks(tasks => 
      tasks.map(task => {
        if (selectedTasks.has(task.id)) {
          switch (action) {
            case 'pause':
              return { ...task, status: 'paused' as const };
            case 'resume':
              return { ...task, status: 'running' as const };
            case 'stop':
              return { ...task, status: 'failed' as const };
            default:
              return task;
          }
        }
        return task;
      })
    );

    setSelectedTasks(new Set());
    
    toast({
      title: `Bulk Action Applied! ✅`,
      description: `${action} applied to ${count} task${count > 1 ? 's' : ''}`,
    });
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.assignedAgent.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDateFrom = !filters.dateFrom || task.createdDate >= new Date(filters.dateFrom);
    const matchesDateTo = !filters.dateTo || task.createdDate <= new Date(filters.dateTo);
    const matchesAgent = !filters.agent || task.assignedAgent.includes(filters.agent);
    const matchesPriority = !filters.priority || task.priority === filters.priority;
    const matchesType = !filters.type || task.type === filters.type;
    const matchesStatus = !filters.status || task.status === filters.status;

    return matchesSearch && matchesDateFrom && matchesDateTo && 
           matchesAgent && matchesPriority && matchesType && matchesStatus;
  });

  const uniqueAgents = [...new Set(tasks.map(task => task.assignedAgent))];

  const exportToPDF = () => {
    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(20);
    doc.text('Task Execution Report', 20, 20);
    
    // Metadata
    doc.setFontSize(12);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 35);
    doc.text(`Total Tasks: ${filteredTasks.length}`, 20, 45);
    doc.text(`Selected Tasks: ${selectedTasks.size}`, 20, 55);

    // Table data
    const tableData = filteredTasks.map(task => [
      task.name,
      task.type,
      task.status,
      task.priority,
      task.assignedAgent,
      task.createdDate.toLocaleDateString(),
      task.estimatedTime
    ]);

    // Add table
    (doc as any).autoTable({
      head: [['Task Name', 'Type', 'Status', 'Priority', 'Agent', 'Created', 'ETA']],
      body: tableData,
      startY: 70,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [41, 128, 185] }
    });

    doc.save('task-execution-report.pdf');
    setIsExportDialogOpen(false);
    
    toast({
      title: "Report Exported! 📄",
      description: "PDF report has been downloaded successfully",
    });
  };

  const exportToCSV = () => {
    const csvContent = [
      ['Task Name', 'Type', 'Status', 'Priority', 'Agent', 'Created', 'ETA'],
      ...filteredTasks.map(task => [
        task.name,
        task.type,
        task.status,
        task.priority,
        task.assignedAgent,
        task.createdDate.toLocaleDateString(),
        task.estimatedTime
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'task-execution-report.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    
    setIsExportDialogOpen(false);
    
    toast({
      title: "Report Exported! 📊",
      description: "CSV report has been downloaded successfully",
    });
  };

  const clearFilters = () => {
    setFilters({
      dateFrom: '',
      dateTo: '',
      agent: '',
      priority: '',
      type: '',
      status: ''
    });
    setSearchQuery('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Enhanced Task Management</h2>
          <p className="text-muted-foreground">
            Drag & drop, bulk operations, advanced filtering, and reporting
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Export Report</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Export current view with {filteredTasks.length} tasks to your preferred format
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <Button onClick={exportToPDF} className="h-20 flex flex-col">
                    <FileText className="h-6 w-6 mb-2" />
                    Export as PDF
                  </Button>
                  <Button onClick={exportToCSV} variant="outline" className="h-20 flex flex-col">
                    <BarChart className="h-6 w-6 mb-2" />
                    Export as CSV
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="queue" className="space-y-6">
        <TabsList>
          <TabsTrigger value="queue">Task Queue</TabsTrigger>
          <TabsTrigger value="bulk">Bulk Operations</TabsTrigger>
          <TabsTrigger value="filters">Advanced Filters</TabsTrigger>
        </TabsList>

        <TabsContent value="queue">
          {/* Search and Quick Actions */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Search tasks or agents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <Button
              variant="outline"
              onClick={handleSelectAll}
            >
              <CheckSquare className="h-4 w-4 mr-2" />
              {selectedTasks.size === filteredTasks.length ? 'Deselect All' : 'Select All'}
            </Button>
          </div>

          {/* Drag and Drop Queue */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GripVertical className="h-5 w-5" />
                Drag & Drop Task Queue ({filteredTasks.length} tasks)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <DndContext 
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext 
                  items={filteredTasks.map(task => task.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-3">
                    {filteredTasks.map((task) => (
                      <SortableTask
                        key={task.id}
                        task={task}
                        isSelected={selectedTasks.has(task.id)}
                        onSelect={handleSelectTask}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
              {filteredTasks.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No tasks match your current filters
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bulk">
          <Card>
            <CardHeader>
              <CardTitle>Bulk Operations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium">
                    {selectedTasks.size} task{selectedTasks.size !== 1 ? 's' : ''} selected
                  </span>
                  {selectedTasks.size > 0 && (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleBulkAction('pause')}
                      >
                        <Pause className="h-4 w-4 mr-1" />
                        Pause All
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleBulkAction('resume')}
                      >
                        <Play className="h-4 w-4 mr-1" />
                        Resume All
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleBulkAction('stop')}
                      >
                        <Square className="h-4 w-4 mr-1" />
                        Stop All
                      </Button>
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold text-sm mb-2">Batch Processing</h4>
                    <p className="text-xs text-muted-foreground">Apply actions to multiple selected tasks simultaneously</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold text-sm mb-2">Smart Selection</h4>
                    <p className="text-xs text-muted-foreground">Select all visible tasks with current filters applied</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold text-sm mb-2">Queue Management</h4>
                    <p className="text-xs text-muted-foreground">Reorder tasks by dragging to optimize execution priority</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="filters">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Advanced Filters
                </CardTitle>
                <Button variant="outline" size="sm" onClick={clearFilters}>
                  Clear All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="date-from">Date From</Label>
                  <Input
                    id="date-from"
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="date-to">Date To</Label>
                  <Input
                    id="date-to"
                    type="date"
                    value={filters.dateTo}
                    onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="agent-filter">Agent</Label>
                  <Select value={filters.agent} onValueChange={(value) => setFilters({ ...filters, agent: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="All agents" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All agents</SelectItem>
                      {uniqueAgents.map(agent => (
                        <SelectItem key={agent} value={agent}>{agent}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="priority-filter">Priority</Label>
                  <Select value={filters.priority} onValueChange={(value) => setFilters({ ...filters, priority: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="All priorities" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All priorities</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="type-filter">Task Type</Label>
                  <Select value={filters.type} onValueChange={(value) => setFilters({ ...filters, type: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="All types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All types</SelectItem>
                      <SelectItem value="workflow">Workflow</SelectItem>
                      <SelectItem value="computation">Computation</SelectItem>
                      <SelectItem value="api">API Task</SelectItem>
                      <SelectItem value="analysis">Analysis</SelectItem>
                      <SelectItem value="training">Training</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="status-filter">Status</Label>
                  <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="All statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All statuses</SelectItem>
                      <SelectItem value="running">Running</SelectItem>
                      <SelectItem value="queued">Queued</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                      <SelectItem value="paused">Paused</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-muted rounded-lg">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Filtered Results:</span>
                    <p className="text-muted-foreground">{filteredTasks.length} tasks</p>
                  </div>
                  <div>
                    <span className="font-medium">Date Range:</span>
                    <p className="text-muted-foreground">
                      {filters.dateFrom || filters.dateTo ? 
                        `${filters.dateFrom || '...'} to ${filters.dateTo || '...'}` : 
                        'All dates'
                      }
                    </p>
                  </div>
                  <div>
                    <span className="font-medium">Active Filters:</span>
                    <p className="text-muted-foreground">
                      {Object.values(filters).filter(Boolean).length + (searchQuery ? 1 : 0)} applied
                    </p>
                  </div>
                  <div>
                    <span className="font-medium">Selected:</span>
                    <p className="text-muted-foreground">{selectedTasks.size} tasks</p>
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

export default EnhancedUX;