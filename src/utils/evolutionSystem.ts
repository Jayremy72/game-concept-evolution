
import { EvolutionMap } from "@/types/ecosystem";

// Define evolution paths for each organism type
export const evolutionPaths: EvolutionMap = {
  // Plants/Producers
  "tree": [
    { 
      stage: 0, 
      threshold: 0, 
      name: "Sapling", 
      icon: "🌱", 
      traits: ["basic"],
      description: "A young tree, vulnerable but growing." 
    },
    { 
      stage: 1, 
      threshold: 50, 
      name: "Mature Tree", 
      icon: "🌳", 
      traits: ["drought-resistant"],
      description: "A stronger tree with deeper roots, more resistant to drought." 
    },
    { 
      stage: 2, 
      threshold: 100, 
      name: "Ancient Tree", 
      icon: "🌲", 
      traits: ["drought-resistant", "nutrient-rich"],
      description: "A massive tree that enhances soil fertility and withstands harsh conditions." 
    }
  ],
  "grass": [
    { 
      stage: 0, 
      threshold: 0, 
      name: "Grass Sprout", 
      icon: "🌿", 
      traits: ["basic"],
      description: "Basic grass that provides food for herbivores." 
    },
    { 
      stage: 1, 
      threshold: 40, 
      name: "Wild Grass", 
      icon: "🌾", 
      traits: ["fast-growing"],
      description: "Grass that grows quickly, recovering faster from being eaten." 
    },
    { 
      stage: 2, 
      threshold: 80, 
      name: "Resilient Grass", 
      icon: "🌾", 
      traits: ["fast-growing", "heat-resistant"],
      description: "Hardy grass that thrives in heat and regrows quickly." 
    }
  ],
  "flower": [
    { 
      stage: 0, 
      threshold: 0, 
      name: "Bud", 
      icon: "🌸", 
      traits: ["basic"],
      description: "A simple flower that attracts insects." 
    },
    { 
      stage: 1, 
      threshold: 45, 
      name: "Vibrant Flower", 
      icon: "🌺", 
      traits: ["attractive"],
      description: "A colorful flower that attracts more pollinators." 
    },
    { 
      stage: 2, 
      threshold: 90, 
      name: "Hardy Bloom", 
      icon: "🌹", 
      traits: ["attractive", "water-efficient"],
      description: "A beautiful flower that requires less water to thrive." 
    }
  ],
  
  // Desert Plants
  "cactus": [
    { 
      stage: 0, 
      threshold: 0, 
      name: "Small Cactus", 
      icon: "🌵", 
      traits: ["water-storing"],
      description: "A small desert plant that stores water." 
    },
    { 
      stage: 1, 
      threshold: 40, 
      name: "Spiny Cactus", 
      icon: "🌵", 
      traits: ["water-storing", "defensive"],
      description: "A cactus with stronger protective spines." 
    },
    { 
      stage: 2, 
      threshold: 80, 
      name: "Towering Cactus", 
      icon: "🌵", 
      traits: ["water-storing", "defensive", "shade-providing"],
      description: "A massive cactus that provides shade for other desert life." 
    }
  ],
  
  // Aquatic Plants
  "seaweed": [
    { 
      stage: 0, 
      threshold: 0, 
      name: "Seaweed Shoot", 
      icon: "🌱", 
      traits: ["oxygen-producing"],
      description: "Young seaweed that oxygenates water." 
    },
    { 
      stage: 1, 
      threshold: 45, 
      name: "Kelp", 
      icon: "🌿", 
      traits: ["oxygen-producing", "habitat-forming"],
      description: "Larger seaweed that provides shelter for small sea creatures." 
    },
    { 
      stage: 2, 
      threshold: 90, 
      name: "Kelp Forest", 
      icon: "🌿", 
      traits: ["oxygen-producing", "habitat-forming", "current-resistant"],
      description: "Dense seaweed that creates an entire underwater ecosystem." 
    }
  ],
  
  // Animals
  "rabbit": [
    { 
      stage: 0, 
      threshold: 0, 
      name: "Young Rabbit", 
      icon: "🐰", 
      traits: ["herbivore"],
      description: "A basic rabbit that eats plants." 
    },
    { 
      stage: 1, 
      threshold: 50, 
      name: "Swift Rabbit", 
      icon: "🐇", 
      traits: ["herbivore", "fast"],
      description: "A quicker rabbit that can better escape predators." 
    },
    { 
      stage: 2, 
      threshold: 100, 
      name: "Desert Hare", 
      icon: "🐇", 
      traits: ["herbivore", "fast", "water-efficient"],
      description: "A rabbit adapted to survive with minimal water." 
    }
  ],
  "fox": [
    { 
      stage: 0, 
      threshold: 0, 
      name: "Fox Kit", 
      icon: "🦊", 
      traits: ["predator"],
      description: "A young fox learning to hunt." 
    },
    { 
      stage: 1, 
      threshold: 60, 
      name: "Cunning Fox", 
      icon: "🦊", 
      traits: ["predator", "efficient-hunter"],
      description: "A skilled hunter that wastes less energy when hunting." 
    },
    { 
      stage: 2, 
      threshold: 120, 
      name: "Alpha Fox", 
      icon: "🦊", 
      traits: ["predator", "efficient-hunter", "adaptable-diet"],
      description: "A fox that can survive on various food sources when prey is scarce." 
    }
  ],
  
  // Desert Animals
  "lizard": [
    { 
      stage: 0, 
      threshold: 0, 
      name: "Small Lizard", 
      icon: "🦎", 
      traits: ["heat-resistant"],
      description: "A lizard adapted to hot environments." 
    },
    { 
      stage: 1, 
      threshold: 50, 
      name: "Desert Lizard", 
      icon: "🦎", 
      traits: ["heat-resistant", "water-efficient"],
      description: "A lizard that requires very little water." 
    },
    { 
      stage: 2, 
      threshold: 100, 
      name: "Armored Lizard", 
      icon: "🦎", 
      traits: ["heat-resistant", "water-efficient", "protective-scales"],
      description: "A lizard with tough scales for protection and water conservation." 
    }
  ],
  
  // Decomposers
  "fungi": [
    { 
      stage: 0, 
      threshold: 0, 
      name: "Mushroom", 
      icon: "🍄", 
      traits: ["decomposer"],
      description: "Basic fungi that breaks down dead matter." 
    },
    { 
      stage: 1, 
      threshold: 40, 
      name: "Spread Fungi", 
      icon: "🍄", 
      traits: ["decomposer", "far-reaching"],
      description: "Fungi with an extensive mycelium network." 
    },
    { 
      stage: 2, 
      threshold: 80, 
      name: "Robust Fungi", 
      icon: "🍄", 
      traits: ["decomposer", "far-reaching", "toxin-resistant"],
      description: "Fungi that can break down even toxic compounds." 
    }
  ],
};

// Get the next evolution stage for an organism
export const getNextEvolutionStage = (type: string, currentStage: number, adaptationPoints: number): number => {
  const stages = evolutionPaths[type] || [];
  if (currentStage >= stages.length - 1) {
    return currentStage; // Already at max evolution
  }
  
  const nextStage = stages[currentStage + 1];
  if (adaptationPoints >= nextStage.threshold) {
    return currentStage + 1;
  }
  
  return currentStage;
};

// Get evolution information for an organism
export const getEvolutionInfo = (type: string, stage: number): EvolutionStage => {
  const stages = evolutionPaths[type] || [];
  return stages[stage] || { 
    stage: 0, 
    threshold: 0, 
    name: type, 
    icon: "❓", 
    traits: ["unknown"],
    description: "Unknown species" 
  };
};

// Calculate adaptation points gain based on environmental stress
export const calculateAdaptationGain = (
  organism: { type: string; health: number; },
  waterLevel: number, 
  sunlightLevel: number,
  biomeType: string
): number => {
  let stress = 0;
  let adaptationGain = 0;
  
  // Only living organisms under stress gain adaptation points
  if (organism.health <= 0 || organism.health > 90) {
    return 0;
  }
  
  // Calculate environmental stress
  switch (organism.type) {
    case "tree":
    case "grass":
    case "flower":
      // Plants stress from water and sunlight extremes
      if (waterLevel < 30) stress += (30 - waterLevel) / 10;
      if (sunlightLevel < 30) stress += (30 - sunlightLevel) / 10;
      if (sunlightLevel > 80) stress += (sunlightLevel - 80) / 10;
      
      // Additional stress in non-native biomes
      if (biomeType !== "forest") stress += 1;
      break;
      
    case "cactus":
    case "bush":
      // Desert plants stress from too much water
      if (waterLevel > 60) stress += (waterLevel - 60) / 10;
      if (sunlightLevel < 50) stress += (50 - sunlightLevel) / 10;
      
      // Additional stress in non-native biomes
      if (biomeType !== "desert") stress += 1;
      break;
      
    case "seaweed":
    case "coral":
      // Aquatic plants stress from too little water
      if (waterLevel < 70) stress += (70 - waterLevel) / 5;
      
      // Additional stress in non-native biomes
      if (biomeType !== "ocean") stress += 2;
      break;
      
    case "rabbit":
    case "fox":
      // Forest animals stress in extreme conditions
      if (waterLevel < 20) stress += (20 - waterLevel) / 5;
      if (sunlightLevel > 90) stress += (sunlightLevel - 90) / 10;
      
      // Additional stress in non-native biomes
      if (biomeType !== "forest") stress += 1;
      break;
      
    case "lizard":
    case "snake":
      // Desert animals stress from too much water
      if (waterLevel > 50) stress += (waterLevel - 50) / 10;
      if (sunlightLevel < 40) stress += (40 - sunlightLevel) / 10;
      
      // Additional stress in non-native biomes
      if (biomeType !== "desert") stress += 1;
      break;
  }
  
  // Organisms under moderate stress gain adaptation points
  // Too much stress is bad, moderate stress drives evolution
  if (stress > 0 && stress < 5) {
    adaptationGain = stress * 0.5; // Convert stress to adaptation gain
  }
  
  return Math.round(adaptationGain * 10) / 10; // Round to one decimal place
};
