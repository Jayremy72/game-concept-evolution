
import { useState, useEffect } from "react";
import { Organism } from "@/types/ecosystem";

interface StatPoint {
  timestamp: number;
  biomeHealth: number;
  organismCount: number;
  speciesDistribution: Record<string, number>;
  averageAdaptation: number;
  waterLevel: number;
  sunlightLevel: number;
}

export function useEcosystemStats(
  organisms: Organism[],
  biomeHealth: number,
  waterLevel: number,
  sunlightLevel: number
) {
  const [stats, setStats] = useState<StatPoint[]>([]);
  const [recordInterval, setRecordInterval] = useState<number>(10000); // 10 seconds by default

  // Record stats at regular intervals
  useEffect(() => {
    const interval = setInterval(() => {
      const speciesDistribution = organisms.reduce((acc, org) => {
        acc[org.type] = (acc[org.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const totalAdaptation = organisms.reduce((sum, org) => sum + org.adaptationPoints, 0);
      const averageAdaptation = organisms.length ? totalAdaptation / organisms.length : 0;

      const newStatPoint: StatPoint = {
        timestamp: Date.now(),
        biomeHealth,
        organismCount: organisms.length,
        speciesDistribution,
        averageAdaptation,
        waterLevel,
        sunlightLevel
      };

      setStats(prev => [...prev, newStatPoint]);
    }, recordInterval);

    return () => clearInterval(interval);
  }, [organisms, biomeHealth, waterLevel, sunlightLevel, recordInterval]);

  // Configure recording interval
  const setStatsInterval = (milliseconds: number) => {
    setRecordInterval(milliseconds);
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

  return {
    stats,
    setStatsInterval,
    clearStats,
    getRecentStats
  };
}
