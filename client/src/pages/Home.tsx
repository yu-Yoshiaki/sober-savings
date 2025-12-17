import { useAuth } from "@/_core/hooks/useAuth";
import { useApp } from "@/contexts/AppContext";
import { formatCurrency } from "@/lib/utils";
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
      {/* Hero Section - 立体的なグラデーション */}
      <section className="relative overflow-hidden">
        {/* 立体的な背景 */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700">
          {/* 光の効果 */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-b from-white/20 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-72 h-72 bg-teal-400/30 rounded-full blur-3xl translate-y-1/2 translate-x-1/4" />
          <div className="absolute top-1/2 left-0 w-48 h-48 bg-emerald-300/20 rounded-full blur-2xl -translate-x-1/2" />
        </div>
        
        <div className="relative px-6 pt-12 pb-8 text-white">
          {/* Status pill - ガラスモーフィズム */}
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center mb-6"
          >
            <div className="glass-dark inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium shadow-lg">
              <div className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.6)]" />
              継続中
            </div>
          </motion.div>

          {/* Main stats - 立体的なテキスト */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="text-center mb-8"
          >
            <p className="text-white/80 text-sm mb-2 drop-shadow-sm">あなたが取り戻した自由</p>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-1 drop-shadow-lg" style={{
              textShadow: '0 4px 8px rgba(0,0,0,0.2), 0 2px 4px rgba(0,0,0,0.1)'
            }}>
              {formatCurrency(totalSaved, settings.currency)}
            </h1>
          </motion.div>

          {/* Stats grid - 立体的なカード */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: Clock, value: daysSober, label: "日間の勝利", delay: 0.2 },
              { icon: Wallet, value: Math.round(totalSaved / 500), label: "杯分節約", delay: 0.3 },
              { icon: Trophy, value: earnedBadges.length, label: "バッジ獲得", delay: 0.4 },
            ].map((stat, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: stat.delay }}
                whileTap={{ scale: 0.95 }}
                className="glass-dark rounded-2xl p-4 text-center shadow-xl"
                style={{
                  boxShadow: '0 8px 32px -8px rgba(0,0,0,0.3), 0 4px 16px -4px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1)'
                }}
              >
                <stat.icon className="w-5 h-5 mx-auto mb-2 opacity-90 drop-shadow-sm" />
                <div className="text-2xl font-bold drop-shadow-sm">{stat.value}</div>
                <div className="text-[10px] opacity-70">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Content sections */}
      <div className="px-4 py-6 space-y-6">
        
        {/* Health Progress - 立体的なカード */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <div className="icon-3d w-8 h-8 rounded-xl flex items-center justify-center">
                <Heart className="w-4 h-4 text-red-500" />
              </div>
              体の回復
            </h2>
            <span className="text-xs text-muted-foreground badge-3d px-3 py-1 rounded-full">
              {currentHealth.length}/{healthMilestones.length} 達成
            </span>
          </div>
          
          <div className="card-3d rounded-3xl p-5">
            {/* Progress bar - 立体的 */}
            <div className="mb-5">
              <div className="flex justify-between text-xs text-muted-foreground mb-2">
                <span>回復進捗</span>
                <span className="font-medium">{Math.round((currentHealth.length / healthMilestones.length) * 100)}%</span>
              </div>
              <div className="progress-3d h-3 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${(currentHealth.length / healthMilestones.length) * 100}%` }}
                  transition={{ duration: 1, delay: 0.6 }}
                  className="h-full bg-gradient-to-r from-red-500 via-amber-500 to-green-500 rounded-full"
                  style={{
                    boxShadow: 'inset 0 -2px 4px rgba(0,0,0,0.1), inset 0 2px 4px rgba(255,255,255,0.2)'
                  }}
                />
              </div>
            </div>

            {/* Milestone items - 立体的なリスト */}
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
                        ? 'bg-gradient-to-r from-muted/80 to-muted/40' 
                        : isCurrent 
                          ? 'bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20'
                          : 'opacity-40'
                    }`}
                    style={isAchieved ? {
                      boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05), inset 0 -1px 2px rgba(255,255,255,0.5)'
                    } : {}}
                  >
                    <div 
                      className={`icon-3d w-11 h-11 rounded-xl flex items-center justify-center ${
                        isAchieved ? milestone.bgColor : ''
                      }`}
                      style={isAchieved ? {
                        background: `linear-gradient(145deg, var(--tw-gradient-stops))`,
                        boxShadow: '0 4px 12px -2px rgba(0,0,0,0.2), inset 0 -2px 4px rgba(0,0,0,0.1), inset 0 2px 4px rgba(255,255,255,0.2)'
                      } : {}}
                    >
                      <Icon className={`w-5 h-5 ${isAchieved ? 'text-white drop-shadow-sm' : 'text-muted-foreground'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">{milestone.title}</div>
                      <div className="text-xs text-muted-foreground">{milestone.days}日目</div>
                    </div>
                    {isAchieved ? (
                      <div className="badge-3d text-xs font-bold text-green-700 px-3 py-1.5 rounded-full">
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

        {/* Badges - 立体的なバッジ */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <div className="icon-3d w-8 h-8 rounded-xl flex items-center justify-center">
                <Trophy className="w-4 h-4 text-amber-500" />
              </div>
              バッジ
            </h2>
          </div>
          
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
            {achievementBadges.map((badge, index) => {
              const isEarned = daysSober >= badge.days;
              
              return (
                <motion.div
                  key={badge.days}
                  whileTap={{ scale: 0.92 }}
                  className={`shrink-0 w-24 h-28 rounded-2xl flex flex-col items-center justify-center transition-all ${
                    isEarned 
                      ? 'card-3d' 
                      : 'bg-muted/30 border-2 border-dashed border-muted-foreground/20'
                  }`}
                  style={isEarned ? {
                    background: 'linear-gradient(145deg, #fef3c7, #fde68a)',
                    boxShadow: '0 8px 24px -4px rgba(245,158,11,0.3), 0 4px 12px -2px rgba(0,0,0,0.1), inset 0 -4px 8px rgba(0,0,0,0.05), inset 0 4px 8px rgba(255,255,255,0.5)'
                  } : {}}
                >
                  <div className={`text-4xl mb-2 ${!isEarned && 'grayscale opacity-30'}`}
                    style={isEarned ? { filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' } : {}}
                  >
                    {badge.emoji}
                  </div>
                  <div className={`text-[11px] font-semibold text-center px-1 ${
                    isEarned ? 'text-amber-800' : 'text-muted-foreground'
                  }`}>
                    {badge.title}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* Goal Progress - 立体的な目標カード */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <div className="icon-3d w-8 h-8 rounded-xl flex items-center justify-center">
                <Gift className="w-4 h-4 text-primary" />
              </div>
              目標
            </h2>
            <Link href="/goals">
              <Button variant="ghost" size="sm" className="text-xs h-8 px-2">
                すべて見る
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
          
          <motion.div 
            whileTap={{ scale: 0.98 }}
            className="card-3d rounded-3xl overflow-hidden"
          >
            {/* Goal image with overlay */}
            <div className="relative h-36">
              <img 
                src={activeGoal.image} 
                alt={activeGoal.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <h3 className="font-bold text-lg drop-shadow-lg">{activeGoal.title}</h3>
                <p className="text-xs text-white/80 drop-shadow-sm">{activeGoal.description}</p>
              </div>
            </div>
            
            {/* Progress section */}
            <div className="p-4">
              <div className="flex justify-between items-end mb-3">
                <div>
                  <div className="text-2xl font-bold" style={{
                    background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}>
                    {formatCurrency(totalSaved, settings.currency)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    / {formatCurrency(activeGoal.targetAmount, settings.currency)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-primary">{Math.round(progress)}%</div>
                  <div className="text-xs text-muted-foreground">達成</div>
                </div>
              </div>
              
              {/* 立体的なプログレスバー */}
              <div className="progress-3d h-4 rounded-full overflow-hidden mb-3">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1, delay: 0.8 }}
                  className="h-full rounded-full"
                  style={{
                    background: 'linear-gradient(180deg, var(--primary), oklch(0.45 0.15 45))',
                    boxShadow: 'inset 0 -2px 4px rgba(0,0,0,0.15), inset 0 2px 4px rgba(255,255,255,0.3)'
                  }}
                />
              </div>
              
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  あと約{daysRemaining}日
                </span>
                <span className="text-muted-foreground">
                  残り {formatCurrency(activeGoal.targetAmount - totalSaved, settings.currency)}
                </span>
              </div>
            </div>
          </motion.div>
        </motion.section>

        {/* Quick Actions - 立体的なボタン */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="pb-8"
        >
          <div className="grid grid-cols-2 gap-3">
            <Link href="/goals">
              <motion.div
                whileTap={{ scale: 0.95 }}
                className="btn-3d rounded-2xl p-4 text-center text-primary-foreground"
              >
                <Gift className="w-6 h-6 mx-auto mb-2 drop-shadow-sm" />
                <div className="text-sm font-semibold">目標を編集</div>
              </motion.div>
            </Link>
            
            <Link href="/settings">
              <motion.div
                whileTap={{ scale: 0.95 }}
                className="card-3d rounded-2xl p-4 text-center"
              >
                <TrendingUp className="w-6 h-6 mx-auto mb-2 text-primary" />
                <div className="text-sm font-semibold">設定を変更</div>
              </motion.div>
            </Link>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
