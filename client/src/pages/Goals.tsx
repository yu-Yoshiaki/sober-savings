import { useApp } from "@/contexts/AppContext";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Check, Star, Target, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function Goals() {
  const { goals, activeGoalId, setActiveGoal, totalSaved, settings } = useApp();

  const handleAddGoal = () => {
    toast.info("カスタム目標の追加機能は近日公開予定です");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border/50 px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">目標</h1>
            <p className="text-sm text-muted-foreground">
              貯金額: <span className="font-bold text-primary">{formatCurrency(totalSaved, settings.currency)}</span>
            </p>
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleAddGoal}
            className="w-10 h-10 bg-primary rounded-full flex items-center justify-center shadow-lg shadow-primary/30"
          >
            <Plus className="w-5 h-5 text-primary-foreground" />
          </motion.button>
        </div>
      </div>

      {/* Goals List */}
      <div className="px-4 py-4 space-y-4">
        {goals.map((goal, index) => {
          const isActive = goal.id === activeGoalId;
          const progress = Math.min(100, (totalSaved / goal.targetAmount) * 100);
          const isAchieved = totalSaved >= goal.targetAmount;
          const remaining = goal.targetAmount - totalSaved;

          return (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => !isActive && setActiveGoal(goal.id)}
              className={cn(
                "relative rounded-3xl overflow-hidden transition-all duration-300 cursor-pointer",
                isActive 
                  ? "ring-2 ring-primary ring-offset-2 ring-offset-background shadow-xl" 
                  : "shadow-sm active:shadow-md"
              )}
            >
              {/* Image */}
              <div className="relative h-44 overflow-hidden">
                <img 
                  src={goal.image} 
                  alt={goal.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                
                {/* Active badge */}
                {isActive && (
                  <div className="absolute top-3 right-3 bg-primary text-primary-foreground px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                    <Star className="w-3 h-3 fill-current" />
                    現在の目標
                  </div>
                )}

                {/* Achieved badge */}
                {isAchieved && (
                  <div className="absolute top-3 left-3 bg-green-500 text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    達成！
                  </div>
                )}
                
                {/* Title overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <h3 className="text-xl font-bold mb-1">{goal.title}</h3>
                  <p className="text-xs opacity-80 line-clamp-1">{goal.description}</p>
                </div>
              </div>
              
              {/* Progress section */}
              <div className="bg-card p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="text-xs text-muted-foreground">進捗</div>
                    <div className="text-lg font-bold">{Math.round(progress)}%</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground">目標金額</div>
                    <div className="font-bold">{formatCurrency(goal.targetAmount, settings.currency)}</div>
                  </div>
                </div>
                
                <Progress 
                  value={progress} 
                  className={cn(
                    "h-2 bg-muted",
                    isAchieved 
                      ? "[&>div]:bg-green-500" 
                      : "[&>div]:bg-gradient-to-r [&>div]:from-primary [&>div]:to-emerald-400"
                  )}
                />
                
                {!isAchieved && remaining > 0 && (
                  <div className="mt-3 text-xs text-muted-foreground">
                    あと <span className="font-bold text-foreground">{formatCurrency(remaining, settings.currency)}</span> で達成
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}

        {/* Add custom goal card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: goals.length * 0.1 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleAddGoal}
          className="rounded-3xl border-2 border-dashed border-muted-foreground/30 p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-primary/50 transition-colors"
        >
          <div className="w-14 h-14 bg-muted rounded-full flex items-center justify-center mb-3">
            <Plus className="w-6 h-6 text-muted-foreground" />
          </div>
          <div className="font-bold">カスタム目標を追加</div>
          <div className="text-xs text-muted-foreground mt-1">
            あなただけの目標を設定しよう
          </div>
        </motion.div>
      </div>
    </div>
  );
}
