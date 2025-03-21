
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
