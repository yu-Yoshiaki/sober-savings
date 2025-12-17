import { Link, useLocation } from "wouter";
import { Home, Target, Bot, Settings, Crown } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const { data: status } = trpc.subscription.getStatus.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const navItems = [
    { href: "/", icon: Home, label: "ホーム" },
    { href: "/goals", icon: Target, label: "目標" },
    { href: "/coach", icon: Bot, label: "コーチ", isPro: true },
    { href: "/settings", icon: Settings, label: "設定" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Main Content - Full screen mobile-first */}
      <main className="flex-1 overflow-y-auto pb-20 md:pb-0 md:ml-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={location}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="min-h-full"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Mobile Bottom Navigation - 立体的なガラスモーフィズム */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 safe-area-pb">
        <div 
          className="glass mx-3 mb-3 rounded-3xl"
          style={{
            boxShadow: '0 -4px 24px -4px rgba(0,0,0,0.1), 0 8px 32px -8px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.5)'
          }}
        >
          <div className="flex justify-around items-center h-18 px-2 py-2">
            {navItems.map((item) => {
              const isActive = location === item.href;
              const Icon = item.icon;
              
              return (
                <Link key={item.href} href={item.href}>
                  <motion.div
                    whileTap={{ scale: 0.85 }}
                    className={cn(
                      "flex flex-col items-center justify-center w-16 h-14 rounded-2xl transition-all duration-200",
                      isActive 
                        ? "bg-primary shadow-lg" 
                        : "active:bg-muted/50"
                    )}
                    style={isActive ? {
                      boxShadow: '0 4px 16px -2px rgba(var(--primary), 0.4), inset 0 -2px 4px rgba(0,0,0,0.1), inset 0 2px 4px rgba(255,255,255,0.2)'
                    } : {}}
                  >
                    <div className="relative">
                      <Icon 
                        className={cn(
                          "w-6 h-6 transition-colors",
                          isActive ? "text-primary-foreground drop-shadow-sm" : "text-muted-foreground"
                        )} 
                      />
                      {item.isPro && !status?.isPro && (
                        <div 
                          className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-gradient-to-br from-secondary to-secondary/80 rounded-full flex items-center justify-center"
                          style={{
                            boxShadow: '0 2px 6px -1px rgba(var(--secondary), 0.4)'
                          }}
                        >
                          <Crown className="w-2.5 h-2.5 text-secondary-foreground" />
                        </div>
                      )}
                    </div>
                    <span 
                      className={cn(
                        "text-[10px] mt-1 font-medium transition-colors",
                        isActive ? "text-primary-foreground" : "text-muted-foreground"
                      )}
                    >
                      {item.label}
                    </span>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Desktop Side Navigation - 立体的なレール */}
      <nav 
        className="hidden md:flex fixed left-0 top-0 bottom-0 w-20 flex-col items-center py-6 z-50"
        style={{
          background: 'linear-gradient(180deg, var(--card), oklch(0.96 0.01 85))',
          boxShadow: '4px 0 24px -4px rgba(0,0,0,0.1), inset -1px 0 0 rgba(255,255,255,0.5)'
        }}
      >
        {/* Logo - 立体的 */}
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="icon-3d w-12 h-12 rounded-2xl flex items-center justify-center mb-8"
        >
          <span className="text-xl font-serif font-bold text-primary drop-shadow-sm">S</span>
        </motion.div>

        {/* Nav Items */}
        <div className="flex-1 flex flex-col items-center gap-3">
          {navItems.map((item) => {
            const isActive = location === item.href;
            const Icon = item.icon;
            
            return (
              <Link key={item.href} href={item.href}>
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className={cn(
                    "relative w-14 h-14 rounded-2xl flex flex-col items-center justify-center transition-all duration-200 cursor-pointer",
                    isActive 
                      ? "btn-3d text-primary-foreground" 
                      : "icon-3d text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Icon className={cn("w-5 h-5", isActive && "drop-shadow-sm")} />
                  <span className="text-[9px] mt-1 font-medium">{item.label}</span>
                  {item.isPro && !status?.isPro && (
                    <div 
                      className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-secondary to-secondary/80 rounded-full flex items-center justify-center"
                      style={{
                        boxShadow: '0 2px 8px -1px rgba(var(--secondary), 0.4), inset 0 -1px 2px rgba(0,0,0,0.1), inset 0 1px 2px rgba(255,255,255,0.2)'
                      }}
                    >
                      <Crown className="w-3 h-3 text-secondary-foreground" />
                    </div>
                  )}
                </motion.div>
              </Link>
            );
          })}
        </div>

        {/* Pro Badge - 立体的 */}
        {isAuthenticated && !status?.isPro && (
          <Link href="/pricing">
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="w-14 h-14 rounded-2xl flex flex-col items-center justify-center cursor-pointer"
              style={{
                background: 'linear-gradient(145deg, rgba(var(--secondary), 0.2), rgba(var(--secondary), 0.1))',
                boxShadow: '0 4px 12px -2px rgba(var(--secondary), 0.2), inset 0 -2px 4px rgba(0,0,0,0.05), inset 0 2px 4px rgba(255,255,255,0.3)',
                border: '1px solid rgba(var(--secondary), 0.3)'
              }}
            >
              <Crown className="w-5 h-5 text-secondary drop-shadow-sm" />
              <span className="text-[8px] mt-1 font-bold text-secondary">PRO</span>
            </motion.div>
          </Link>
        )}
      </nav>
    </div>
  );
}
