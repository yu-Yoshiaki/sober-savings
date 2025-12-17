import { useApp } from "@/contexts/AppContext";
import { formatCurrency } from "@/lib/utils";
import { Check, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Link } from "wouter";

export default function Goals() {
  const { goals, activeGoalId, setActiveGoal, totalSaved, settings } = useApp();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="flex items-center gap-4 px-6 pt-6 pb-4">
        <Link href="/">
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="icon-3d w-10 h-10 rounded-xl flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
          </motion.button>
        </Link>
        <div>
          <h1 className="text-xl font-bold">目標を選ぶ</h1>
          <p className="text-sm text-muted-foreground">
            貯金額: {formatCurrency(totalSaved, settings.currency)}
          </p>
        </div>
      </header>

      {/* Goals List */}
      <div className="px-6 py-4 space-y-4">
        {goals.map((goal, index) => {
          const isActive = goal.id === activeGoalId;
          const progress = Math.min(100, (totalSaved / goal.targetAmount) * 100);

          return (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveGoal(goal.id)}
              className={cn(
                "card-3d relative rounded-2xl overflow-hidden cursor-pointer transition-all",
                isActive && "ring-2 ring-primary ring-offset-2 ring-offset-background"
              )}
            >
              <div className="flex gap-4 p-4">
                {/* サムネイル */}
                <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0">
                  <img 
                    src={goal.image} 
                    alt={goal.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* 情報 */}
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-base truncate">{goal.title}</h3>
                    {isActive && (
                      <div className="shrink-0 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-primary-foreground" />
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                    {goal.description}
                  </p>
                  <div className="mt-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">{Math.round(progress)}%</span>
                      <span className="font-medium">{formatCurrency(goal.targetAmount, settings.currency)}</span>
                    </div>
                    <div className="progress-3d h-2 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full bg-gradient-to-r from-primary to-emerald-400"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
