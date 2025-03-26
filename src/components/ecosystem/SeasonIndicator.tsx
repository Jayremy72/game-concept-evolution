
import React from "react";
import { Season } from "@/hooks/useSeasons";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface SeasonIndicatorProps {
  currentSeason: Season;
  seasonProgress: number;
  className?: string;
}

const SeasonIndicator: React.FC<SeasonIndicatorProps> = ({
  currentSeason,
  seasonProgress,
  className
}) => {
  const getSeasonDetails = (season: Season) => {
    switch (season) {
      case "spring":
        return {
          icon: "🌱",
          name: "Spring",
          color: "bg-green-500",
          textColor: "text-green-700",
          progressColor: "bg-green-500"
        };
      case "summer":
        return {
          icon: "☀️",
          name: "Summer",
          color: "bg-yellow-500",
          textColor: "text-yellow-700",
          progressColor: "bg-yellow-500"
        };
      case "autumn":
        return {
          icon: "🍂",
          name: "Autumn",
          color: "bg-orange-500",
          textColor: "text-orange-700",
          progressColor: "bg-orange-500"
        };
      case "winter":
        return {
          icon: "❄️",
          name: "Winter",
          color: "bg-blue-300",
          textColor: "text-blue-700",
          progressColor: "bg-blue-300"
        };
    }
  };

  const seasonDetails = getSeasonDetails(currentSeason);

  // Determine the next season
  const getNextSeason = (current: Season): Season => {
    const seasons: Season[] = ["spring", "summer", "autumn", "winter"];
    const currentIndex = seasons.indexOf(current);
    return seasons[(currentIndex + 1) % seasons.length];
  };

  const nextSeason = getNextSeason(currentSeason);
  const nextSeasonDetails = getSeasonDetails(nextSeason);

  return (
    <div className={cn("bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm", className)}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <span className="text-2xl mr-2">{seasonDetails.icon}</span>
          <span className={cn("font-medium", seasonDetails.textColor)}>{seasonDetails.name}</span>
        </div>
        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
          <span>Next:</span>
          <span className="ml-1 flex items-center">
            {nextSeasonDetails.icon}
            <span className="ml-1">{nextSeasonDetails.name}</span>
          </span>
        </div>
      </div>
      
      <div className="space-y-1">
        <div className="flex justify-between text-xs">
          <span>Season Progress</span>
          <span>{Math.round(seasonProgress)}%</span>
        </div>
        <Progress 
          value={seasonProgress} 
          className="h-2" 
          indicatorClassName={seasonDetails.progressColor} 
        />
      </div>
    </div>
  );
};

export default SeasonIndicator;
