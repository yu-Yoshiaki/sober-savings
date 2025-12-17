import { useAuth } from "@/_core/hooks/useAuth";
import { useApp } from "@/contexts/AppContext";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Trophy, Heart, Brain, Wallet, Clock, Star, TrendingUp, Gift, Zap } from "lucide-react";
import { Link } from "wouter";
import { getLoginUrl } from "@/const";
import { motion } from "framer-motion";

// 健康回復のマイルストーン
const healthMilestones = [
  { days: 1, title: "血圧が安定し始める", icon: Heart, color: "text-red-500", bgColor: "bg-red-500/10" },
  { days: 3, title: "肝臓の解毒が始まる", icon: Zap, color: "text-amber-500", bgColor: "bg-amber-500/10" },
  { days: 7, title: "睡眠の質が向上", icon: Star, color: "text-blue-500", bgColor: "bg-blue-500/10" },
  { days: 14, title: "肌のツヤが改善", icon: Sparkles, color: "text-pink-500", bgColor: "bg-pink-500/10" },
  { days: 30, title: "脳機能が回復", icon: Brain, color: "text-purple-500", bgColor: "bg-purple-500/10" },
  { days: 90, title: "免疫力が大幅向上", icon: Heart, color: "text-green-500", bgColor: "bg-green-500/10" },
];

// 達成バッジ
const achievementBadges = [
  { days: 1, title: "最初の一歩", emoji: "🌱" },
  { days: 7, title: "1週間達成", emoji: "🎯" },
  { days: 14, title: "2週間の勇者", emoji: "⚔️" },
  { days: 30, title: "1ヶ月マスター", emoji: "🏆" },
  { days: 60, title: "60日の達人", emoji: "🔥" },
  { days: 90, title: "90日レジェンド", emoji: "👑" },
  { days: 180, title: "半年の英雄", emoji: "🦸" },
  { days: 365, title: "1年の伝説", emoji: "🌟" },
];

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const { totalSaved, daysSober, activeGoalId, goals, settings } = useApp();
  
  const activeGoal = goals.find(g => g.id === activeGoalId) || goals[0];
  const progress = Math.min(100, (totalSaved / activeGoal.targetAmount) * 100);
  const daysRemaining = Math.ceil((activeGoal.targetAmount - totalSaved) / settings.dailyTarget);
  
  // 達成したバッジを取得
  const earnedBadges = achievementBadges.filter(b => daysSober >= b.days);
  const nextBadge = achievementBadges.find(b => daysSober < b.days);
  
  // 現在の健康マイルストーン
  const currentHealth = healthMilestones.filter(m => daysSober >= m.days);
  const nextHealth = healthMilestones.find(m => daysSober < m.days);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Hero Section - 獲得した価値を強調 */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-500 shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.2),transparent_50%)]" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-2xl" />
        
        <div className="relative p-8 md:p-12 text-white">
          {/* メインメッセージ */}
          <div className="text-center mb-8">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-4"
            >
              <TrendingUp className="w-4 h-4" />
              あなたが手に入れたもの
            </motion.div>
            
            <motion.h1 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-6xl font-serif font-bold mb-2"
            >
              {formatCurrency(totalSaved, settings.currency)}
            </motion.h1>
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl opacity-90"
            >
              の<span className="font-bold">自由</span>を取り戻しました
            </motion.p>
          </div>

          {/* 3つの獲得価値 */}
          <div className="grid grid-cols-3 gap-4 md:gap-6">
            <motion.div 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white/15 backdrop-blur-sm rounded-2xl p-4 md:p-6 text-center border border-white/20"
            >
              <div className="w-12 h-12 mx-auto mb-3 bg-white/20 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
              <div className="text-3xl md:text-4xl font-bold mb-1">{daysSober}</div>
              <div className="text-xs md:text-sm opacity-80">日間の勝利</div>
            </motion.div>

            <motion.div 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white/15 backdrop-blur-sm rounded-2xl p-4 md:p-6 text-center border border-white/20"
            >
              <div className="w-12 h-12 mx-auto mb-3 bg-white/20 rounded-full flex items-center justify-center">
                <Wallet className="w-6 h-6" />
              </div>
              <div className="text-3xl md:text-4xl font-bold mb-1">{Math.round(totalSaved / 500)}</div>
              <div className="text-xs md:text-sm opacity-80">杯分のお酒代</div>
            </motion.div>

            <motion.div 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="bg-white/15 backdrop-blur-sm rounded-2xl p-4 md:p-6 text-center border border-white/20"
            >
              <div className="w-12 h-12 mx-auto mb-3 bg-white/20 rounded-full flex items-center justify-center">
                <Trophy className="w-6 h-6" />
              </div>
              <div className="text-3xl md:text-4xl font-bold mb-1">{earnedBadges.length}</div>
              <div className="text-xs md:text-sm opacity-80">個のバッジ獲得</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 健康回復タイムライン */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <Heart className="w-6 h-6 text-red-500" />
          <h3 className="text-2xl font-serif font-bold text-foreground">体が喜んでいます</h3>
        </div>
        
        <Card className="border-none shadow-lg overflow-hidden">
          <CardContent className="p-6">
            <div className="space-y-4">
              {healthMilestones.map((milestone, index) => {
                const isAchieved = daysSober >= milestone.days;
                const isCurrent = nextHealth?.days === milestone.days;
                const Icon = milestone.icon;
                
                return (
                  <motion.div 
                    key={milestone.days}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className={`flex items-center gap-4 p-3 rounded-xl transition-all ${
                      isAchieved 
                        ? `${milestone.bgColor} border-2 border-current/20` 
                        : isCurrent 
                          ? 'bg-muted/50 border-2 border-dashed border-muted-foreground/30'
                          : 'opacity-40'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isAchieved ? milestone.bgColor : 'bg-muted'
                    }`}>
                      <Icon className={`w-5 h-5 ${isAchieved ? milestone.color : 'text-muted-foreground'}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`font-medium ${isAchieved ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {milestone.title}
                        </span>
                        {isAchieved && (
                          <span className="text-xs bg-green-500/20 text-green-600 px-2 py-0.5 rounded-full font-medium">
                            達成！
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">{milestone.days}日目</span>
                    </div>
                    {isCurrent && (
                      <div className="text-right">
                        <span className="text-sm font-bold text-primary">あと{milestone.days - daysSober}日</span>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* 達成バッジ */}
      {earnedBadges.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-4">
            <Trophy className="w-6 h-6 text-amber-500" />
            <h3 className="text-2xl font-serif font-bold text-foreground">獲得したバッジ</h3>
          </div>
          
          <div className="flex flex-wrap gap-3">
            {earnedBadges.map((badge, index) => (
              <motion.div
                key={badge.days}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1, type: "spring" }}
                className="bg-gradient-to-br from-amber-100 to-amber-50 dark:from-amber-900/30 dark:to-amber-800/20 border-2 border-amber-300 dark:border-amber-600 rounded-2xl p-4 text-center min-w-[100px]"
              >
                <div className="text-3xl mb-1">{badge.emoji}</div>
                <div className="text-xs font-medium text-amber-800 dark:text-amber-200">{badge.title}</div>
              </motion.div>
            ))}
            
            {nextBadge && (
              <div className="bg-muted/50 border-2 border-dashed border-muted-foreground/30 rounded-2xl p-4 text-center min-w-[100px] opacity-60">
                <div className="text-3xl mb-1 grayscale">{nextBadge.emoji}</div>
                <div className="text-xs font-medium text-muted-foreground">
                  あと{nextBadge.days - daysSober}日
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* 目標への進捗 - 夢への距離 */}
      <section>
        <div className="flex justify-between items-end mb-4">
          <div className="flex items-center gap-3">
            <Gift className="w-6 h-6 text-primary" />
            <h3 className="text-2xl font-serif font-bold text-foreground">夢への距離</h3>
          </div>
          <Link href="/goals">
            <Button variant="link" className="text-primary p-0 h-auto font-medium">
              すべての目標 <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>

        <Card className="overflow-hidden border-none shadow-lg bg-card group hover:shadow-xl transition-all duration-500">
          <div className="grid md:grid-cols-2 gap-0">
            <div className="relative h-64 md:h-auto overflow-hidden">
              <img 
                src={activeGoal.image} 
                alt={activeGoal.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              
              {/* 進捗オーバーレイ */}
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-sm font-medium">目標に向かって進行中</span>
                </div>
                <div className="text-3xl md:text-4xl font-bold font-serif">{activeGoal.title}</div>
              </div>
            </div>
            
            <CardContent className="p-6 md:p-10 flex flex-col justify-center space-y-6 bg-gradient-to-br from-card to-muted/30">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">現在の貯金額</span>
                  <span className="text-2xl font-bold text-primary">{formatCurrency(totalSaved, settings.currency)}</span>
                </div>
                
                <div className="relative">
                  <Progress 
                    value={progress} 
                    className="h-4 bg-muted [&>div]:bg-gradient-to-r [&>div]:from-emerald-500 [&>div]:to-teal-400 [&>div]:transition-all [&>div]:duration-1000" 
                  />
                  <div 
                    className="absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full shadow-lg border-2 border-emerald-500 flex items-center justify-center transition-all duration-1000"
                    style={{ left: `calc(${Math.min(progress, 95)}% - 12px)` }}
                  >
                    <span className="text-xs">🏃</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">目標金額</span>
                  <span className="font-medium">{formatCurrency(activeGoal.targetAmount, settings.currency)}</span>
                </div>
              </div>

              <div className="bg-primary/10 rounded-xl p-4 border border-primary/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">このペースなら</p>
                    <p className="font-bold text-lg text-primary">
                      あと{daysRemaining > 0 ? `${daysRemaining}日` : '達成間近！'}
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-muted-foreground text-sm leading-relaxed">
                {activeGoal.description}
              </p>
            </CardContent>
          </div>
        </Card>
      </section>

      {/* Pro Upgrade Banner (for non-authenticated users) */}
      {!isAuthenticated && (
        <Card className="border-2 border-secondary/50 bg-gradient-to-r from-secondary/10 to-accent/10">
          <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-secondary/20 rounded-full">
                <Sparkles className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg">データを守ろう</h3>
                <p className="text-sm text-muted-foreground">
                  ログインしてクラウドに保存。複数デバイスで同期できます。
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <a href={getLoginUrl()}>
                <Button variant="default" className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                  ログインする
                </Button>
              </a>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Daily Motivation */}
      <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border-none shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="text-4xl">💪</div>
            <div>
              <h4 className="font-serif font-bold text-lg mb-2">今日のあなたへ</h4>
              <blockquote className="text-muted-foreground italic leading-relaxed">
                「禁酒は制限ではなく、解放です。あなたは毎日、自分の自由を買い戻しています。」
              </blockquote>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
