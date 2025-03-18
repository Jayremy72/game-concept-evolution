
import React from "react";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Droplets, Sun, Heart } from "lucide-react";

interface StatsPanelProps {
  biomeHealth: number;
  waterLevel: number;
  sunlightLevel: number;
  onAdjustWater: (value: number) => void;
  onAdjustSunlight: (value: number) => void;
}

const StatsPanel = ({
  biomeHealth,
  waterLevel,
  sunlightLevel,
  onAdjustWater,
  onAdjustSunlight
}: StatsPanelProps) => {
  // Function to determine health status
  const getHealthStatus = () => {
    if (biomeHealth > 75) return { text: "Thriving", color: "text-green-500" };
    if (biomeHealth > 50) return { text: "Stable", color: "text-blue-500" };
    if (biomeHealth > 25) return { text: "Struggling", color: "text-yellow-500" };
    return { text: "Critical", color: "text-red-500" };
  };

  const healthStatus = getHealthStatus();

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-lg font-bold mb-3">Ecosystem Health</h2>
      
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Heart className="h-5 w-5 mr-2 text-red-500" />
              <span>Ecosystem Health</span>
            </div>
            <span className={healthStatus.color}>{healthStatus.text}</span>
          </div>
          <Progress value={biomeHealth} className="h-2" />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Droplets className="h-5 w-5 mr-2 text-blue-500" />
              <span>Water Level</span>
            </div>
            <span>{waterLevel}%</span>
          </div>
          <Slider 
            value={[waterLevel]} 
            min={0} 
            max={100} 
            step={5}
            onValueChange={(values) => onAdjustWater(values[0])}
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Sun className="h-5 w-5 mr-2 text-yellow-500" />
              <span>Sunlight Level</span>
            </div>
            <span>{sunlightLevel}%</span>
          </div>
          <Slider 
            value={[sunlightLevel]} 
            min={0} 
            max={100} 
            step={5}
            onValueChange={(values) => onAdjustSunlight(values[0])}
          />
        </div>
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
          <p>
            Adjusting environmental factors affects which species will thrive in your ecosystem.
          </p>
          <p>
            Try to maintain a balance that supports your desired biodiversity.
          </p>
        </div>
      </div>
    </div>
  );
};

export default StatsPanel;
