import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sun, Moon, Monitor } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useBrightness } from "@/hooks/useBrightness";

const BrightnessControl = () => {
  const { brightness, updateBrightness, resetBrightness } = useBrightness();
  const { toast } = useToast();

  const handleBrightnessChange = (value: number[]) => {
    const newBrightness = value[0];
    updateBrightness(newBrightness);
  };

  const setPresetBrightness = (preset: 'low' | 'medium' | 'high') => {
    let value: number;
    let label: string;
    
    switch (preset) {
      case 'low':
        value = 60;
        label = 'Low brightness (Eye-friendly)';
        break;
      case 'medium':
        value = 85;
        label = 'Medium brightness (Balanced)';
        break;
      case 'high':
        value = 100;
        label = 'High brightness (Default)';
        break;
    }
    
    updateBrightness(value);
    
    toast({
      title: "Brightness adjusted",
      description: label,
    });
  };

  const handleReset = () => {
    resetBrightness();
    
    toast({
      title: "Brightness reset",
      description: "Brightness has been reset to default (100%)",
    });
  };

  return (
    <Card className="card-enhanced w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Sun className="h-5 w-5" />
          <span>Brightness Control</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Brightness Slider */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Brightness</span>
            <span className="text-sm text-muted-foreground">{brightness}%</span>
          </div>
          <Slider
            value={[brightness]}
            onValueChange={handleBrightnessChange}
            min={20}
            max={120}
            step={5}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Dim</span>
            <span>Bright</span>
          </div>
        </div>

        {/* Preset Buttons */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Quick Presets</h4>
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPresetBrightness('low')}
              className="flex flex-col items-center space-y-1 h-auto py-3"
            >
              <Moon className="h-4 w-4" />
              <span className="text-xs">Low</span>
              <span className="text-xs text-muted-foreground">60%</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPresetBrightness('medium')}
              className="flex flex-col items-center space-y-1 h-auto py-3"
            >
              <Monitor className="h-4 w-4" />
              <span className="text-xs">Medium</span>
              <span className="text-xs text-muted-foreground">85%</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPresetBrightness('high')}
              className="flex flex-col items-center space-y-1 h-auto py-3"
            >
              <Sun className="h-4 w-4" />
              <span className="text-xs">High</span>
              <span className="text-xs text-muted-foreground">100%</span>
            </Button>
          </div>
        </div>

        {/* Reset Button */}
        <Button
          variant="secondary"
          onClick={handleReset}
          className="w-full"
        >
          Reset to Default
        </Button>

        {/* Tips */}
        <div className="bg-muted/50 rounded-lg p-3 space-y-2">
          <h5 className="text-xs font-medium">💡 Tips:</h5>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Use 60-70% for comfortable evening viewing</li>
            <li>• 85-95% works well for daytime use</li>
            <li>• Your setting is automatically saved</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default BrightnessControl;