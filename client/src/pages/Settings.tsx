import { useApp } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Wallet, Trash2, ArrowLeft, Save, AlertTriangle } from "lucide-react";
import { Link } from "wouter";

interface SettingsForm {
  dailyTarget: number;
  startDate: string;
}

export default function Settings() {
  const { settings, updateSettings, resetData } = useApp();
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  
  const { register, handleSubmit, reset, formState: { isDirty } } = useForm<SettingsForm>({
    defaultValues: {
      dailyTarget: settings.dailyTarget,
      startDate: settings.startDate.split('T')[0],
    }
  });

  useEffect(() => {
    reset({
      dailyTarget: settings.dailyTarget,
      startDate: settings.startDate.split('T')[0],
    });
  }, [settings, reset]);

  const onSubmit = (data: SettingsForm) => {
    updateSettings({
      dailyTarget: Number(data.dailyTarget),
      startDate: new Date(data.startDate).toISOString(),
    });
    toast.success("設定を保存しました");
  };

  const handleReset = () => {
    resetData();
    setShowResetConfirm(false);
    toast.info("データをリセットしました");
  };

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
        <h1 className="text-xl font-bold">設定</h1>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-4 space-y-4">
        
        {/* 1日の節約額 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-3d rounded-2xl p-5"
        >
          <div className="flex items-center gap-4">
            <div className="icon-3d w-12 h-12 rounded-xl flex items-center justify-center">
              <Wallet className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <label className="text-sm text-muted-foreground">1日の節約額</label>
              <div className="flex items-center gap-1">
                <span className="text-muted-foreground">¥</span>
                <input
                  {...register("dailyTarget", { min: 0 })}
                  type="number"
                  className="w-full bg-transparent text-xl font-bold focus:outline-none"
                  placeholder="1000"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* 禁酒開始日 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card-3d rounded-2xl p-5"
        >
          <div className="flex items-center gap-4">
            <div className="icon-3d w-12 h-12 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-emerald-600" />
            </div>
            <div className="flex-1">
              <label className="text-sm text-muted-foreground">禁酒開始日</label>
              <input
                {...register("startDate")}
                type="date"
                className="w-full bg-transparent text-lg font-bold focus:outline-none"
              />
            </div>
          </div>
        </motion.div>

        {/* 保存ボタン */}
        {isDirty && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Button type="submit" className="btn-3d w-full h-12 rounded-xl">
              <Save className="w-4 h-4 mr-2" />
              保存する
            </Button>
          </motion.div>
        )}

        {/* 説明 */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center text-xs text-muted-foreground pt-2"
        >
          開始日と1日の節約額から自動計算されます
        </motion.p>

        {/* リセット */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="pt-8"
        >
          <button
            type="button"
            onClick={() => setShowResetConfirm(true)}
            className="w-full p-4 rounded-2xl border border-destructive/30 flex items-center gap-4 text-left active:bg-destructive/5 transition-colors"
          >
            <div className="w-10 h-10 bg-destructive/10 rounded-xl flex items-center justify-center">
              <Trash2 className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <div className="font-medium text-destructive">データをリセット</div>
              <div className="text-xs text-muted-foreground">すべての進捗を削除</div>
            </div>
          </button>
        </motion.div>
      </form>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end md:items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-3d rounded-3xl p-6 w-full max-w-sm"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-destructive" />
              </div>
              <div>
                <h3 className="font-bold">データをリセット</h3>
                <p className="text-sm text-muted-foreground">この操作は取り消せません</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              すべての進捗がリセットされます。本当によろしいですか？
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 rounded-xl"
                onClick={() => setShowResetConfirm(false)}
              >
                キャンセル
              </Button>
              <Button
                variant="destructive"
                className="flex-1 rounded-xl"
                onClick={handleReset}
              >
                リセット
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
