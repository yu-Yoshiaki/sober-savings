import { useApp } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { User, Calendar, Wallet, Trash2, ChevronRight, Save, AlertTriangle } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { getLoginUrl } from "@/const";

interface SettingsForm {
  name: string;
  dailyTarget: number;
  startDate: string;
}

export default function Settings() {
  const { settings, updateSettings, resetData } = useApp();
  const { user, isAuthenticated, logout } = useAuth();
  const { data: status } = trpc.subscription.getStatus.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  
  const { register, handleSubmit, reset, formState: { isDirty } } = useForm<SettingsForm>({
    defaultValues: {
      name: settings.name,
      dailyTarget: settings.dailyTarget,
      startDate: settings.startDate.split('T')[0],
    }
  });

  useEffect(() => {
    reset({
      name: settings.name,
      dailyTarget: settings.dailyTarget,
      startDate: settings.startDate.split('T')[0],
    });
  }, [settings, reset]);

  const onSubmit = (data: SettingsForm) => {
    updateSettings({
      name: data.name,
      dailyTarget: Number(data.dailyTarget),
      startDate: new Date(data.startDate).toISOString(),
    });
    toast.success("設定を保存しました");
  };

  const handleReset = () => {
    resetData();
    setShowResetConfirm(false);
    toast.info("すべてのデータをリセットしました");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border/50 px-4 py-4">
        <h1 className="text-2xl font-bold">設定</h1>
      </div>

      <div className="px-4 py-4 space-y-6">
        {/* Account Section */}
        <section>
          <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 px-1">
            アカウント
          </h2>
          <div className="bg-card rounded-3xl overflow-hidden border border-border/50">
            {isAuthenticated ? (
              <>
                <div className="p-4 flex items-center gap-4">
                  <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="w-7 h-7 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold truncate">{user?.name || 'ユーザー'}</div>
                    <div className="text-sm text-muted-foreground truncate">{user?.email}</div>
                    {status?.isPro && (
                      <div className="inline-flex items-center gap-1 bg-secondary/20 text-secondary px-2 py-0.5 rounded-full text-xs font-medium mt-1">
                        Pro
                      </div>
                    )}
                  </div>
                </div>
                <div className="border-t border-border/50">
                  <button
                    onClick={logout}
                    className="w-full p-4 text-left text-destructive text-sm font-medium active:bg-muted transition-colors"
                  >
                    ログアウト
                  </button>
                </div>
              </>
            ) : (
              <a href={getLoginUrl()} className="block">
                <motion.div 
                  whileTap={{ scale: 0.98 }}
                  className="p-4 flex items-center gap-4"
                >
                  <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="w-7 h-7 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="font-bold">ログイン</div>
                    <div className="text-sm text-muted-foreground">データを同期して守ろう</div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </motion.div>
              </a>
            )}
          </div>
        </section>

        {/* Settings Form */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <section>
            <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 px-1">
              禁酒設定
            </h2>
            <div className="bg-card rounded-3xl overflow-hidden border border-border/50 divide-y divide-border/50">
              {/* Name */}
              <div className="p-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-500" />
                  </div>
                  <div className="flex-1">
                    <label className="text-sm text-muted-foreground">ニックネーム</label>
                    <input
                      {...register("name")}
                      className="w-full bg-transparent font-medium focus:outline-none"
                      placeholder="あなたの名前"
                    />
                  </div>
                </div>
              </div>

              {/* Daily Target */}
              <div className="p-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center">
                    <Wallet className="w-5 h-5 text-green-500" />
                  </div>
                  <div className="flex-1">
                    <label className="text-sm text-muted-foreground">1日の節約目標額</label>
                    <div className="flex items-center gap-1">
                      <span className="text-muted-foreground">¥</span>
                      <input
                        {...register("dailyTarget", { min: 0 })}
                        type="number"
                        className="w-full bg-transparent font-medium focus:outline-none"
                        placeholder="1000"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Start Date */}
              <div className="p-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-purple-500" />
                  </div>
                  <div className="flex-1">
                    <label className="text-sm text-muted-foreground">禁酒開始日</label>
                    <input
                      {...register("startDate")}
                      type="date"
                      className="w-full bg-transparent font-medium focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Save Button */}
          {isDirty && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4"
            >
              <Button type="submit" className="w-full rounded-2xl h-12">
                <Save className="w-4 h-4 mr-2" />
                変更を保存
              </Button>
            </motion.div>
          )}
        </form>

        {/* Danger Zone */}
        <section>
          <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 px-1">
            データ管理
          </h2>
          <div className="bg-card rounded-3xl overflow-hidden border border-destructive/30">
            <motion.button
              type="button"
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowResetConfirm(true)}
              className="w-full p-4 flex items-center gap-4 text-left active:bg-muted transition-colors"
            >
              <div className="w-10 h-10 bg-destructive/10 rounded-xl flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-destructive" />
              </div>
              <div className="flex-1">
                <div className="font-medium text-destructive">データをリセット</div>
                <div className="text-xs text-muted-foreground">すべての進捗と設定を削除</div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </motion.button>
          </div>
        </section>

        {/* App Info */}
        <section className="text-center text-xs text-muted-foreground pb-8">
          <p>Sober Savings v1.0.0</p>
          <p className="mt-1">あなたの禁酒をサポートします</p>
        </section>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end md:items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-3xl p-6 w-full max-w-sm"
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
              すべての禁酒記録、目標、設定が削除されます。本当にリセットしますか？
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
