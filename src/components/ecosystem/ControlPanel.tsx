
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Pause, Play, FastForward, SkipBack } from 'lucide-react';

interface ControlPanelProps {
  waterLevel: number;
  sunlightLevel: number;
  simulationSpeed: number;
  isPaused: boolean;
  onAdjustWater: (level: number) => void;
  onAdjustSunlight: (level: number) => void;
  onAdjustSpeed: (speed: number) => void;
  onTogglePause: () => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  waterLevel,
  sunlightLevel,
  simulationSpeed,
  isPaused,
  onAdjustWater,
  onAdjustSunlight,
  onAdjustSpeed,
  onTogglePause
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Ecosystem Controls</h3>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="icon"
            onClick={onTogglePause}
            title={isPaused ? "Resume Simulation" : "Pause Simulation"}
          >
            {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            onClick={() => onAdjustSpeed(Math.max(1, simulationSpeed - 1))}
            disabled={simulationSpeed <= 1}
            title="Decrease Speed"
          >
            <SkipBack className="h-4 w-4" />
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            onClick={() => onAdjustSpeed(Math.min(10, simulationSpeed + 1))}
            disabled={simulationSpeed >= 10}
            title="Increase Speed"
          >
            <FastForward className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium">Water Level: {waterLevel}%</label>
            <span className={`text-xs ${waterLevel > 70 ? 'text-blue-500' : waterLevel < 30 ? 'text-red-500' : 'text-gray-500'}`}>
              {waterLevel > 70 ? 'High' : waterLevel < 30 ? 'Low' : 'Optimal'}
            </span>
          </div>
          <Slider
            value={[waterLevel]}
            min={0}
            max={100}
            step={1}
            onValueChange={(values) => onAdjustWater(values[0])}
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium">Sunlight Level: {sunlightLevel}%</label>
            <span className={`text-xs ${sunlightLevel > 80 ? 'text-yellow-500' : sunlightLevel < 20 ? 'text-blue-500' : 'text-gray-500'}`}>
              {sunlightLevel > 80 ? 'Intense' : sunlightLevel < 20 ? 'Dim' : 'Optimal'}
            </span>
          </div>
          <Slider
            value={[sunlightLevel]}
            min={0}
            max={100}
            step={1}
            onValueChange={(values) => onAdjustSunlight(values[0])}
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium">Simulation Speed</label>
            <span className="text-xs font-mono">{simulationSpeed}x</span>
          </div>
          <Slider
            value={[simulationSpeed]}
            min={1}
            max={10}
            step={1}
            onValueChange={(values) => onAdjustSpeed(values[0])}
          />
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;
