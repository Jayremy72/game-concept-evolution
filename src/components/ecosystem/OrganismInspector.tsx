
import React from "react";
import { Organism } from "@/types/ecosystem";
import { getEvolutionInfo } from "@/utils/evolutionSystem";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { X, Heart, Brain, ChevronUp, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface OrganismInspectorProps {
  organism: Organism;
  onClose: () => void;
  waterLevel: number;
  sunlightLevel: number;
}

const OrganismInspector: React.FC<OrganismInspectorProps> = ({
  organism,
  onClose,
  waterLevel,
  sunlightLevel
}) => {
  const { id, type, stage, health, adaptationPoints, traits } = organism;
  const evolutionInfo = getEvolutionInfo(type, stage);
  const nextEvolutionInfo = getEvolutionInfo(type, stage + 1);
  const isMaxEvolution = stage >= 2; // Assuming max stage is 2

  // Calculate environmental suitability
  const calculateEnvironmentalSuitability = () => {
    let suitability = 100; // Start at 100%
    
    // Adjust based on organism type and environmental factors
    switch (type) {
      case "tree":
      case "grass":
      case "flower":
        // Plants need water and sunlight
        if (waterLevel < 30) suitability -= (30 - waterLevel) * 1.5;
        if (sunlightLevel < 40) suitability -= (40 - sunlightLevel) * 1.2;
        break;
        
      case "cactus":
      case "bush":
        // Desert plants need less water, more sun
        if (waterLevel > 60) suitability -= (waterLevel - 60) * 1.2;
        if (sunlightLevel < 50) suitability -= (50 - sunlightLevel);
        break;
        
      case "seaweed":
      case "coral":
        // Aquatic plants need more water
        if (waterLevel < 70) suitability -= (70 - waterLevel) * 2;
        break;
        
      case "rabbit":
      case "fox":
        // Forest animals
        if (waterLevel < 20) suitability -= (20 - waterLevel) * 1.5;
        break;
        
      case "lizard":
      case "snake":
        // Desert animals
        if (waterLevel > 50) suitability -= (waterLevel - 50);
        if (sunlightLevel < 40) suitability -= (40 - sunlightLevel);
        break;
    }
    
    // Apply trait bonuses
    if (traits.includes("drought-resistant") && waterLevel < 30) {
      suitability += 20;
    }
    
    if (traits.includes("heat-resistant") && sunlightLevel > 80) {
      suitability += 20;
    }
    
    if (traits.includes("water-efficient") && waterLevel < 40) {
      suitability += 15;
    }
    
    return Math.max(0, Math.min(100, Math.round(suitability)));
  };

  const environmentalSuitability = calculateEnvironmentalSuitability();
  
  // Get suitability color
  const getSuitabilityColor = (value: number) => {
    if (value >= 80) return "text-green-500";
    if (value >= 60) return "text-yellow-500";
    if (value >= 40) return "text-orange-500";
    return "text-red-500";
  };

  // Calculate progress to next evolution
  let progressPercent = 0;
  if (!isMaxEvolution && nextEvolutionInfo.threshold > 0) {
    progressPercent = (adaptationPoints / nextEvolutionInfo.threshold) * 100;
  }

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-96 max-h-[95vh] overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <span className="text-4xl mr-3">{evolutionInfo.icon}</span>
            <div>
              <h3 className="text-lg font-bold">{evolutionInfo.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Stage {stage + 1}/3</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Organism details */}
        <div className="p-4 space-y-4">
          <p className="text-sm italic text-gray-600 dark:text-gray-300">
            "{evolutionInfo.description}"
          </p>
          
          {/* Health and Adaptation */}
          <div className="space-y-3">
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Heart className="h-4 w-4 text-red-500 mr-2" />
                  <span className="text-sm font-medium">Health</span>
                </div>
                <span className={cn(
                  "text-sm",
                  health > 75 ? "text-green-500" : 
                  health > 50 ? "text-yellow-500" : 
                  health > 25 ? "text-orange-500" : "text-red-500"
                )}>
                  {Math.round(health)}%
                </span>
              </div>
              <Progress value={health} className="h-2" />
            </div>
            
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Brain className="h-4 w-4 text-blue-500 mr-2" />
                  <span className="text-sm font-medium">Adaptation</span>
                </div>
                <span className="text-sm text-blue-500">{Math.round(adaptationPoints)} pts</span>
              </div>
              <Progress value={adaptationPoints} max={isMaxEvolution ? 100 : nextEvolutionInfo.threshold} className="h-2" />
            </div>
          </div>
          
          {/* Traits */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">Traits:</h4>
            <div className="flex flex-wrap gap-1">
              {traits.map((trait, index) => (
                <span 
                  key={`${trait}-${index}`} 
                  className="text-xs bg-green-100 dark:bg-green-900 px-1.5 py-0.5 rounded-full"
                >
                  {trait}
                </span>
              ))}
            </div>
          </div>
          
          {/* Environmental Suitability */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">Environmental Suitability:</h4>
            <div className="flex justify-between items-center">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div 
                  className={cn(
                    "h-2.5 rounded-full",
                    environmentalSuitability > 80 ? "bg-green-500" :
                    environmentalSuitability > 60 ? "bg-yellow-500" :
                    environmentalSuitability > 40 ? "bg-orange-500" : "bg-red-500"
                  )}
                  style={{ width: `${environmentalSuitability}%` }}
                ></div>
              </div>
              <span className={cn("ml-2 text-sm font-medium", getSuitabilityColor(environmentalSuitability))}>
                {environmentalSuitability}%
              </span>
            </div>
            
            <div className="text-xs text-gray-600 dark:text-gray-300 space-y-1">
              <div className="flex justify-between">
                <span>Water need:</span>
                {type === "cactus" || type === "bush" ? (
                  <span>Low (current: {waterLevel}%)</span>
                ) : type === "seaweed" || type === "coral" ? (
                  <span>High (current: {waterLevel}%)</span>
                ) : (
                  <span>Medium (current: {waterLevel}%)</span>
                )}
              </div>
              
              <div className="flex justify-between">
                <span>Sunlight need:</span>
                {type === "lizard" || type === "cactus" ? (
                  <span>High (current: {sunlightLevel}%)</span>
                ) : type === "fungi" ? (
                  <span>Low (current: {sunlightLevel}%)</span>
                ) : (
                  <span>Medium (current: {sunlightLevel}%)</span>
                )}
              </div>
            </div>
          </div>
          
          {/* Evolution */}
          {!isMaxEvolution ? (
            <div className="space-y-2 border-t border-gray-200 dark:border-gray-700 pt-3">
              <h4 className="text-sm font-semibold">Next Evolution:</h4>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-2xl mr-2">{nextEvolutionInfo.icon}</span>
                  <span className="text-sm">{nextEvolutionInfo.name}</span>
                </div>
                <span className="text-xs">{Math.round(adaptationPoints)}/{nextEvolutionInfo.threshold} pts</span>
              </div>
              <Progress value={progressPercent} className="h-2" />
              
              <div className="mt-2">
                <span className="text-xs font-medium text-blue-600 dark:text-blue-400">New traits you'll gain:</span>
                <div className="mt-1 flex flex-wrap gap-1">
                  {nextEvolutionInfo.traits
                    .filter(trait => !traits.includes(trait))
                    .map((trait, index) => (
                      <span 
                        key={`${trait}-next-${index}`} 
                        className="text-xs bg-blue-100 dark:bg-blue-900 px-1.5 py-0.5 rounded-full"
                      >
                        {trait}
                      </span>
                    ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-3 text-xs text-purple-600 dark:text-purple-400 font-medium bg-purple-50 dark:bg-purple-900/20 p-2 rounded-md flex items-center justify-center">
              <span className="mr-2">✨</span>
              Maximum evolution achieved
              <span className="ml-2">✨</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrganismInspector;
