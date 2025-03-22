
import React from "react";
import { Organism } from "@/types/ecosystem";
import { getEvolutionInfo } from "@/utils/evolutionSystem";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface EvolutionIndicatorProps {
  organism: Organism;
  onClick?: () => void;
}

const EvolutionIndicator: React.FC<EvolutionIndicatorProps> = ({
  organism,
  onClick
}) => {
  const { type, stage, health, adaptationPoints } = organism;
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
  
  // Animation when close to evolving
  const isCloseToEvolving = !isMaxEvolution && progressPercent > 90;
  
  return (
    <div 
      className={`
        relative p-1 rounded-md cursor-pointer 
        ${isCloseToEvolving ? 'animate-pulse bg-yellow-50 dark:bg-yellow-900/20' : ''}
        ${health < 30 ? 'bg-red-50 dark:bg-red-900/20' : ''}
        hover:bg-gray-100 dark:hover:bg-gray-800
      `}
      onClick={onClick}
    >
      {stageIndicator()}
      
      <div className="text-center mb-1">
        <span className="text-xl">{currentEvolution.icon}</span>
      </div>
      
      {!isMaxEvolution ? (
        <div className="w-10 mx-auto">
          <Progress 
            value={progressPercent} 
            className="h-1" 
            indicatorClassName={`
              ${progressPercent > 90 ? 'bg-yellow-500 animate-pulse' : 
                progressPercent > 50 ? 'bg-green-500' : 'bg-blue-500'}
            `}
          />
        </div>
      ) : (
        <div className="w-10 h-1 mx-auto bg-purple-200 dark:bg-purple-800 rounded-full overflow-hidden">
          <div className="h-full w-full bg-purple-500"></div>
        </div>
      )}
    </div>
  );
};

export default EvolutionIndicator;
