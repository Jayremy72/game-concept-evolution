import { useState, useEffect, useRef } from "react";
import { Organism, OrganismMovement, FeedingEvent, OrganismInteraction } from "@/types/ecosystem";
import { v4 as uuidv4 } from "uuid";
import { 
  getNextEvolutionStage, 
  getEvolutionInfo, 
  calculateAdaptationGain 
} from "@/utils/evolutionSystem";
import {
  findPotentialMates,
  createOffspring,
  calculateReproductionChance,
  ReproductionEvent
} from "@/utils/reproductionSystem";
import { useSeasons } from "@/hooks/useSeasons";
import { toast } from "sonner";

interface OrganismPosition {
  x: number;
  y: number;
}

export function useBiome() {
  const [biome, setBiome] = useState<string>("forest");
  const [biomeHealth, setBiomeHealth] = useState<number>(75);
  const [organisms, setOrganisms] = useState<Organism[]>([]);
  const [waterLevel, setWaterLevel] = useState<number>(50);
  const [sunlightLevel, setSunlightLevel] = useState<number>(60);
  const [simulationSpeed, setSimulationSpeed] = useState<number>(5);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [reproductionEvents, setReproductionEvents] = useState<ReproductionEvent[]>([]);
  const [movementEvents, setMovementEvents] = useState<OrganismMovement[]>([]);
  const [feedingEvents, setFeedingEvents] = useState<FeedingEvent[]>([]);
  const [organismInteractions, setOrganismInteractions] = useState<OrganismInteraction[]>([]);
  
  const reproductionCooldowns = useRef<Map<string, number>>(new Map());
  const movementCooldowns = useRef<Map<string, number>>(new Map());
  const feedingCooldowns = useRef<Map<string, number>>(new Map());
  
  const { 
    currentSeason, 
    seasonData 
  } = useSeasons(simulationSpeed);
  
  useEffect(() => {
    if (reproductionEvents.length === 0) return;
    
    const interval = setInterval(() => {
      const now = Date.now();
      setReproductionEvents(prev => 
        prev.filter(event => now - event.timestamp < 3000)
      );
      setFeedingEvents(prev =>
        prev.filter(event => now - event.timestamp < 2000)
      );
      setOrganismInteractions(prev =>
        prev.filter(event => now - event.timestamp < 5000)
      );
    }, 1000);
    
    return () => clearInterval(interval);
  }, [reproductionEvents, feedingEvents, organismInteractions]);
  
  useEffect(() => {
    if (isPaused) return;
    
    const intervalDuration = 2000 / simulationSpeed;
    
    const intervalId = setInterval(() => {
      const seasonalWaterLevel = Math.max(0, Math.min(100, waterLevel + seasonData.waterModifier));
      const seasonalSunlightLevel = Math.max(0, Math.min(100, sunlightLevel + seasonData.sunlightModifier));
      const now = Date.now();
      
      const updatedMovementEvents: OrganismMovement[] = [];
      const newFeedingEvents: FeedingEvent[] = [];
      const newInteractions: OrganismInteraction[] = [];
      
      const updatedOrganisms = organisms.map(org => {
        let healthChange = 0;
        let adaptationGain = 0;
        let newPosition = { ...org.position };
        let newTargetPosition = org.targetPosition;
        let isHunting = false;
        
        const isAnimal = ["rabbit", "lizard", "fish", "fox", "snake", "crab"].includes(org.type);
        const hunger = (org.hunger || 0) + (isAnimal ? 1 : 0);
        
        if (isAnimal && (!movementCooldowns.current.get(org.id) || now - (movementCooldowns.current.get(org.id) || 0) > 5000 / simulationSpeed)) {
          if (!newTargetPosition || Math.random() < 0.2) {
            newTargetPosition = {
              x: Math.max(5, Math.min(95, org.position.x + (Math.random() * 30 - 15))),
              y: Math.max(5, Math.min(95, org.position.y + (Math.random() * 30 - 15)))
            };
            
            if (["fox", "snake", "crab"].includes(org.type) && hunger > 40) {
              const prey = organisms.find(o => 
                (org.type === "fox" && ["rabbit"].includes(o.type)) ||
                (org.type === "snake" && ["lizard"].includes(o.type)) ||
                (org.type === "crab" && ["fish"].includes(o.type))
              );
              
              if (prey) {
                newTargetPosition = { ...prey.position };
                isHunting = true;
              }
            }
            
            updatedMovementEvents.push({
              organismId: org.id,
              startPosition: org.position,
              targetPosition: newTargetPosition,
              startTime: now,
              duration: 5000 / simulationSpeed
            });
            
            movementCooldowns.current.set(org.id, now);
          }
        }
        
        switch (org.type) {
          case "tree":
          case "grass":
          case "flower":
          case "cactus":
          case "bush":
          case "seaweed":
          case "coral":
            if (seasonalSunlightLevel > 70) healthChange += 2;
            else if (seasonalSunlightLevel < 30) healthChange -= 2;
            
            if (seasonalWaterLevel > 60) healthChange += 2;
            else if (seasonalWaterLevel < 30) healthChange -= 3;
            
            healthChange *= seasonData.growthModifier;
            break;
            
          case "rabbit":
          case "lizard":
          case "fish":
            if (hasFood) {
              if (hunger > 50 && Math.random() < 0.3) {
                const foodSource = organisms.find(o => 
                  ["tree", "grass", "flower", "cactus", "bush", "seaweed", "coral"].includes(o.type)
                );
                
                if (foodSource) {
                  const distance = Math.sqrt(
                    Math.pow(org.position.x - foodSource.position.x, 2) + 
                    Math.pow(org.position.y - foodSource.position.y, 2)
                  );
                  
                  if (distance < 15) {
                    healthChange += 5;
                    
                    newFeedingEvents.push({
                      predatorId: org.id,
                      preyId: foodSource.id,
                      position: org.position,
                      timestamp: now
                    });
                    
                    newInteractions.push({
                      type: 'feeding',
                      organisms: [org.id, foodSource.id],
                      position: org.position,
                      timestamp: now,
                      result: 'success'
                    });
                    
                    movementCooldowns.current.set(org.id, now + 3000);
                    feedingCooldowns.current.set(org.id, now);
                  } else {
                    newTargetPosition = foodSource.position;
                  }
                }
              } else {
                healthChange += 1;
              }
            } else {
              healthChange -= 3;
            }
            
            if (seasonalWaterLevel < 20) healthChange -= 2;
            
            if (currentSeason === "winter") healthChange -= 1;
            break;
            
          case "fox":
          case "snake":
          case "crab":
            if (hasPrey && hunger > 60) {
              const prey = organisms.find(o => 
                (org.type === "fox" && ["rabbit"].includes(o.type)) ||
                (org.type === "snake" && ["lizard"].includes(o.type)) ||
                (org.type === "crab" && ["fish"].includes(o.type))
              );
              
              if (prey) {
                const distance = Math.sqrt(
                  Math.pow(org.position.x - prey.position.x, 2) + 
                  Math.pow(org.position.y - prey.position.y, 2)
                );
                
                if (distance < 10 && Math.random() < 0.5) {
                  healthChange += 10;
                  
                  newFeedingEvents.push({
                    predatorId: org.id,
                    preyId: prey.id,
                    position: org.position,
                    timestamp: now
                  });
                  
                  newInteractions.push({
                    type: 'feeding',
                    organisms: [org.id, prey.id],
                    position: org.position,
                    timestamp: now,
                    result: 'predator success'
                  });
                  
                  movementCooldowns.current.set(org.id, now + 5000);
                  feedingCooldowns.current.set(org.id, now);
                } else {
                  newTargetPosition = prey.position;
                }
              }
            } else if (hasPrey) {
              healthChange += 1;
            } else {
              healthChange -= 2;
            }
            
            if (currentSeason === "winter") healthChange -= 0.5;
            break;
            
          case "fungi":
          case "beetle":
          case "starfish":
            const hasDeadMatter = organisms.some(o => o.health < 30);
            if (hasDeadMatter) healthChange += 2;
            
            if (seasonalWaterLevel > 40) healthChange += 1;
            
            if (currentSeason === "autumn") healthChange += 1;
            break;
        }
        
        if (org.traits.includes("drought-resistant") && seasonalWaterLevel < 30) {
          healthChange += 2;
        }
        
        if (org.traits.includes("heat-resistant") && seasonalSunlightLevel > 80) {
          healthChange += 2;
        }
        
        if (org.traits.includes("water-efficient")) {
          if (seasonalWaterLevel < 40) healthChange += 1;
        }
        
        if (org.traits.includes("fast-growing") && org.health < 50) {
          healthChange += 1;
        }
        
        healthChange += Math.random() * 2 - 1;
        
        if (org.health > 20 && org.health < 80) {
          adaptationGain = calculateAdaptationGain(org, seasonalWaterLevel, seasonalSunlightLevel, biome);
          
          if (
            (currentSeason === "winter" && ["tree", "grass", "flower"].includes(org.type)) ||
            (currentSeason === "summer" && ["rabbit", "fox"].includes(org.type))
          ) {
            adaptationGain *= 1.5;
          }
        }
        
        const newAdaptationPoints = org.adaptationPoints + adaptationGain;
        const nextStage = getNextEvolutionStage(org.type, org.stage, newAdaptationPoints);
        
        let newTraits = [...org.traits];
        if (nextStage > org.stage) {
          const evolutionInfo = getEvolutionInfo(org.type, nextStage);
          newTraits = evolutionInfo.traits;
        }
        
        return {
          ...org,
          health: Math.max(0, Math.min(100, org.health + healthChange)),
          adaptationPoints: newAdaptationPoints,
          stage: nextStage,
          traits: newTraits,
          position: newPosition,
          targetPosition: newTargetPosition,
          hunger: Math.max(0, Math.min(100, hunger)),
          lastMealTime: isHunting ? org.lastMealTime : now,
          age: ((org.age || 0) + intervalDuration / 1000)
        };
      });
      
      const livingOrganisms = updatedOrganisms.filter(org => org.health > 0);
      
      const newOffspring: Organism[] = [];
      const newReproductionEvents: ReproductionEvent[] = [];
      
      const environmentFactor = calculateEnvironmentSuitability(seasonalWaterLevel, seasonalSunlightLevel, currentSeason);
      
      const typeCount = livingOrganisms.reduce((counts, org) => {
        counts[org.type] = (counts[org.type] || 0) + 1;
        return counts;
      }, {} as Record<string, number>);
      
      livingOrganisms.forEach(organism => {
        const lastReproduction = reproductionCooldowns.current.get(organism.id) || 0;
        if (now - lastReproduction < 10000 / simulationSpeed) return;
        
        const maxPopulation = getMaxPopulation(organism.type);
        if ((typeCount[organism.type] || 0) >= maxPopulation) return;
        
        if (organism.health < 70) return;
        
        const mates = findPotentialMates(organism, livingOrganisms);
        
        if (mates.length > 0) {
          const mate = mates[Math.floor(Math.random() * mates.length)];
          
          const reproductionChance = calculateReproductionChance(
            organism, 
            mate, 
            environmentFactor
          ) * (simulationSpeed / 5);
          
          if (Math.random() < reproductionChance) {
            const offspring = createOffspring(organism, mate);
            newOffspring.push(offspring);
            
            reproductionCooldowns.current.set(organism.id, now);
            reproductionCooldowns.current.set(mate.id, now);
            
            newReproductionEvents.push({
              id: uuidv4(),
              position: offspring.position,
              timestamp: now,
              type: organism.type
            });
            
            organism.health = Math.max(40, organism.health - 10);
            mate.health = Math.max(40, mate.health - 10);
            
            if (offspring && (!typeCount[offspring.type] || typeCount[offspring.type] < 3)) {
              toast.success(`New ${offspring.type} born!`, {
                description: "Your ecosystem is growing through natural reproduction."
              });
            }
          }
        }
      });
      
      if (newOffspring.length > 0) {
        setOrganisms([...livingOrganisms, ...newOffspring]);
      } else {
        setOrganisms(livingOrganisms);
      }
      
      if (newReproductionEvents.length > 0) {
        setReproductionEvents(prev => [...prev, ...newReproductionEvents]);
      }
      
      if (updatedMovementEvents.length > 0) {
        setMovementEvents(prev => [...prev.filter(e => now - e.startTime < e.duration), ...updatedMovementEvents]);
      }
      
      if (newFeedingEvents.length > 0) {
        setFeedingEvents(prev => [...prev, ...newFeedingEvents]);
      }
      
      if (newInteractions.length > 0) {
        setOrganismInteractions(prev => [...prev, ...newInteractions]);
      }
      
      const totalHealth = livingOrganisms.reduce((sum, org) => sum + org.health, 0);
      const averageHealth = livingOrganisms.length > 0 ? totalHealth / livingOrganisms.length : 0;
      
      const producerCount = livingOrganisms.filter(org => 
        ["tree", "grass", "flower", "cactus", "bush", "seaweed", "coral"].includes(org.type)
      ).length;
      
      const consumerCount = livingOrganisms.filter(org => 
        ["rabbit", "lizard", "fish", "fox", "snake", "crab"].includes(org.type)
      ).length;
      
      const decomposerCount = livingOrganisms.filter(org => 
        ["fungi", "beetle", "starfish"].includes(org.type)
      ).length;
      
      let balanceScore = 0;
      
      if (producerCount > 0) balanceScore += 25;
      if (consumerCount > 0) balanceScore += 25;
      if (decomposerCount > 0) balanceScore += 25;
      
      if (producerCount >= consumerCount * 2) balanceScore += 25;
      else if (consumerCount > producerCount) balanceScore -= 25;
      
      const newBiomeHealth = Math.max(10, Math.min(100, 
        averageHealth * 0.4 + balanceScore * 0.6
      ));
      
      setBiomeHealth(newBiomeHealth);
    }, intervalDuration);
    
    return () => clearInterval(intervalId);
  }, [organisms, waterLevel, sunlightLevel, biome, simulationSpeed, isPaused, currentSeason, seasonData]);

  const calculateEnvironmentSuitability = (water: number, sunlight: number, season: string): number => {
    let suitability = 0.7;
    
    if (water < 30 || water > 70) {
      suitability *= 0.7;
    }
    
    if (sunlight < 40 || sunlight > 80) {
      suitability *= 0.8;
    }
    
    switch (season) {
      case "spring":
        suitability *= 1.5;
        break;
      case "winter":
        suitability *= 0.4;
        break;
      case "autumn":
        suitability *= 0.7;
        break;
    }
    
    return Math.min(suitability, 1.0);
  };
  
  const getMaxPopulation = (type: string): number => {
    switch (type) {
      case "tree":
      case "grass":
      case "flower":
      case "cactus":
      case "bush":
      case "seaweed":
      case "coral":
        return 20;
      case "rabbit":
      case "lizard":
      case "fish":
        return 15;
      case "fox":
      case "snake":
      case "crab":
        return 10;
      case "fungi":
      case "beetle":
      case "starfish":
        return 12;
      default:
        return 10;
    }
  };

  const addOrganism = (type: string, position: OrganismPosition): boolean => {
    const isPositionOccupied = organisms.some(org => {
      const distance = Math.sqrt(
        Math.pow(org.position.x - position.x, 2) + 
        Math.pow(org.position.y - position.y, 2)
      );
      return distance < 10;
    });
    
    if (isPositionOccupied) {
      return false;
    }
    
    const seasonalWaterLevel = Math.max(0, Math.min(100, waterLevel + seasonData.waterModifier));
    const seasonalSunlightLevel = Math.max(0, Math.min(100, sunlightLevel + seasonData.sunlightModifier));
    
    let canSurvive = true;
    
    switch (type) {
      case "tree":
      case "flower":
        if (seasonalWaterLevel < 30 || seasonalSunlightLevel < 40) canSurvive = false;
        if (currentSeason === "winter") canSurvive = false;
        break;
      case "cactus":
        if (seasonalWaterLevel > 50) canSurvive = false;
        break;
      case "coral":
        if (seasonalWaterLevel < 70) canSurvive = false;
        break;
    }
    
    if (!canSurvive) {
      return false;
    }
    
    const evolutionInfo = getEvolutionInfo(type, 0);
    
    let movementSpeed = 0;
    if (["rabbit", "lizard", "fish", "fox", "snake", "crab"].includes(type)) {
      movementSpeed = 5 + Math.random() * 5;
      
      if (["rabbit", "fox"].includes(type)) {
        movementSpeed += 3;
      }
    }
    
    const newOrganism: Organism = {
      id: uuidv4(),
      type,
      position,
      health: 100,
      adaptationPoints: 0,
      stage: 0,
      traits: evolutionInfo.traits,
      birthTime: Date.now(),
      movementSpeed,
      hunger: 0,
      age: 0
    };
    
    setOrganisms(prev => [...prev, newOrganism]);
    return true;
  };

  const removeOrganism = (id: string) => {
    setOrganisms(prev => prev.filter(org => org.id !== id));
  };

  const adjustWater = (level: number) => {
    setWaterLevel(level);
  };

  const adjustSunlight = (level: number) => {
    setSunlightLevel(level);
  };

  const adjustSimulationSpeed = (speed: number) => {
    setSimulationSpeed(speed);
  };

  const togglePause = () => {
    setIsPaused(prev => !prev);
  };

  return {
    biome,
    biomeHealth,
    organisms,
    waterLevel,
    sunlightLevel,
    simulationSpeed,
    isPaused,
    reproductionEvents,
    movementEvents,
    feedingEvents,
    organismInteractions,
    addOrganism,
    removeOrganism,
    adjustWater,
    adjustSunlight,
    adjustSimulationSpeed,
    togglePause
  };
}
