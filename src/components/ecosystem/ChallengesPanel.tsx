
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Challenge, Achievement } from '@/types/challenges';
import { Trophy, Target, Award, Star } from 'lucide-react';

interface ChallengesPanelProps {
  activeChallenge: Challenge | null;
  challenges: Challenge[];
  achievements: Achievement[];
  gameProgress: {
    level: number;
    experiencePoints: number;
    challengesCompleted: number;
    achievementsUnlocked: number;
  };
}

const ChallengesPanel: React.FC<ChallengesPanelProps> = ({
  activeChallenge,
  challenges,
  achievements,
  gameProgress
}) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'hard':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'bronze':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300';
      case 'silver':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      case 'gold':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'environmental':
        return <span className="mr-1">🌧️</span>;
      case 'research':
        return <span className="mr-1">🔬</span>;
      case 'conservation':
        return <span className="mr-1">🌿</span>;
      case 'balance':
        return <span className="mr-1">⚖️</span>;
      default:
        return <span className="mr-1">🎯</span>;
    }
  };

  return (
    <div className="space-y-6 p-4 overflow-y-auto">
      {/* Player Level */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-medium">Player Level {gameProgress.level}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Experience: {gameProgress.experiencePoints} / {gameProgress.level * 300}
          </p>
        </div>
        <Badge variant="outline" className="text-lg px-3 py-1">
          <Trophy className="w-4 h-4 mr-1" />
          {gameProgress.achievementsUnlocked} / {achievements.length}
        </Badge>
      </div>
      
      {/* XP Progress */}
      <Progress 
        value={(gameProgress.experiencePoints % 300) / 3} 
        className="h-2 mb-6" 
      />

      {/* Active Challenge */}
      {activeChallenge && (
        <Card className="border-2 border-primary animate-pulse">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg flex items-center">
                <Target className="w-5 h-5 mr-2 text-primary" />
                {activeChallenge.title}
              </CardTitle>
              <Badge className={getDifficultyColor(activeChallenge.difficulty)}>
                {activeChallenge.difficulty}
              </Badge>
            </div>
            <CardDescription>{activeChallenge.description}</CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <Progress value={activeChallenge.progress} className="h-2 mt-2" />
            <p className="text-right text-xs mt-1">{Math.round(activeChallenge.progress)}%</p>
          </CardContent>
          <CardFooter className="pt-0">
            <div className="flex items-center text-sm">
              <span className="font-medium mr-1">Reward:</span>
              <span>{activeChallenge.reward.type}: {activeChallenge.reward.value}</span>
            </div>
          </CardFooter>
        </Card>
      )}

      {/* Challenge List */}
      <div>
        <h3 className="font-medium flex items-center mb-2">
          <Target className="w-4 h-4 mr-2" />
          Challenges
        </h3>
        <div className="space-y-3">
          {challenges.filter(c => !c.isCompleted).map(challenge => (
            <div 
              key={challenge.id} 
              className={`p-3 rounded-lg border ${challenge.isActive && !activeChallenge ? 'border-primary' : 'border-gray-200 dark:border-gray-700'} bg-white dark:bg-gray-800`}
            >
              <div className="flex justify-between items-start">
                <h4 className="font-medium flex items-center">
                  {getTypeIcon(challenge.type)}
                  {challenge.title}
                </h4>
                <Badge className={getDifficultyColor(challenge.difficulty)}>
                  {challenge.difficulty}
                </Badge>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {challenge.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Achievements */}
      <div>
        <h3 className="font-medium flex items-center mb-2">
          <Award className="w-4 h-4 mr-2" />
          Achievements
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {achievements.map(achievement => (
            <div 
              key={achievement.id} 
              className={`p-3 rounded-lg border ${achievement.isUnlocked ? 'bg-primary/10 border-primary' : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'}`}
            >
              <div className="flex items-start gap-3">
                <div className="text-2xl">{achievement.icon}</div>
                <div>
                  <div className="flex items-center">
                    <h4 className="font-medium">
                      {achievement.title}
                    </h4>
                    {achievement.isUnlocked && <Star className="w-3 h-3 ml-1 text-yellow-400 fill-yellow-400" />}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {achievement.description}
                  </p>
                  <Badge className={`mt-2 ${getDifficultyColor(achievement.difficulty)}`}>
                    {achievement.difficulty}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChallengesPanel;
