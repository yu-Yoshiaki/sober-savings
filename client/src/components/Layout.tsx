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

      {/* Mobile Bottom Navigation - iOS/Android style */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-xl border-t border-border/50 z-50 safe-area-pb">
        <div className="flex justify-around items-center h-16 px-2">
          {navItems.map((item) => {
            const isActive = location === item.href;
            const Icon = item.icon;
            
            return (
              <Link key={item.href} href={item.href}>
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  className={cn(
                    "flex flex-col items-center justify-center w-16 h-14 rounded-2xl transition-all duration-200",
                    isActive 
                      ? "bg-primary/10" 
                      : "active:bg-muted"
                  )}
                >
                  <div className="relative">
                    <Icon 
                      className={cn(
                        "w-6 h-6 transition-colors",
                        isActive ? "text-primary" : "text-muted-foreground"
                      )} 
                    />
                    {item.isPro && !status?.isPro && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-secondary rounded-full flex items-center justify-center">
                        <Crown className="w-2 h-2 text-secondary-foreground" />
                      </div>
                    )}
                  </div>
                  <span 
                    className={cn(
                      "text-[10px] mt-1 font-medium transition-colors",
                      isActive ? "text-primary" : "text-muted-foreground"
                    )}
                  >
                    {item.label}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-1 w-1 h-1 bg-primary rounded-full"
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </motion.div>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Desktop Side Navigation - Minimal rail style */}
      <nav className="hidden md:flex fixed left-0 top-0 bottom-0 w-20 bg-card border-r border-border/50 flex-col items-center py-6 z-50">
        {/* Logo */}
        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-8">
          <span className="text-xl font-serif font-bold text-primary">S</span>
        </div>

        {/* Nav Items */}
        <div className="flex-1 flex flex-col items-center gap-2">
          {navItems.map((item) => {
            const isActive = location === item.href;
            const Icon = item.icon;
            
            return (
              <Link key={item.href} href={item.href}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={cn(
                    "relative w-14 h-14 rounded-2xl flex flex-col items-center justify-center transition-all duration-200 cursor-pointer",
                    isActive 
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30" 
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-[9px] mt-1 font-medium">{item.label}</span>
                  {item.isPro && !status?.isPro && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-secondary rounded-full flex items-center justify-center">
                      <Crown className="w-2.5 h-2.5 text-secondary-foreground" />
                    </div>
                  )}
                </motion.div>
              </Link>
            );
          })}
        </div>

        {/* Pro Badge */}
        {isAuthenticated && !status?.isPro && (
          <Link href="/pricing">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-14 h-14 rounded-2xl bg-gradient-to-br from-secondary/20 to-secondary/10 border border-secondary/30 flex flex-col items-center justify-center cursor-pointer"
            >
              <Crown className="w-5 h-5 text-secondary" />
              <span className="text-[8px] mt-1 font-bold text-secondary">PRO</span>
            </motion.div>
          </Link>
        )}
      </nav>
    </div>
  );
}
