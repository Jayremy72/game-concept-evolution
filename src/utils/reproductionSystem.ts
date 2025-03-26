
import { Organism } from "@/types/ecosystem";
import { v4 as uuidv4 } from "uuid";
import { getEvolutionInfo } from "./evolutionSystem";

export interface ReproductionEvent {
  id: string;
  position: {
    x: number;
    y: number;
  };
  timestamp: number;
  type: string;
}

// Check if two organisms can reproduce
export function canReproduce(organism1: Organism, organism2: Organism): boolean {
  // Must be same type
  if (organism1.type !== organism2.type) return false;
  
  // Must have good health (above 60%)
  if (organism1.health < 60 || organism2.health < 60) return false;
  
  // Calculate distance between organisms
  const distance = Math.sqrt(
    Math.pow(organism1.position.x - organism2.position.x, 2) + 
    Math.pow(organism1.position.y - organism2.position.y, 2)
  );
  
  // Must be close enough (within 15% of the ecosystem area)
  if (distance > 15) return false;
  
  return true;
}

// Create offspring from two parent organisms
export function createOffspring(parent1: Organism, parent2: Organism): Organism {
  // Create position between parents with small random offset
  const midX = (parent1.position.x + parent2.position.x) / 2 + (Math.random() * 6 - 3);
  const midY = (parent1.position.y + parent2.position.y) / 2 + (Math.random() * 6 - 3);
  
  // Clamp position to stay within boundaries
  const x = Math.max(5, Math.min(95, midX));
  const y = Math.max(5, Math.min(95, midY));
  
  // Inherit traits and adaptation from parents
  const type = parent1.type;
  const stage = 0; // Offspring starts at beginning stage
  
  // Inherit some adaptation points from parents (average of 20% of parents' points)
  const adaptationInheritance = 
    (parent1.adaptationPoints + parent2.adaptationPoints) * 0.1 * (0.8 + Math.random() * 0.4);
  
  // Higher stage parents produce more advanced offspring with higher initial adaptation
  const stageBonus = (parent1.stage + parent2.stage) * 5;
  
  // Get initial traits for this organism type
  const evolutionInfo = getEvolutionInfo(type, 0);
  
  // Create the new organism
  const offspring: Organism = {
    id: uuidv4(),
    type,
    position: { x, y },
    health: 80, // Start with good but not perfect health
    adaptationPoints: Math.min(adaptationInheritance + stageBonus, 100),
    stage: 0,
    traits: evolutionInfo.traits,
    birthTime: Date.now()
  };
  
  return offspring;
}

// Find potential mates for an organism
export function findPotentialMates(organism: Organism, allOrganisms: Organism[]): Organism[] {
  return allOrganisms.filter(other => 
    other.id !== organism.id && canReproduce(organism, other)
  );
}

// Calculate reproduction chance based on various factors
export function calculateReproductionChance(organism: Organism, mate: Organism, environmentFactor: number): number {
  // Base chance
  let chance = 0.2;
  
  // Health factor - healthier organisms reproduce more
  const healthFactor = ((organism.health + mate.health) / 2) / 100;
  chance *= healthFactor;
  
  // Environment factor (0-1 scale, higher is better)
  chance *= environmentFactor;
  
  // Species-specific modifiers
  switch (organism.type) {
    case "rabbit":
    case "fish":
      chance *= 1.5; // These reproduce faster
      break;
    case "fox":
    case "snake":
      chance *= 0.7; // Predators reproduce slower
      break;
    case "tree":
    case "grass":
    case "flower":
      chance *= 1.2; // Plants reproduce at medium rate
      break;
  }
  
  // Population control - harder to reproduce when many of same type exist
  // This will be handled in the main reproduction system
  
  return chance;
}
