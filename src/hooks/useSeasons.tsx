
import { useState, useEffect } from "react";

export type Season = "spring" | "summer" | "autumn" | "winter";

interface SeasonData {
  name: Season;
  waterModifier: number;  // How season affects water level
  sunlightModifier: number;  // How season affects sunlight
  growthModifier: number;  // How season affects organism growth
  icon: string;  // Emoji for the season
  color: string;  // Color theme for the season
}

const SEASONS_DATA: Record<Season, SeasonData> = {
  spring: {
    name: "spring",
    waterModifier: 15,  // More rain
    sunlightModifier: 10,  // Moderate sunlight
    growthModifier: 1.5,  // Faster growth
    icon: "🌱",
    color: "from-green-300 to-green-500"
  },
  summer: {
    name: "summer",
    waterModifier: -10,  // Less water (drought)
    sunlightModifier: 25,  // More sunlight
    growthModifier: 1.2,  // Good growth
    icon: "☀️",
    color: "from-yellow-300 to-yellow-500"
  },
  autumn: {
    name: "autumn",
    waterModifier: 5,  // Some rain
    sunlightModifier: -5,  // Less sunlight
    growthModifier: 0.8,  // Slower growth
    icon: "🍂",
    color: "from-orange-300 to-orange-500"
  },
  winter: {
    name: "winter",
    waterModifier: 0,  // Snow rather than usable water
    sunlightModifier: -20,  // Much less sunlight
    growthModifier: 0.4,  // Very slow growth
    icon: "❄️",
    color: "from-blue-200 to-blue-300"
  }
};

// Default season cycle in milliseconds (2 minutes per season)
const DEFAULT_SEASON_DURATION = 60 * 1000; 

export function useSeasons(simulationSpeed: number = 1) {
  const [currentSeason, setCurrentSeason] = useState<Season>("spring");
  const [seasonData, setSeasonData] = useState<SeasonData>(SEASONS_DATA.spring);
  const [seasonProgress, setSeasonProgress] = useState<number>(0); // 0-100%
  const [seasonDuration, setSeasonDuration] = useState<number>(DEFAULT_SEASON_DURATION);
  
  // Season progression cycle
  useEffect(() => {
    const adjustedDuration = seasonDuration / simulationSpeed;
    
    const interval = setInterval(() => {
      setSeasonProgress(prev => {
        const newProgress = prev + (100 / adjustedDuration) * 100;
        
        // Switch to next season when progress reaches 100%
        if (newProgress >= 100) {
          const seasons: Season[] = ["spring", "summer", "autumn", "winter"];
          const currentIndex = seasons.indexOf(currentSeason);
          const nextIndex = (currentIndex + 1) % seasons.length;
          const nextSeason = seasons[nextIndex];
          
          setCurrentSeason(nextSeason);
          setSeasonData(SEASONS_DATA[nextSeason]);
          return 0; // Reset progress for new season
        }
        
        return newProgress;
      });
    }, 100); // Update progress every 100ms
    
    return () => clearInterval(interval);
  }, [currentSeason, seasonDuration, simulationSpeed]);
  
  // Methods to control seasons
  const setSeasonLength = (milliseconds: number) => {
    setSeasonDuration(milliseconds);
  };
  
  // Force change to a specific season
  const changeSeason = (season: Season) => {
    setCurrentSeason(season);
    setSeasonData(SEASONS_DATA[season]);
    setSeasonProgress(0);
  };
  
  return {
    currentSeason,
    seasonData,
    seasonProgress,
    changeSeason,
    setSeasonLength
  };
}
