
import React from "react";
import { Organism } from "@/types/ecosystem";
import { getEvolutionInfo } from "@/utils/evolutionSystem";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface EvolutionIndicatorProps {
  organism: Organism;
  onClick?: () => void;
}

const EvolutionIndicator: React.FC<EvolutionIndicatorProps> = ({
  organism,
  onClick
}) => {
  const { id, type, stage, health, adaptationPoints } = organism;
  const currentEvolution = getEvolutionInfo(type, stage);
  const nextEvolution = getEvolutionInfo(type, stage + 1);
  const isMaxEvolution = stage >= 2; // Assuming max stage is 2
  
  // Calculate progress to next evolution
  let progressPercent = 0;
  if (!isMaxEvolution && nextEvolution.threshold > 0) {
    progressPercent = Math.min(100, Math.round((adaptationPoints / nextEvolution.threshold) * 100));
  }
  
  // Visual indicators based on stage
  const stageIndicator = () => {
    switch(stage) {
      case 0:
        return (
          <Badge variant="outline" className="absolute -top-2 -right-2 text-xs bg-blue-100 dark:bg-blue-900 border-blue-300">
            {currentEvolution.icon}
          </Badge>
        );
      case 1:
        return (
          <Badge variant="outline" className="absolute -top-2 -right-2 text-xs bg-green-100 dark:bg-green-900 border-green-300">
            {currentEvolution.icon}
          </Badge>
        );
      case 2:
        return (
          <Badge variant="outline" className="absolute -top-2 -right-2 text-xs bg-purple-100 dark:bg-purple-900 border-purple-300 animate-pulse">
            {currentEvolution.icon} ✨
          </Badge>
        );
      default:
        return null;
    }
  };
  
  // Get organism status based on health
  const getHealthStatus = () => {
    if (health > 80) return { label: "Thriving", color: "bg-green-500" };
    if (health > 60) return { label: "Healthy", color: "bg-green-400" };
    if (health > 40) return { label: "Stable", color: "bg-yellow-400" };
    if (health > 20) return { label: "Stressed", color: "bg-orange-400" };
    return { label: "Critical", color: "bg-red-500" };
  };
  
  const status = getHealthStatus();
  
  // Animation when close to evolving
  const isCloseToEvolving = !isMaxEvolution && progressPercent > 90;
  const isGainingAdaptation = !isMaxEvolution && health > 20 && health < 80;
  
  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <div 
            className={`
              relative p-1 rounded-md cursor-pointer 
              ${isCloseToEvolving ? 'animate-pulse bg-yellow-50 dark:bg-yellow-900/20' : ''}
              hover:bg-gray-100 dark:hover:bg-gray-800
            `}
            onClick={onClick}
          >
            {stageIndicator()}
            
            <div className="text-center mb-1">
              <span className="text-xl">{currentEvolution.icon}</span>
              {isGainingAdaptation && (
                <span className="absolute -top-1 -right-1 text-xs text-blue-600 dark:text-blue-400">+</span>
              )}
            </div>
            
            {/* Health status indicator */}
            <div className="w-10 mx-auto mb-1">
              <div className={`h-1 w-full rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700`}>
                <div 
                  className={`h-full transition-all duration-500 ${status.color}`}
                  style={{ width: `${health}%` }}
                />
              </div>
            </div>
            
            {/* Evolution progress */}
            {!isMaxEvolution ? (
              <div className="w-10 mx-auto">
                <Progress 
                  value={progressPercent} 
                  className="h-1" 
                />
                {isGainingAdaptation && (
                  <div className="text-[8px] text-center text-blue-600 dark:text-blue-400 mt-0.5">
                    {Math.round(adaptationPoints)}/{nextEvolution.threshold}
                  </div>
                )}
              </div>
            ) : (
              <div className="w-10 h-1 mx-auto bg-purple-200 dark:bg-purple-800 rounded-full overflow-hidden">
                <div className="h-full w-full bg-purple-500"></div>
              </div>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent side="right" align="center" className="z-50">
          <div className="text-sm">
            <p className="font-bold">{currentEvolution.name}</p>
            <p>Health: {Math.round(health)}% - {status.label}</p>
            {!isMaxEvolution && (
              <p>Adaptation: {Math.round(adaptationPoints)}/{nextEvolution.threshold}</p>
            )}
            {isMaxEvolution && (
              <p className="text-purple-500">Fully Evolved</p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default EvolutionIndicator;
