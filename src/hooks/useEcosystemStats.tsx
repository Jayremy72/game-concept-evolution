
import { useState, useEffect } from "react";
import { Organism } from "@/types/ecosystem";
import { toast } from "@/hooks/use-toast";

interface StatPoint {
  timestamp: number;
  biomeHealth: number;
  organismCount: number;
  speciesDistribution: Record<string, number>;
  averageAdaptation: number;
  waterLevel: number;
  sunlightLevel: number;
  stageDistribution: Record<string, number[]>;
}

export function useEcosystemStats(
  organisms: Organism[],
  biomeHealth: number,
  waterLevel: number,
  sunlightLevel: number
) {
  const [stats, setStats] = useState<StatPoint[]>([]);
  const [recordInterval, setRecordInterval] = useState<number>(5000); // 5 seconds by default
  const [isRecording, setIsRecording] = useState<boolean>(true);
  const [lastEvolutionNotification, setLastEvolutionNotification] = useState<Record<string, number>>({});

  // Record stats at regular intervals
  useEffect(() => {
    if (!isRecording) return;

    const interval = setInterval(() => {
      // Calculate species distribution
      const speciesDistribution = organisms.reduce((acc, org) => {
        acc[org.type] = (acc[org.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Calculate adaptation points
      const totalAdaptation = organisms.reduce((sum, org) => sum + org.adaptationPoints, 0);
      const averageAdaptation = organisms.length ? totalAdaptation / organisms.length : 0;
      
      // Calculate stage distribution for each species
      const stageDistribution = organisms.reduce((acc, org) => {
        if (!acc[org.type]) {
          acc[org.type] = [0, 0, 0]; // Initialize counters for stages 0, 1, 2
        }
        if (org.stage >= 0 && org.stage < 3) {
          acc[org.type][org.stage]++;
        }
        return acc;
      }, {} as Record<string, number[]>);

      const newStatPoint: StatPoint = {
        timestamp: Date.now(),
        biomeHealth,
        organismCount: organisms.length,
        speciesDistribution,
        averageAdaptation,
        waterLevel,
        sunlightLevel,
        stageDistribution
      };

      setStats(prev => [...prev, newStatPoint]);
      
      // Check for evolutions
      checkForEvolutions(organisms);
    }, recordInterval);

    return () => clearInterval(interval);
  }, [organisms, biomeHealth, waterLevel, sunlightLevel, recordInterval, isRecording]);

  // Check for organisms that have evolved recently
  const checkForEvolutions = (currentOrganisms: Organism[]) => {
    const now = Date.now();
    
    currentOrganisms.forEach(org => {
      const orgKey = `${org.id}-${org.stage}`;
      
      // If we haven't notified about this evolution stage for this organism
      // and the organism is at stage 1 or higher (has evolved at least once)
      if (org.stage > 0 && !lastEvolutionNotification[orgKey]) {
        // Update the notification record
        setLastEvolutionNotification(prev => ({
          ...prev,
          [orgKey]: now
        }));
        
        // Show toast notification with our custom toast
        toast({
          title: `Evolution: ${org.type} reached stage ${org.stage + 1}!`,
          description: `A ${org.type} has evolved to the next stage with new traits.`,
          duration: 5000,
        });
      }
    });
  };

  // Configure recording interval
  const setStatsInterval = (milliseconds: number) => {
    setRecordInterval(milliseconds);
  };

  // Pause/resume stats recording
  const toggleRecording = () => {
    setIsRecording(prev => !prev);
    return !isRecording; // Return the new state
  };

  // Clear all recorded stats
  const clearStats = () => {
    setStats([]);
  };

  // Get stats for the last X minutes
  const getRecentStats = (minutes: number) => {
    const cutoffTime = Date.now() - minutes * 60 * 1000;
    return stats.filter(stat => stat.timestamp >= cutoffTime);
  };

  // Calculate evolution progress metrics
  const getEvolutionMetrics = () => {
    // If no organisms, return empty metrics
    if (organisms.length === 0) {
      return {
        totalEvolutions: 0,
        percentageEvolved: 0,
        mostEvolvedType: null,
        stageDistribution: {}
      };
    }

    // Count organisms at each evolution stage
    const stages = [0, 0, 0]; // For stage 0, 1, 2
    let totalEvolutions = 0;
    
    // Track which type has evolved the most
    const typeEvolutionCount: Record<string, number> = {};
    
    organisms.forEach(org => {
      if (org.stage >= 0 && org.stage < 3) {
        stages[org.stage]++;
      }
      
      if (org.stage > 0) {
        totalEvolutions += org.stage;
        typeEvolutionCount[org.type] = (typeEvolutionCount[org.type] || 0) + org.stage;
      }
    });
    
    // Calculate percentage of organisms that have evolved
    const evolvedCount = organisms.length - stages[0];
    const percentageEvolved = (evolvedCount / organisms.length) * 100;
    
    // Find the type with most evolutions
    let mostEvolvedType = null;
    let highestEvolutionCount = 0;
    
    Object.entries(typeEvolutionCount).forEach(([type, count]) => {
      if (count > highestEvolutionCount) {
        mostEvolvedType = type;
        highestEvolutionCount = count;
      }
    });
    
    return {
      totalEvolutions,
      percentageEvolved,
      mostEvolvedType,
      stageDistribution: {
        stage1: stages[0],
        stage2: stages[1],
        stage3: stages[2]
      }
    };
  };

  return {
    stats,
    setStatsInterval,
    toggleRecording,
    clearStats,
    getRecentStats,
    getEvolutionMetrics
  };
}
