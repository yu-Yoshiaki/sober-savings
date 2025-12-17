import { Link, useLocation } from "wouter";
import { Home, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  const navItems = [
    { href: "/", icon: Home, label: "ホーム" },
    { href: "/settings", icon: Settings, label: "設定" },
  ];

  // ホーム画面ではナビゲーションを非表示（ヘッダーに設定ボタンがあるため）
  const showNav = location !== "/";

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
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

      {/* Mobile Bottom Navigation - シンプル版 */}
      {showNav && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 safe-area-pb">
          <div 
            className="glass mx-4 mb-4 rounded-2xl"
            style={{
              boxShadow: '0 -4px 24px -4px rgba(0,0,0,0.1), 0 8px 32px -8px rgba(0,0,0,0.15)'
            }}
          >
            <div className="flex justify-around items-center h-16 px-4">
              {navItems.map((item) => {
                const isActive = location === item.href;
                const Icon = item.icon;
                
                return (
                  <Link key={item.href} href={item.href}>
                    <motion.div
                      whileTap={{ scale: 0.9 }}
                      className={cn(
                        "flex flex-col items-center justify-center w-16 h-12 rounded-xl transition-all",
                        isActive 
                          ? "bg-primary text-primary-foreground" 
                          : "text-muted-foreground"
                      )}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-[10px] mt-1 font-medium">{item.label}</span>
                    </motion.div>
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>
      )}
    </div>
  );
}
