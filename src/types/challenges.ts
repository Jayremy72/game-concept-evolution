
export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'environmental' | 'research' | 'conservation' | 'balance';
  difficulty: 'easy' | 'medium' | 'hard';
  isActive: boolean;
  isCompleted: boolean;
  progress: number; // 0-100
  reward: {
    type: 'species' | 'trait' | 'knowledge' | 'biome';
    value: string;
  };
  requiredConditions: {
    biomeHealth?: number;
    speciesCount?: Record<string, number>;
    timeRequired?: number; // in seconds
    seasonalCycles?: number;
    adaptationPoints?: number;
    biodiversity?: number; // number of different species
  };
  startTime?: number;
}

export interface ResearchProject {
  id: string;
  title: string;
  description: string;
  targetSpecies: string;
  progress: number; // 0-100
  knowledgeGained: number; // increases with progress
  isCompleted: boolean;
  discoveredTraits: string[];
  timeSpent: number; // in seconds
  startTime?: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  isUnlocked: boolean;
  icon: string;
  unlockedAt?: number;
  category: 'biodiversity' | 'evolution' | 'survival' | 'discovery' | 'mastery';
  difficulty: 'bronze' | 'silver' | 'gold';
}

export interface GameProgress {
  level: number;
  experiencePoints: number;
  challengesCompleted: number;
  researchCompleted: number;
  achievementsUnlocked: number;
  highestBiomeHealth: number;
  longestEcosystemSurvival: number; // in seconds
  speciesDiscovered: string[];
  traitsUnlocked: string[];
}
