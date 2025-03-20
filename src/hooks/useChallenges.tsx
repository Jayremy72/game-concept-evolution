
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Challenge, Achievement } from '@/types/challenges';
import { Organism } from '@/types/ecosystem';
import { useToast } from '@/hooks/use-toast';

// Initial set of challenges
const initialChallenges: Challenge[] = [
  {
    id: uuidv4(),
    title: 'Balanced Biodiversity',
    description: 'Maintain at least 3 different producer species and 2 different consumer species for 2 minutes.',
    type: 'balance',
    difficulty: 'easy',
    isActive: true,
    isCompleted: false,
    progress: 0,
    reward: {
      type: 'knowledge',
      value: 'symbiosis'
    },
    requiredConditions: {
      timeRequired: 120, // 2 minutes
      biodiversity: 5
    }
  },
  {
    id: uuidv4(),
    title: 'Weather the Storm',
    description: 'Keep your ecosystem alive during a severe drought (water level below 30%) for 1 minute.',
    type: 'environmental',
    difficulty: 'medium',
    isActive: false,
    isCompleted: false,
    progress: 0,
    reward: {
      type: 'trait',
      value: 'drought-master'
    },
    requiredConditions: {
      timeRequired: 60 // 1 minute
    }
  },
  {
    id: uuidv4(),
    title: 'Evolution Pioneer',
    description: 'Evolve 3 different species to their final stage.',
    type: 'research',
    difficulty: 'medium',
    isActive: false,
    isCompleted: false,
    progress: 0,
    reward: {
      type: 'species',
      value: 'apex-predator'
    },
    requiredConditions: {
      speciesCount: { 'evolved-stage-2': 3 }
    }
  },
];

// Initial achievements
const initialAchievements: Achievement[] = [
  {
    id: uuidv4(),
    title: 'First Steps',
    description: 'Create your first functioning ecosystem with at least 5 organisms.',
    isUnlocked: false,
    icon: '🌱',
    category: 'biodiversity',
    difficulty: 'bronze'
  },
  {
    id: uuidv4(),
    title: 'Master Ecologist',
    description: 'Maintain a perfectly balanced ecosystem with 100% health for 5 minutes.',
    isUnlocked: false,
    icon: '🏆',
    category: 'mastery',
    difficulty: 'gold'
  },
  {
    id: uuidv4(),
    title: 'Evolutionary Force',
    description: 'Help a species evolve to its final stage in under 3 minutes.',
    isUnlocked: false,
    icon: '🧬',
    category: 'evolution',
    difficulty: 'silver'
  },
  {
    id: uuidv4(),
    title: 'Survivor',
    description: 'Keep your ecosystem alive through all four seasons.',
    isUnlocked: false,
    icon: '🌍',
    category: 'survival',
    difficulty: 'silver'
  },
];

export function useChallenges(
  organisms: Organism[] = [],
  biomeHealth: number = 0,
  waterLevel: number = 50,
  sunlightLevel: number = 50,
  currentSeason: string = 'spring'
) {
  const { toast } = useToast();
  const [challenges, setChallenges] = useState<Challenge[]>(initialChallenges);
  const [activeChallenge, setActiveChallenge] = useState<Challenge | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>(initialAchievements);
  const [gameProgress, setGameProgress] = useState({
    level: 1,
    experiencePoints: 0,
    challengesCompleted: 0,
    achievementsUnlocked: 0,
    highestBiomeHealth: 0,
    speciesDiscovered: [] as string[],
    traitsUnlocked: [] as string[],
  });

  // Track seasons visited
  const [visitedSeasons, setVisitedSeasons] = useState<Set<string>>(new Set());

  // Update visited seasons
  useEffect(() => {
    if (currentSeason && organisms.length > 0) {
      setVisitedSeasons(prev => {
        const newSet = new Set(prev);
        newSet.add(currentSeason);
        return newSet;
      });
    }
  }, [currentSeason, organisms.length]);

  // Check for achievements
  useEffect(() => {
    const checkAchievements = () => {
      const updatedAchievements = [...achievements];
      let achievementsUnlocked = 0;

      // Check "First Steps" achievement
      const firstStepsAchievement = updatedAchievements.find(a => a.title === 'First Steps');
      if (firstStepsAchievement && !firstStepsAchievement.isUnlocked && organisms.length >= 5) {
        firstStepsAchievement.isUnlocked = true;
        firstStepsAchievement.unlockedAt = Date.now();
        achievementsUnlocked++;
        
        toast({
          title: '🎉 Achievement Unlocked!',
          description: `${firstStepsAchievement.title}: ${firstStepsAchievement.description}`,
          duration: 5000,
        });
      }

      // Check "Survivor" achievement
      const survivorAchievement = updatedAchievements.find(a => a.title === 'Survivor');
      if (survivorAchievement && !survivorAchievement.isUnlocked && visitedSeasons.size >= 4) {
        survivorAchievement.isUnlocked = true;
        survivorAchievement.unlockedAt = Date.now();
        achievementsUnlocked++;
        
        toast({
          title: '🏆 Achievement Unlocked!',
          description: `${survivorAchievement.title}: ${survivorAchievement.description}`,
          duration: 5000,
        });
      }

      // Check "Master Ecologist" achievement
      const masterAchievement = updatedAchievements.find(a => a.title === 'Master Ecologist');
      if (masterAchievement && !masterAchievement.isUnlocked && biomeHealth >= 95) {
        // We'll need to track duration in a separate effect, this is just a placeholder
        // Logic for checking 5 minutes will be added in stage 2
      }

      // Check "Evolutionary Force" achievement
      const evolutionAchievement = updatedAchievements.find(a => a.title === 'Evolutionary Force');
      if (evolutionAchievement && !evolutionAchievement.isUnlocked) {
        // Look for any stage 2 evolved organisms that evolved quickly
        // Will implement full tracking in stage 2
        const fullyEvolved = organisms.filter(org => org.stage === 2);
        if (fullyEvolved.length > 0) {
          // For now, we'll assume any stage 2 organism qualifies
          // In stage 2, we'll actually track the time it took to evolve
          evolutionAchievement.isUnlocked = true;
          evolutionAchievement.unlockedAt = Date.now();
          achievementsUnlocked++;
          
          toast({
            title: '🧬 Achievement Unlocked!',
            description: `${evolutionAchievement.title}: ${evolutionAchievement.description}`,
            duration: 5000,
          });
        }
      }

      if (achievementsUnlocked > 0) {
        setAchievements(updatedAchievements);
        setGameProgress(prev => ({
          ...prev,
          achievementsUnlocked: prev.achievementsUnlocked + achievementsUnlocked,
          experiencePoints: prev.experiencePoints + (achievementsUnlocked * 50)
        }));
      }
    };

    checkAchievements();
  }, [organisms, biomeHealth, visitedSeasons.size, toast, achievements]);

  // Update active challenge progress
  useEffect(() => {
    if (!activeChallenge) {
      // No active challenge, check if we should activate one
      const nextChallenge = challenges.find(c => c.isActive && !c.isCompleted);
      if (nextChallenge) {
        setActiveChallenge({
          ...nextChallenge,
          startTime: Date.now()
        });
        
        toast({
          title: '🔍 New Challenge Available!',
          description: `${nextChallenge.title}: ${nextChallenge.description}`,
          duration: 5000,
        });
      }
      return;
    }

    // Update progress for the active challenge
    const updateChallenge = () => {
      let progress = 0;
      let isCompleted = false;

      switch (activeChallenge.type) {
        case 'environmental':
          if (activeChallenge.title === 'Weather the Storm') {
            if (waterLevel < 30 && activeChallenge.startTime) {
              const timeSpent = (Date.now() - activeChallenge.startTime) / 1000;
              progress = Math.min(100, (timeSpent / (activeChallenge.requiredConditions.timeRequired || 60)) * 100);
              isCompleted = progress >= 100;
            } else {
              // Reset timer if conditions are not met
              setActiveChallenge(prev => prev ? { ...prev, startTime: Date.now() } : null);
            }
          }
          break;
        
        case 'balance':
          if (activeChallenge.title === 'Balanced Biodiversity') {
            const producers = organisms.filter(org => 
              ['tree', 'grass', 'flower', 'cactus', 'bush', 'seaweed', 'coral'].includes(org.type)
            );
            const uniqueProducers = new Set(producers.map(p => p.type));
            
            const consumers = organisms.filter(org => 
              ['rabbit', 'lizard', 'fish', 'fox', 'snake', 'crab'].includes(org.type)
            );
            const uniqueConsumers = new Set(consumers.map(c => c.type));
            
            if (uniqueProducers.size >= 3 && uniqueConsumers.size >= 2 && activeChallenge.startTime) {
              const timeSpent = (Date.now() - activeChallenge.startTime) / 1000;
              progress = Math.min(100, (timeSpent / (activeChallenge.requiredConditions.timeRequired || 120)) * 100);
              isCompleted = progress >= 100;
            } else {
              // Reset timer if conditions are not met
              setActiveChallenge(prev => prev ? { ...prev, startTime: Date.now() } : null);
            }
          }
          break;
        
        case 'research':
          if (activeChallenge.title === 'Evolution Pioneer') {
            const fullyEvolved = organisms.filter(org => org.stage === 2);
            const uniqueFullyEvolved = new Set(fullyEvolved.map(o => o.type));
            progress = Math.min(100, (uniqueFullyEvolved.size / 3) * 100);
            isCompleted = uniqueFullyEvolved.size >= 3;
          }
          break;
      }

      if (progress > 0 || isCompleted) {
        setActiveChallenge(prev => prev ? { ...prev, progress, isCompleted } : null);
        
        if (isCompleted) {
          toast({
            title: '🎉 Challenge Completed!',
            description: `You've completed "${activeChallenge.title}" and earned a reward!`,
            duration: 5000,
          });
          
          // Update challenges and game progress
          setChallenges(prevChallenges => 
            prevChallenges.map(c => 
              c.id === activeChallenge.id ? { ...c, isCompleted: true, progress: 100 } : c
            )
          );
          
          setGameProgress(prev => ({
            ...prev,
            challengesCompleted: prev.challengesCompleted + 1,
            experiencePoints: prev.experiencePoints + 100,
            level: Math.floor(prev.experiencePoints / 300) + 1
          }));
          
          // Activate next challenge
          const nextChallenge = challenges.find(c => !c.isActive && !c.isCompleted);
          if (nextChallenge) {
            setChallenges(prevChallenges => 
              prevChallenges.map(c => 
                c.id === nextChallenge.id ? { ...c, isActive: true } : c
              )
            );
          }
          
          // Clear active challenge after completion
          setActiveChallenge(null);
        }
      }
    };

    updateChallenge();
    
    // Update highest biome health if current is higher
    if (biomeHealth > gameProgress.highestBiomeHealth) {
      setGameProgress(prev => ({
        ...prev,
        highestBiomeHealth: biomeHealth
      }));
    }
    
  }, [activeChallenge, organisms, biomeHealth, waterLevel, challenges, toast]);

  return {
    challenges,
    activeChallenge,
    achievements,
    gameProgress,
    visitedSeasons: Array.from(visitedSeasons)
  };
}
