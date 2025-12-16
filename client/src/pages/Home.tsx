import { useAuth } from "@/_core/hooks/useAuth";
import { useApp } from "@/contexts/AppContext";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ArrowRight, WineOff, Sparkles } from "lucide-react";
import { Link } from "wouter";
import { getLoginUrl } from "@/const";

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const { totalSaved, daysSober, activeGoalId, goals, settings } = useApp();
  
  const activeGoal = goals.find(g => g.id === activeGoalId) || goals[0];
  const progress = Math.min(100, (totalSaved / activeGoal.targetAmount) * 100);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-primary shadow-xl">
        <div className="absolute inset-0 bg-[url('/images/hero-lifestyle.png')] bg-cover bg-center opacity-40 mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70" />
        <div className="relative p-8 md:p-12 flex flex-col md:flex-row justify-between items-center gap-8 text-primary-foreground">
          <div className="space-y-4 text-center md:text-left">
            <h2 className="text-lg font-medium opacity-90">Current Progress</h2>
            <div className="space-y-1">
              <p className="text-5xl md:text-7xl font-serif font-bold tracking-tight">
                {formatCurrency(totalSaved, settings.currency)}
              </p>
              <p className="text-sm md:text-base opacity-80 uppercase tracking-widest font-medium">
                Saved in {daysSober} Days
              </p>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 w-full md:w-80 shadow-inner">
            <div className="flex items-center gap-3 mb-4">
              <WineOff className="w-6 h-6 text-secondary" />
              <span className="font-medium">Alcohol Free Streak</span>
            </div>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-bold">{daysSober}</span>
              <span className="text-sm mb-1 opacity-80">days</span>
            </div>
            <p className="text-xs mt-2 opacity-70">
              Keep going! Your body and wallet thank you.
            </p>
          </div>
        </div>
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
                <h3 className="font-serif font-bold text-lg">Upgrade to Pro</h3>
                <p className="text-sm text-muted-foreground">
                  Sync across devices, get AI coaching, and unlock detailed analytics.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Link href="/pricing">
                <Button variant="default" className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                  View Plans
                </Button>
              </Link>
              <a href={getLoginUrl()}>
                <Button variant="outline">
                  Sign In
                </Button>
              </a>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Active Goal Section */}
      <section>
        <div className="flex justify-between items-end mb-4">
          <h3 className="text-2xl font-serif font-bold text-foreground">Next Milestone</h3>
          <Link href="/goals">
            <Button variant="link" className="text-primary p-0 h-auto font-medium">
              View all goals <ArrowRight className="w-4 h-4 ml-1" />
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
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:bg-gradient-to-r" />
              <div className="absolute bottom-0 left-0 p-6 text-white md:hidden">
                <h4 className="text-xl font-bold font-serif">{activeGoal.title}</h4>
              </div>
            </div>
            
            <CardContent className="p-6 md:p-10 flex flex-col justify-center space-y-6">
              <div className="hidden md:block space-y-2">
                <div className="text-sm text-primary font-bold tracking-wider uppercase">Target Goal</div>
                <h4 className="text-3xl font-serif font-bold text-foreground">{activeGoal.title}</h4>
              </div>
              
              <p className="text-muted-foreground leading-relaxed">
                {activeGoal.description}
              </p>

              <div className="space-y-2">
                <div className="flex justify-between text-sm font-medium">
                  <span>{formatCurrency(totalSaved, settings.currency)}</span>
                  <span className="text-muted-foreground">of {formatCurrency(activeGoal.targetAmount, settings.currency)}</span>
                </div>
                <Progress value={progress} className="h-3 bg-muted [&>div]:bg-primary [&>div]:transition-all [&>div]:duration-1000" />
                <p className="text-xs text-right text-muted-foreground pt-1">
                  {Math.round(progress)}% funded
                </p>
              </div>
            </CardContent>
          </div>
        </Card>
      </section>

      {/* Quick Actions / Insights Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-secondary/20 border-none shadow-sm">
          <CardHeader>
            <CardTitle className="font-serif text-xl">Daily Motivation</CardTitle>
          </CardHeader>
          <CardContent>
            <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground">
              "Sobriety is not a limitation, it's a liberation. You are buying back your freedom, one day at a time."
            </blockquote>
          </CardContent>
        </Card>

        <Card className="bg-accent/20 border-none shadow-sm">
          <CardHeader>
            <CardTitle className="font-serif text-xl">Health Gains</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-sm">Better sleep quality</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-sm">Improved skin complexion</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-sm">Mental clarity & focus</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
