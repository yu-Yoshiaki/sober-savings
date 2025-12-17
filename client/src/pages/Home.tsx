import { useApp } from "@/contexts/AppContext";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Settings, Calendar, Wallet } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";

export default function Home() {
  const { totalSaved, daysSober, activeGoalId, goals, settings } = useApp();
  
  const activeGoal = goals.find(g => g.id === activeGoalId) || goals[0];
  const progress = Math.min(100, (totalSaved / activeGoal.targetAmount) * 100);
  const remaining = activeGoal.targetAmount - totalSaved;
  const daysToGoal = Math.ceil(remaining / settings.dailyTarget);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 pt-6 pb-4">
        <div>
          <h1 className="text-sm text-muted-foreground">Sober Savings</h1>
        </div>
        <Link href="/settings">
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="icon-3d w-10 h-10 rounded-xl flex items-center justify-center"
          >
            <Settings className="w-5 h-5 text-muted-foreground" />
          </motion.button>
        </Link>
      </header>

      {/* Main Content - 目標にフォーカス */}
      <main className="flex-1 flex flex-col px-6 pb-8">
        
        {/* 目標カード - メインビジュアル */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-3d rounded-3xl overflow-hidden mb-6"
        >
          {/* 目標画像 */}
          <div className="relative h-56">
            <img 
              src={activeGoal.image} 
              alt={activeGoal.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            
            {/* 目標タイトル */}
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <p className="text-sm opacity-80 mb-1">あなたの目標</p>
              <h2 className="text-2xl font-bold drop-shadow-lg">{activeGoal.title}</h2>
            </div>
          </div>
          
          {/* 進捗セクション */}
          <div className="p-6">
            {/* 進捗バー */}
            <div className="mb-4">
              <div className="flex justify-between items-end mb-2">
                <span className="text-3xl font-bold" style={{
                  background: 'linear-gradient(135deg, var(--primary), oklch(0.6 0.2 145))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  {Math.round(progress)}%
                </span>
                <span className="text-sm text-muted-foreground">
                  達成まであと {formatCurrency(remaining, settings.currency)}
                </span>
              </div>
              <div className="progress-3d h-4 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full rounded-full bg-gradient-to-r from-primary via-primary/90 to-emerald-400"
                  style={{
                    boxShadow: 'inset 0 -2px 4px rgba(0,0,0,0.15), inset 0 2px 4px rgba(255,255,255,0.3)'
                  }}
                />
              </div>
            </div>

            {/* 目標金額 */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">目標金額</span>
              <span className="font-semibold">{formatCurrency(activeGoal.targetAmount, settings.currency)}</span>
            </div>
          </div>
        </motion.div>

        {/* ステータスカード */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* 節約額 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card-3d rounded-2xl p-5"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="icon-3d w-8 h-8 rounded-lg flex items-center justify-center">
                <Wallet className="w-4 h-4 text-primary" />
              </div>
              <span className="text-xs text-muted-foreground">節約額</span>
            </div>
            <div className="text-2xl font-bold">
              {formatCurrency(totalSaved, settings.currency)}
            </div>
          </motion.div>

          {/* 禁酒日数 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card-3d rounded-2xl p-5"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="icon-3d w-8 h-8 rounded-lg flex items-center justify-center">
                <Calendar className="w-4 h-4 text-emerald-600" />
              </div>
              <span className="text-xs text-muted-foreground">継続日数</span>
            </div>
            <div className="text-2xl font-bold">
              {daysSober}<span className="text-base font-normal text-muted-foreground ml-1">日</span>
            </div>
          </motion.div>
        </div>

        {/* モチベーションメッセージ */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center py-4"
        >
          {progress >= 100 ? (
            <p className="text-lg font-medium text-primary">
              おめでとう！目標達成です！
            </p>
          ) : daysToGoal <= 7 ? (
            <p className="text-muted-foreground">
              あと<span className="font-bold text-foreground mx-1">{daysToGoal}日</span>で目標達成
            </p>
          ) : (
            <p className="text-muted-foreground">
              このペースであと<span className="font-bold text-foreground mx-1">{daysToGoal}日</span>
            </p>
          )}
        </motion.div>

        {/* スペーサー */}
        <div className="flex-1" />

        {/* 目標変更ボタン */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Link href="/goals">
            <Button 
              variant="outline" 
              className="w-full h-12 rounded-2xl text-sm"
            >
              目標を変更する
            </Button>
          </Link>
        </motion.div>
      </main>
    </div>
  );
}
