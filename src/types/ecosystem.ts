
export interface Organism {
  id: string;
  type: string;
  position: {
    x: number;
    y: number;
  };
  health: number;
}
