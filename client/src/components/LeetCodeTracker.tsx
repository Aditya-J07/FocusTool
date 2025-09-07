import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { RefreshCw } from "lucide-react";
import { queryClient } from "@/lib/queryClient";

interface LeetCodeTrackerProps {
  username: string;
}

export default function LeetCodeTracker({ username }: LeetCodeTrackerProps) {
  const { data, isLoading, error, refetch, isRefetching } = useQuery({
    queryKey: ['/api/leetcode', username],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['/api/leetcode', username] });
    refetch();
  };

  const progressPercentage = data ? ((data as any).todaysSolved / (data as any).dailyTarget) * 100 : 0;
  const isTargetMet = data ? (data as any).todaysSolved >= (data as any).dailyTarget : false;

  if (error) {
    return (
      <Card data-testid="leetcode-tracker">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground flex items-center">
              <i className="fas fa-code text-primary mr-2"></i>
              LeetCode Progress
            </h3>
          </div>
          <div className="text-center text-destructive">
            <p>Failed to load LeetCode stats</p>
            <Button 
              onClick={handleRefresh} 
              variant="outline" 
              size="sm" 
              className="mt-2"
              data-testid="button-refresh-leetcode"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card data-testid="leetcode-tracker">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground flex items-center">
            <i className="fas fa-code text-primary mr-2"></i>
            LeetCode Progress
          </h3>
          <div className="text-xs text-muted-foreground">@{username}</div>
        </div>
        
        <div className="space-y-4">
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-2 w-full" />
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Today's Target</span>
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${isTargetMet ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                  <span className="text-sm font-medium" data-testid="text-todays-progress">
                    {(data as any).todaysSolved} / {(data as any).dailyTarget}
                  </span>
                </div>
              </div>
              
              <div className="bg-secondary rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${isTargetMet ? 'bg-green-500' : 'bg-yellow-500'}`}
                  style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                  data-testid="progress-bar-leetcode"
                ></div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary" data-testid="text-current-streak">{(data as any).currentStreak}</div>
                  <div className="text-xs text-muted-foreground">Day Streak</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-500" data-testid="text-total-solved">{(data as any).totalSolved}</div>
                  <div className="text-xs text-muted-foreground">Total Solved</div>
                </div>
              </div>
            </>
          )}
          
          <div className="text-center">
            <Button
              onClick={handleRefresh}
              className="w-full"
              disabled={isRefetching}
              data-testid="button-refresh-leetcode"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isRefetching ? 'animate-spin' : ''}`} />
              {isRefetching ? 'Refreshing...' : 'Refresh Stats'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
