import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, Wand2, Lightbulb, FileText, Brain, Zap } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface GeneratedPrompt {
  prompt: string;
  explanation: string;
  suggestions: string[];
  category: string;
  estimatedTokens: number;
}

const PromptEngineeringGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState<GeneratedPrompt | null>(null);
  const [formData, setFormData] = useState({
    taskType: '',
    context: '',
    role: '',
    tone: '',
    outputFormat: '',
    customRequirements: ''
  });
  const { toast } = useToast();

  const taskTypes = [
    { value: 'text-generation', label: 'Text Generation', icon: FileText },
    { value: 'analysis', label: 'Analysis & Research', icon: Brain },
    { value: 'creative-writing', label: 'Creative Writing', icon: Lightbulb },
    { value: 'problem-solving', label: 'Problem Solving', icon: Zap },
    { value: 'classification', label: 'Classification', icon: FileText },
    { value: 'summarization', label: 'Summarization', icon: FileText },
    { value: 'translation', label: 'Translation', icon: FileText },
    { value: 'code-generation', label: 'Code Generation', icon: Brain },
    { value: 'qa-assistant', label: 'Q&A Assistant', icon: Lightbulb },
    { value: 'custom', label: 'Custom Task', icon: Wand2 }
  ];

  const predefinedRoles = [
    'Expert Analyst', 'Creative Writer', 'Technical Consultant', 'Research Assistant',
    'Data Scientist', 'Marketing Strategist', 'Content Creator', 'Problem Solver',
    'Code Reviewer', 'Educational Tutor', 'Business Advisor', 'Custom Role'
  ];

  const toneOptions = [
    'Professional', 'Casual', 'Academic', 'Creative', 'Analytical',
    'Persuasive', 'Informative', 'Friendly', 'Authoritative', 'Conversational'
  ];

  const outputFormats = [
    'Paragraph', 'Bullet Points', 'Numbered List', 'JSON', 'Table',
    'Step-by-step Guide', 'Summary', 'Detailed Report', 'Code', 'Custom Format'
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const generatePrompt = async () => {
    if (!formData.taskType || !formData.context) {
      toast({
        title: "Missing Information",
        description: "Please select a task type and provide context.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('prompt-generator', {
        body: formData
      });

      if (error) throw error;

      setGeneratedPrompt(data);
      toast({
        title: "Prompt Generated!",
        description: "Your optimized prompt has been created successfully."
      });
    } catch (error) {
      console.error('Error generating prompt:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate prompt. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Prompt copied to clipboard."
    });
  };

  const promptTemplates = [
    {
      name: "Chain-of-Thought",
      description: "Step-by-step reasoning prompts",
      template: "Think through this step by step:\n1. First, analyze the problem\n2. Break it down into components\n3. Apply relevant knowledge\n4. Draw conclusions\n\nProblem: [YOUR_PROBLEM]"
    },
    {
      name: "Role-Based Expert",
      description: "AI takes on specific expertise",
      template: "You are a [EXPERT_ROLE] with [X] years of experience in [FIELD]. Your task is to [SPECIFIC_TASK]. Please provide [OUTPUT_TYPE] that demonstrates your expertise."
    },
    {
      name: "Few-Shot Learning",
      description: "Learning from examples",
      template: "Here are examples of the task:\n\nExample 1:\nInput: [EXAMPLE_INPUT_1]\nOutput: [EXAMPLE_OUTPUT_1]\n\nExample 2:\nInput: [EXAMPLE_INPUT_2]\nOutput: [EXAMPLE_OUTPUT_2]\n\nNow, please complete:\nInput: [YOUR_INPUT]\nOutput:"
    },
    {
      name: "Constraint-Based",
      description: "Prompts with specific limitations",
      template: "Complete this task with the following constraints:\n- [CONSTRAINT_1]\n- [CONSTRAINT_2]\n- [CONSTRAINT_3]\n\nTask: [YOUR_TASK]"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold flex items-center justify-center gap-2">
          <Wand2 className="h-8 w-8 text-primary" />
          Prompt Engineering Generator
        </h2>
        <p className="text-muted-foreground">
          Create optimized AI prompts with intelligent suggestions and best practices
        </p>
      </div>

      <Tabs defaultValue="generator" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="generator">AI Generator</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="generator" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input Form */}
            <Card>
              <CardHeader>
                <CardTitle>Prompt Configuration</CardTitle>
                <CardDescription>
                  Configure your prompt parameters for AI-powered generation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="taskType">Task Type *</Label>
                  <Select onValueChange={(value) => handleInputChange('taskType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select task type" />
                    </SelectTrigger>
                    <SelectContent>
                      {taskTypes.map((type) => {
                        const IconComponent = type.icon;
                        return (
                          <SelectItem key={type.value} value={type.value}>
                            <div className="flex items-center gap-2">
                              <IconComponent className="h-4 w-4" />
                              {type.label}
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="context">Context/Domain *</Label>
                  <Textarea
                    id="context"
                    placeholder="Describe the context, domain, or subject matter for your prompt..."
                    value={formData.context}
                    onChange={(e) => handleInputChange('context', e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Role/Persona</Label>
                  <Select onValueChange={(value) => handleInputChange('role', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select AI role (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      {predefinedRoles.map((role) => (
                        <SelectItem key={role} value={role}>
                          {role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tone">Tone</Label>
                    <Select onValueChange={(value) => handleInputChange('tone', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select tone" />
                      </SelectTrigger>
                      <SelectContent>
                        {toneOptions.map((tone) => (
                          <SelectItem key={tone} value={tone}>
                            {tone}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="outputFormat">Output Format</Label>
                    <Select onValueChange={(value) => handleInputChange('outputFormat', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select format" />
                      </SelectTrigger>
                      <SelectContent>
                        {outputFormats.map((format) => (
                          <SelectItem key={format} value={format}>
                            {format}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customRequirements">Additional Requirements</Label>
                  <Textarea
                    id="customRequirements"
                    placeholder="Any specific requirements, constraints, or preferences..."
                    value={formData.customRequirements}
                    onChange={(e) => handleInputChange('customRequirements', e.target.value)}
                  />
                </div>

                <Button 
                  onClick={generatePrompt} 
                  disabled={isGenerating || !formData.taskType || !formData.context}
                  className="w-full"
                >
                  {isGenerating ? (
                    <>
                      <Wand2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Wand2 className="mr-2 h-4 w-4" />
                      Generate Optimized Prompt
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Generated Output */}
            <Card>
              <CardHeader>
                <CardTitle>Generated Prompt</CardTitle>
                <CardDescription>
                  AI-optimized prompt ready for use
                </CardDescription>
              </CardHeader>
              <CardContent>
                {generatedPrompt ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">{generatedPrompt.category}</Badge>
                      <Badge variant="outline">
                        ~{generatedPrompt.estimatedTokens} tokens
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label>Optimized Prompt</Label>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(generatedPrompt.prompt)}
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Copy
                        </Button>
                      </div>
                      <Textarea
                        value={generatedPrompt.prompt}
                        readOnly
                        className="min-h-[200px] font-mono text-sm"
                      />
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <Label>Explanation</Label>
                      <p className="text-sm text-muted-foreground">{generatedPrompt.explanation}</p>
                    </div>

                    {generatedPrompt.suggestions.length > 0 && (
                      <div className="space-y-2">
                        <Label>Suggestions</Label>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {generatedPrompt.suggestions.map((suggestion, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-primary">•</span>
                              {suggestion}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Wand2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Configure your prompt parameters and click generate to create an optimized prompt</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {promptTemplates.map((template, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Textarea
                      value={template.template}
                      readOnly
                      className="min-h-[120px] font-mono text-sm"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(template.template)}
                      className="w-full"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Template
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PromptEngineeringGenerator;