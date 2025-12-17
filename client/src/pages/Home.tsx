import { useAuth } from "@/_core/hooks/useAuth";
import { useApp } from "@/contexts/AppContext";
import { formatCurrency } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Trophy, Heart, Brain, Wallet, Clock, Star, TrendingUp, Gift, Zap, ChevronRight, Sparkles } from "lucide-react";
import { Link } from "wouter";
import { getLoginUrl } from "@/const";
import { motion } from "framer-motion";

// 健康回復のマイルストーン
const healthMilestones = [
  { days: 1, title: "血圧が安定", icon: Heart, color: "text-red-500", bgColor: "bg-red-500" },
  { days: 3, title: "肝臓が回復開始", icon: Zap, color: "text-amber-500", bgColor: "bg-amber-500" },
  { days: 7, title: "睡眠の質向上", icon: Star, color: "text-blue-500", bgColor: "bg-blue-500" },
  { days: 14, title: "肌ツヤ改善", icon: Sparkles, color: "text-pink-500", bgColor: "bg-pink-500" },
  { days: 30, title: "脳機能回復", icon: Brain, color: "text-purple-500", bgColor: "bg-purple-500" },
  { days: 90, title: "免疫力向上", icon: Heart, color: "text-green-500", bgColor: "bg-green-500" },
];

// 達成バッジ
const achievementBadges = [
  { days: 1, title: "最初の一歩", emoji: "🌱" },
  { days: 7, title: "1週間", emoji: "🎯" },
  { days: 14, title: "2週間", emoji: "⚔️" },
  { days: 30, title: "1ヶ月", emoji: "🏆" },
  { days: 60, title: "60日", emoji: "🔥" },
  { days: 90, title: "90日", emoji: "👑" },
];

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const { totalSaved, daysSober, activeGoalId, goals, settings } = useApp();
  
  const activeGoal = goals.find(g => g.id === activeGoalId) || goals[0];
  const progress = Math.min(100, (totalSaved / activeGoal.targetAmount) * 100);
  const daysRemaining = Math.ceil((activeGoal.targetAmount - totalSaved) / settings.dailyTarget);
  
  const earnedBadges = achievementBadges.filter(b => daysSober >= b.days);
  const nextBadge = achievementBadges.find(b => daysSober < b.days);
  const currentHealth = healthMilestones.filter(m => daysSober >= m.days);
  const nextHealth = healthMilestones.find(m => daysSober < m.days);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section - Full bleed native style */}
      <section className="relative bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-teal-400/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
        </div>
        
        <div className="relative px-6 pt-12 pb-8 text-white">
          {/* Status pill */}
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center mb-6"
          >
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              継続中
            </div>
          </motion.div>

          {/* Main stats */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="text-center mb-8"
          >
            <p className="text-white/80 text-sm mb-2">あなたが取り戻した自由</p>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-1">
              {formatCurrency(totalSaved, settings.currency)}
            </h1>
          </motion.div>

          {/* Stats grid */}
          <div className="grid grid-cols-3 gap-3">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              whileTap={{ scale: 0.97 }}
              className="bg-white/15 backdrop-blur-sm rounded-2xl p-4 text-center"
            >
              <Clock className="w-5 h-5 mx-auto mb-2 opacity-80" />
              <div className="text-2xl font-bold">{daysSober}</div>
              <div className="text-[10px] opacity-70">日間の勝利</div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              whileTap={{ scale: 0.97 }}
              className="bg-white/15 backdrop-blur-sm rounded-2xl p-4 text-center"
            >
              <Wallet className="w-5 h-5 mx-auto mb-2 opacity-80" />
              <div className="text-2xl font-bold">{Math.round(totalSaved / 500)}</div>
              <div className="text-[10px] opacity-70">杯分節約</div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              whileTap={{ scale: 0.97 }}
              className="bg-white/15 backdrop-blur-sm rounded-2xl p-4 text-center"
            >
              <Trophy className="w-5 h-5 mx-auto mb-2 opacity-80" />
              <div className="text-2xl font-bold">{earnedBadges.length}</div>
              <div className="text-[10px] opacity-70">バッジ獲得</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Content sections */}
      <div className="px-4 py-6 space-y-6">
        
        {/* Health Progress - Native card style */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-500" />
              体の回復
            </h2>
            <span className="text-xs text-muted-foreground">
              {currentHealth.length}/{healthMilestones.length} 達成
            </span>
          </div>
          
          <div className="bg-card rounded-3xl p-4 shadow-sm border border-border/50">
            {/* Progress bar */}
            <div className="mb-4">
              <div className="flex justify-between text-xs text-muted-foreground mb-2">
                <span>回復進捗</span>
                <span>{Math.round((currentHealth.length / healthMilestones.length) * 100)}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${(currentHealth.length / healthMilestones.length) * 100}%` }}
                  transition={{ duration: 1, delay: 0.6 }}
                  className="h-full bg-gradient-to-r from-red-500 via-amber-500 to-green-500 rounded-full"
                />
              </div>
            </div>

            {/* Milestone items */}
            <div className="space-y-2">
              {healthMilestones.slice(0, 4).map((milestone, index) => {
                const isAchieved = daysSober >= milestone.days;
                const isCurrent = nextHealth?.days === milestone.days;
                const Icon = milestone.icon;
                
                return (
                  <motion.div 
                    key={milestone.days}
                    whileTap={{ scale: 0.98 }}
                    className={`flex items-center gap-3 p-3 rounded-2xl transition-all ${
                      isAchieved 
                        ? 'bg-muted/50' 
                        : isCurrent 
                          ? 'bg-primary/5 border border-primary/20'
                          : 'opacity-40'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      isAchieved ? milestone.bgColor : 'bg-muted'
                    }`}>
                      <Icon className={`w-5 h-5 ${isAchieved ? 'text-white' : 'text-muted-foreground'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">{milestone.title}</div>
                      <div className="text-xs text-muted-foreground">{milestone.days}日目</div>
                    </div>
                    {isAchieved ? (
                      <div className="text-xs font-bold text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full">
                        達成
                      </div>
                    ) : isCurrent ? (
                      <div className="text-xs font-bold text-primary">
                        あと{milestone.days - daysSober}日
                      </div>
                    ) : null}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.section>

        {/* Badges - Horizontal scroll native style */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              バッジ
            </h2>
          </div>
          
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
            {achievementBadges.map((badge, index) => {
              const isEarned = daysSober >= badge.days;
              
              return (
                <motion.div
                  key={badge.days}
                  whileTap={{ scale: 0.95 }}
                  className={`shrink-0 w-20 h-24 rounded-2xl flex flex-col items-center justify-center transition-all ${
                    isEarned 
                      ? 'bg-gradient-to-br from-amber-100 to-amber-50 dark:from-amber-900/40 dark:to-amber-800/20 border-2 border-amber-300 dark:border-amber-600' 
                      : 'bg-muted/50 border-2 border-dashed border-muted-foreground/20'
                  }`}
                >
                  <div className={`text-3xl mb-1 ${!isEarned && 'grayscale opacity-30'}`}>
                    {badge.emoji}
                  </div>
                  <div className={`text-[10px] font-medium text-center px-1 ${
                    isEarned ? 'text-amber-800 dark:text-amber-200' : 'text-muted-foreground'
                  }`}>
                    {badge.title}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* Goal Progress - Native card with image */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Gift className="w-5 h-5 text-primary" />
              目標
            </h2>
            <Link href="/goals">
              <Button variant="ghost" size="sm" className="text-xs h-8 px-2">
                すべて見る
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
          
          <Link href="/goals">
            <motion.div 
              whileTap={{ scale: 0.98 }}
              className="bg-card rounded-3xl overflow-hidden shadow-sm border border-border/50"
            >
              {/* Image */}
              <div className="relative h-40 overflow-hidden">
                <img 
                  src={activeGoal.image} 
                  alt={activeGoal.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <div className="text-xs opacity-80 mb-1">現在の目標</div>
                  <div className="text-xl font-bold">{activeGoal.title}</div>
                </div>
              </div>
              
              {/* Progress */}
              <div className="p-4">
                <div className="flex justify-between items-end mb-2">
                  <div>
                    <div className="text-2xl font-bold text-primary">
                      {formatCurrency(totalSaved, settings.currency)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      / {formatCurrency(activeGoal.targetAmount, settings.currency)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">{Math.round(progress)}%</div>
                    <div className="text-xs text-muted-foreground">達成</div>
                  </div>
                </div>
                
                <div className="relative">
                  <Progress 
                    value={progress} 
                    className="h-3 bg-muted [&>div]:bg-gradient-to-r [&>div]:from-primary [&>div]:to-emerald-400" 
                  />
                </div>
                
                {daysRemaining > 0 && (
                  <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    このペースであと約{daysRemaining}日
                  </div>
                )}
              </div>
            </motion.div>
          </Link>
        </motion.section>

        {/* Login CTA for non-authenticated */}
        {!isAuthenticated && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <a href={getLoginUrl()}>
              <motion.div 
                whileTap={{ scale: 0.98 }}
                className="bg-gradient-to-r from-secondary/20 to-accent/20 rounded-3xl p-5 border border-secondary/30"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-secondary/20 rounded-2xl flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-secondary" />
                  </div>
                  <div className="flex-1">
                    <div className="font-bold">データを保存</div>
                    <div className="text-xs text-muted-foreground">ログインして記録を守ろう</div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
              </motion.div>
            </a>
          </motion.section>
        )}

        {/* Daily motivation */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="pb-4"
        >
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 rounded-3xl p-5">
            <div className="flex gap-4">
              <div className="text-3xl">💪</div>
              <div>
                <div className="font-bold text-sm mb-1">今日のあなたへ</div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  禁酒は制限ではなく、解放です。あなたは毎日、自分の自由を買い戻しています。
                </p>
              </div>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
