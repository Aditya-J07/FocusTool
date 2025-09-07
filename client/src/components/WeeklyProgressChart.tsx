import { Card, CardContent } from "@/components/ui/card";
import { useLocalStorage } from "@/hooks/useLocalStorage";

export default function WeeklyProgressChart() {
  const [weeklyData] = useLocalStorage('weekly-data', generateWeekData());

  function generateWeekData() {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days.map((day, index) => ({
      day,
      activities: index < 6 ? Math.floor(Math.random() * 7) : 0, // Today has 0
      date: new Date(Date.now() - (6 - index) * 24 * 60 * 60 * 1000)
    }));
  }

  const totalActivities = weeklyData.reduce((sum: number, day: any) => sum + day.activities, 0);

  const getOpacityClass = (activities: number) => {
    if (activities === 0) return 'bg-secondary';
    if (activities <= 2) return 'bg-green-500 opacity-40';
    if (activities <= 4) return 'bg-green-500 opacity-60';
    if (activities <= 6) return 'bg-green-500 opacity-80';
    return 'bg-green-500 opacity-100';
  };

  return (
    <Card data-testid="weekly-progress-chart">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <i className="fas fa-calendar-week text-accent mr-2"></i>
          Weekly Progress
        </h3>
        
        <div className="space-y-3">
          <div className="flex justify-between text-xs text-muted-foreground">
            {weeklyData.map((day: any) => (
              <span key={day.day}>{day.day}</span>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-1" data-testid="activity-grid">
            {weeklyData.map((day: any, index: number) => (
              <div
                key={day.day}
                className={`aspect-square ${getOpacityClass(day.activities)} rounded-sm`}
                title={`${day.activities} activities`}
                data-testid={`activity-day-${index}`}
              />
            ))}
          </div>
          
          <div className="text-center mt-4">
            <div className="text-sm text-muted-foreground">This Week</div>
            <div className="font-bold text-lg text-accent" data-testid="text-total-activities">
              {totalActivities} activities
            </div>
          </div>
          
          {/* Legend */}
          <div className="flex items-center justify-center space-x-2 text-xs text-muted-foreground">
            <span>Less</span>
            <div className="flex space-x-1">
              <div className="w-3 h-3 bg-secondary rounded-sm"></div>
              <div className="w-3 h-3 bg-green-500 rounded-sm opacity-40"></div>
              <div className="w-3 h-3 bg-green-500 rounded-sm opacity-60"></div>
              <div className="w-3 h-3 bg-green-500 rounded-sm opacity-80"></div>
              <div className="w-3 h-3 bg-green-500 rounded-sm opacity-100"></div>
            </div>
            <span>More</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
