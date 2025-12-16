import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Home, Settings, Trophy, Bot, Crown } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { getLoginUrl } from "@/const";
import { cn } from "@/lib/utils";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const { data: status } = trpc.subscription.getStatus.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const navItems = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/goals", icon: Trophy, label: "Goals" },
    { href: "/coach", icon: Bot, label: "AI Coach", isPro: true },
    { href: "/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <div className="min-h-screen bg-background font-sans text-foreground flex flex-col md:flex-row">
      {/* Mobile Header */}
      <header className="md:hidden p-4 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10 flex justify-between items-center">
        <h1 className="font-serif text-xl font-bold text-primary">Sober Savings</h1>
        <div className="text-sm font-medium text-muted-foreground">
          Organic Wealth
        </div>
      </header>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r border-border bg-card p-6 sticky top-0 h-screen">
        <div className="mb-10">
          <h1 className="font-serif text-2xl font-bold text-primary mb-2">Sober Savings</h1>
          <p className="text-sm text-muted-foreground">Invest in a richer life.</p>
        </div>

        <nav className="space-y-2 flex-1">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-3 text-base font-medium transition-all duration-300",
                  location === item.href
                    ? "bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
                {item.isPro && !status?.isPro && (
                  <Crown className="w-3 h-3 text-secondary ml-auto" />
                )}
              </Button>
            </Link>
          ))}
          
          {/* Upgrade CTA for non-Pro users */}
          {isAuthenticated && !status?.isPro && (
            <Link href="/pricing">
              <Button
                variant="outline"
                className="w-full justify-start gap-3 text-base font-medium mt-4 border-secondary/50 text-secondary hover:bg-secondary/10"
              >
                <Crown className="w-5 h-5" />
                Proにアップグレード
              </Button>
            </Link>
          )}
        </nav>

        <div className="mt-auto pt-6 border-t border-border">
          <div className="bg-secondary/30 p-4 rounded-lg">
            <p className="text-xs font-serif italic text-secondary-foreground text-center">
              "The greatest wealth is health."
            </p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 max-w-5xl mx-auto w-full pb-24 md:pb-8">
        {children}
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border p-2 flex justify-around items-center z-50 safe-area-pb">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <div
              className={cn(
                "flex flex-col items-center p-2 rounded-lg transition-colors",
                location === item.href
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <item.icon className="w-6 h-6 mb-1" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </div>
          </Link>
        ))}
      </nav>
    </div>
  );
}
