import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Sun, Moon } from "lucide-react";
import { useBrightness } from "@/hooks/useBrightness";

const BrightnessToggle = () => {
  const { brightness, toggleBrightness } = useBrightness();

  const handleToggle = () => {
    toggleBrightness();
  };

  const isDim = brightness <= 70;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          onClick={handleToggle}
          className="h-9 w-9 p-0 transition-all duration-300 hover:scale-105"
        >
          {isDim ? (
            <Moon className="h-4 w-4" />
          ) : (
            <Sun className="h-4 w-4" />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>
          {isDim ? "Switch to bright mode" : "Switch to dim mode"} 
          <span className="ml-1 text-xs">({brightness}%)</span>
        </p>
      </TooltipContent>
    </Tooltip>
  );
};

export default BrightnessToggle;