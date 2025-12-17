import { useApp } from "@/contexts/AppContext";
import { formatCurrency } from "@/lib/utils";
import { Check, Star, Plus } from "lucide-react";
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
      {/* Header - ガラスモーフィズム */}
      <div className="sticky top-0 z-10 glass border-b border-white/20 px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">目標</h1>
            <p className="text-sm text-muted-foreground">
              貯金額: <span className="font-bold text-primary">{formatCurrency(totalSaved, settings.currency)}</span>
            </p>
          </div>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleAddGoal}
            className="btn-3d w-12 h-12 rounded-full flex items-center justify-center"
          >
            <Plus className="w-5 h-5 text-primary-foreground drop-shadow-sm" />
          </motion.button>
        </div>
      </div>

      {/* Goals List */}
      <div className="px-4 py-4 space-y-5">
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
              whileTap={{ scale: 0.97 }}
              onClick={() => !isActive && setActiveGoal(goal.id)}
              className={cn(
                "card-3d relative rounded-3xl overflow-hidden cursor-pointer",
                isActive && "ring-2 ring-primary ring-offset-4 ring-offset-background"
              )}
            >
              {/* Image with depth */}
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={goal.image} 
                  alt={goal.title}
                  className="w-full h-full object-cover"
                />
                {/* Gradient overlay with depth */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                
                {/* Active badge - 立体的 */}
                {isActive && (
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-4 right-4 badge-3d bg-gradient-to-br from-primary to-primary/80 text-primary-foreground px-4 py-2 rounded-full text-xs font-bold flex items-center gap-1.5"
                    style={{
                      boxShadow: '0 4px 12px -2px rgba(var(--primary), 0.4), inset 0 -2px 4px rgba(0,0,0,0.1), inset 0 2px 4px rgba(255,255,255,0.2)'
                    }}
                  >
                    <Star className="w-3.5 h-3.5 fill-current drop-shadow-sm" />
                    現在の目標
                  </motion.div>
                )}

                {/* Achieved badge - 立体的 */}
                {isAchieved && (
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-4 left-4 bg-gradient-to-br from-green-500 to-green-600 text-white px-4 py-2 rounded-full text-xs font-bold flex items-center gap-1.5"
                    style={{
                      boxShadow: '0 4px 12px -2px rgba(34,197,94,0.4), inset 0 -2px 4px rgba(0,0,0,0.1), inset 0 2px 4px rgba(255,255,255,0.2)'
                    }}
                  >
                    <Check className="w-3.5 h-3.5 drop-shadow-sm" />
                    達成！
                  </motion.div>
                )}
                
                {/* Title overlay with text shadow */}
                <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                  <h3 className="text-2xl font-bold mb-1 drop-shadow-lg" style={{
                    textShadow: '0 2px 8px rgba(0,0,0,0.5)'
                  }}>{goal.title}</h3>
                  <p className="text-sm opacity-90 line-clamp-1 drop-shadow-md">{goal.description}</p>
                </div>
              </div>
              
              {/* Progress section - 立体的 */}
              <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">進捗</div>
                    <div className="text-2xl font-bold" style={{
                      background: isAchieved 
                        ? 'linear-gradient(135deg, #22c55e, #16a34a)' 
                        : 'linear-gradient(135deg, var(--primary), var(--secondary))',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}>{Math.round(progress)}%</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground mb-1">目標金額</div>
                    <div className="text-lg font-bold">{formatCurrency(goal.targetAmount, settings.currency)}</div>
                  </div>
                </div>
                
                {/* 立体的なプログレスバー */}
                <div className="progress-3d h-4 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.8, delay: index * 0.1 + 0.3 }}
                    className={cn(
                      "h-full rounded-full",
                      isAchieved 
                        ? "bg-gradient-to-r from-green-500 to-green-400" 
                        : "bg-gradient-to-r from-primary via-primary/90 to-emerald-400"
                    )}
                    style={{
                      boxShadow: 'inset 0 -2px 4px rgba(0,0,0,0.15), inset 0 2px 4px rgba(255,255,255,0.3)'
                    }}
                  />
                </div>
                
                {!isAchieved && remaining > 0 && (
                  <div className="mt-4 text-sm text-muted-foreground">
                    あと <span className="font-bold text-foreground">{formatCurrency(remaining, settings.currency)}</span> で達成
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}

        {/* Add custom goal card - 立体的なプレースホルダー */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: goals.length * 0.1 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleAddGoal}
          className="rounded-3xl border-2 border-dashed border-muted-foreground/30 p-10 flex flex-col items-center justify-center text-center cursor-pointer hover:border-primary/50 transition-all hover:bg-muted/30"
          style={{
            boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.03)'
          }}
        >
          <div className="icon-3d w-16 h-16 rounded-2xl flex items-center justify-center mb-4">
            <Plus className="w-7 h-7 text-muted-foreground" />
          </div>
          <div className="font-bold text-lg">カスタム目標を追加</div>
          <div className="text-sm text-muted-foreground mt-1">
            あなただけの目標を設定しよう
          </div>
        </motion.div>
      </div>
    </div>
  );
}
