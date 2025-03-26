
import React from "react";
import { Organism } from "@/types/ecosystem";
import { useEcosystemStats } from "@/hooks/useEcosystemStats";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface StatsPanelProps {
  organisms: Organism[];
  biomeHealth: number;
  waterLevel: number;
  sunlightLevel: number;
}

// Define colors for different organism types
const COLORS = {
  tree: "#2E7D32",
  grass: "#66BB6A",
  flower: "#F48FB1",
  cactus: "#B26A00",
  bush: "#558B2F",
  seaweed: "#00695C",
  coral: "#EF6C00",
  rabbit: "#A1887F",
  fox: "#FF5722",
  lizard: "#795548",
  snake: "#607D8B",
  fish: "#0288D1",
  crab: "#D32F2F",
  fungi: "#8E24AA",
  beetle: "#4527A0",
  starfish: "#FFD54F",
};

const StatsPanel: React.FC<StatsPanelProps> = ({
  organisms,
  biomeHealth,
  waterLevel,
  sunlightLevel,
}) => {
  // Use the hook to track ecosystem statistics
  const { stats, getRecentStats } = useEcosystemStats(
    organisms,
    biomeHealth,
    waterLevel,
    sunlightLevel
  );

  // Get stats for the last 5 minutes
  const recentStats = getRecentStats(5);

  // Prepare data for population chart
  const populationData = recentStats.map((stat) => ({
    time: new Date(stat.timestamp).toLocaleTimeString(),
    population: stat.organismCount,
    biomeHealth: stat.biomeHealth,
    water: stat.waterLevel,
    sunlight: stat.sunlightLevel,
  }));

  // Prepare data for species distribution pie chart
  const getSpeciesDistribution = () => {
    if (recentStats.length === 0) return [];

    const latestStat = recentStats[recentStats.length - 1];
    return Object.entries(latestStat.speciesDistribution).map(
      ([name, value]) => ({
        name,
        value,
      })
    );
  };

  const speciesDistribution = getSpeciesDistribution();

  // Prepare data for adaptation chart
  const adaptationData = recentStats.map((stat) => ({
    time: new Date(stat.timestamp).toLocaleTimeString(),
    adaptation: stat.averageAdaptation,
  }));

  return (
    <div className="p-4 bg-white dark:bg-gray-800 h-full overflow-y-auto">
      <h2 className="text-2xl font-bold mb-4">Ecosystem Statistics</h2>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="population">Population</TabsTrigger>
          <TabsTrigger value="adaptation">Adaptation</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Current Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Organisms:
                    </span>
                    <span className="font-medium">{organisms.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Biome Health:
                    </span>
                    <span className="font-medium">{Math.round(biomeHealth)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Water Level:
                    </span>
                    <span className="font-medium">{Math.round(waterLevel)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Sunlight Level:
                    </span>
                    <span className="font-medium">{Math.round(sunlightLevel)}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Species Distribution</CardTitle>
              </CardHeader>
              <CardContent className="h-[200px] flex items-center justify-center">
                {speciesDistribution.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={speciesDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) =>
                          `${name} (${Math.round(percent * 100)}%)`
                        }
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {speciesDistribution.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[entry.name as keyof typeof COLORS] || "#8884d8"}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center text-gray-500">
                    No data available
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="population" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Population Over Time</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              {populationData.length > 1 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={populationData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="time"
                      minTickGap={15}
                      tickFormatter={(value) => {
                        return value.split(":").slice(0, 2).join(":");
                      }}
                    />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="population"
                      stroke="#3B82F6"
                      name="Population"
                      activeDot={{ r: 8 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="biomeHealth"
                      stroke="#10B981"
                      name="Biome Health"
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500">
                  Not enough data points to plot a graph.
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Environmental Factors</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              {populationData.length > 1 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={populationData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="time"
                      minTickGap={15}
                      tickFormatter={(value) => {
                        return value.split(":").slice(0, 2).join(":");
                      }}
                    />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="water"
                      stroke="#0EA5E9"
                      name="Water Level"
                    />
                    <Line
                      type="monotone"
                      dataKey="sunlight"
                      stroke="#F59E0B"
                      name="Sunlight Level"
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500">
                  Not enough data points to plot a graph.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="adaptation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Average Adaptation Over Time</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              {adaptationData.length > 1 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={adaptationData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="time"
                      minTickGap={15}
                      tickFormatter={(value) => {
                        return value.split(":").slice(0, 2).join(":");
                      }}
                    />
                    <YAxis domain={[0, "dataMax + 10"]} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="adaptation"
                      stroke="#8B5CF6"
                      name="Avg. Adaptation Points"
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500">
                  Not enough data points to plot a graph.
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Evolution Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[200px]">
                <div className="space-y-4">
                  {organisms.length > 0 ? (
                    <EvolutionProgress organisms={organisms} />
                  ) : (
                    <div className="text-center text-gray-500">
                      No organisms to show evolution progress
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Evolution Progress component to show each organism's stage
const EvolutionProgress = ({ organisms }: { organisms: Organism[] }) => {
  // Group organisms by type
  const organizedOrganisms = organisms.reduce((acc, org) => {
    if (!acc[org.type]) {
      acc[org.type] = [];
    }
    acc[org.type].push(org);
    return acc;
  }, {} as Record<string, Organism[]>);

  return (
    <div className="space-y-4">
      {Object.entries(organizedOrganisms).map(([type, orgs]) => {
        const stages = [0, 0, 0]; // Count for each stage (0, 1, 2)
        
        // Count organisms at each stage
        orgs.forEach(org => {
          if (org.stage >= 0 && org.stage < 3) {
            stages[org.stage]++;
          }
        });
        
        const totalOrgs = orgs.length;
        
        return (
          <div key={type} className="bg-gray-50 dark:bg-gray-900 p-3 rounded-md">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">{type.charAt(0).toUpperCase() + type.slice(1)}</span>
              <span className="text-sm">{totalOrgs} organisms</span>
            </div>
            
            <div className="space-y-2">
              {stages.map((count, stageIndex) => (
                <div key={`${type}-stage-${stageIndex}`} className="flex items-center">
                  <span className="text-xs w-16">Stage {stageIndex + 1}:</span>
                  <div className="flex-1 bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        stageIndex === 0
                          ? "bg-blue-500"
                          : stageIndex === 1
                          ? "bg-green-500"
                          : "bg-purple-500"
                      }`}
                      style={{
                        width: `${totalOrgs ? (count / totalOrgs) * 100 : 0}%`,
                      }}
                    ></div>
                  </div>
                  <span className="text-xs ml-2 w-6 text-right">{count}</span>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsPanel;
