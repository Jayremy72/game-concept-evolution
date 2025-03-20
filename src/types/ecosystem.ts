
export interface Organism {
  id: string;
  type: string;
  position: {
    x: number;
    y: number;
  };
  health: number;
  adaptationPoints: number;
  stage: number;
  traits: string[];
  birthTime?: number; // When was this organism created
  movementSpeed?: number; // How fast the organism can move
  targetPosition?: { x: number; y: number; }; // Where the organism is trying to move to
  lastMealTime?: number; // When did the organism last eat
  hunger?: number; // 0-100, increases over time
  age?: number; // Age in seconds
  isMating?: boolean; // Is the organism currently trying to mate
}

export interface EvolutionStage {
  stage: number;
  threshold: number;
  name: string;
  icon: string;
  traits: string[];
  description: string;
}

export type EvolutionMap = {
  [key: string]: EvolutionStage[];
};

export interface OrganismMovement {
  organismId: string;
  startPosition: { x: number; y: number; };
  targetPosition: { x: number; y: number; };
  startTime: number;
  duration: number;
}

export interface FeedingEvent {
  predatorId: string;
  preyId?: string; // Optional for plants that don't feed on other organisms
  position: { x: number; y: number; };
  timestamp: number;
}

export interface OrganismInteraction {
  type: 'feeding' | 'mating' | 'fighting' | 'fleeing';
  organisms: string[]; // IDs of organisms involved
  position: { x: number; y: number; };
  timestamp: number;
  result?: string; // Outcome of the interaction
}
