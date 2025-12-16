import { useApp } from "@/contexts/AppContext";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Check, Star } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Goals() {
  const { goals, activeGoalId, setActiveGoal, totalSaved, settings } = useApp();

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-serif font-bold text-foreground">Aspirations</h2>
          <p className="text-muted-foreground mt-1">Choose what you're saving for. Visualize your reward.</p>
        </div>
        <div className="bg-card px-4 py-2 rounded-full border border-border shadow-sm">
          <span className="text-sm font-medium text-muted-foreground mr-2">Total Saved:</span>
          <span className="text-lg font-bold text-primary">{formatCurrency(totalSaved, settings.currency)}</span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.map((goal) => {
          const isActive = goal.id === activeGoalId;
          const progress = Math.min(100, (totalSaved / goal.targetAmount) * 100);
          const isAchieved = totalSaved >= goal.targetAmount;

          return (
            <Card 
              key={goal.id} 
              className={cn(
                "group relative overflow-hidden transition-all duration-300 border-2",
                isActive 
                  ? "border-primary shadow-lg scale-[1.02]" 
                  : "border-transparent hover:border-border hover:shadow-md"
              )}
            >
              {isActive && (
                <div className="absolute top-3 right-3 z-10 bg-primary text-primary-foreground p-1.5 rounded-full shadow-md">
                  <Star className="w-4 h-4 fill-current" />
                </div>
              )}
              
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={goal.image} 
                  alt={goal.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-3 left-4 text-white">
                  <p className="text-xs font-medium opacity-90 uppercase tracking-wider">Target</p>
                  <p className="text-lg font-bold">{formatCurrency(goal.targetAmount, settings.currency)}</p>
                </div>
              </div>

              <CardHeader className="pb-2">
                <CardTitle className="font-serif text-xl">{goal.title}</CardTitle>
              </CardHeader>
              
              <CardContent className="pb-4">
                <p className="text-sm text-muted-foreground line-clamp-2 min-h-[2.5rem]">
                  {goal.description}
                </p>
                
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-xs font-medium">
                    <span>Progress</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <Progress 
                    value={progress} 
                    // Using child selector for indicator color as per previous fix
                    className="h-2 bg-muted [&>div]:bg-primary"
                  />
                </div>
              </CardContent>

              <CardFooter>
                {isActive ? (
                  <Button className="w-full" disabled variant="secondary">
                    <Check className="w-4 h-4 mr-2" /> Active Goal
                  </Button>
                ) : (
                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={() => setActiveGoal(goal.id)}
                  >
                    Set as Active Goal
                  </Button>
                )}
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
