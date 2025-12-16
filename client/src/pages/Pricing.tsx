import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Check, Sparkles, Crown, ArrowLeft } from "lucide-react";
import { Link, useLocation } from "wouter";
import { getLoginUrl } from "@/const";
import { toast } from "sonner";

export default function Pricing() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const { data: plans } = trpc.subscription.getPlans.useQuery();
  const { data: status } = trpc.subscription.getStatus.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  
  const checkoutMutation = trpc.subscription.createCheckout.useMutation({
    onSuccess: (data) => {
      if (data.url) {
        toast.info("Stripeの決済ページに移動します...");
        window.open(data.url, '_blank');
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleSubscribe = (productId: 'PRO_MONTHLY' | 'PRO_YEARLY') => {
    if (!isAuthenticated) {
      window.location.href = getLoginUrl();
      return;
    }
    checkoutMutation.mutate({ productId });
  };

  const isPro = status?.isPro;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container py-4 flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-serif font-bold text-primary">Sober Savings</h1>
        </div>
      </header>

      <main className="container py-12 md:py-20">
        {/* Hero */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-secondary/20 text-secondary-foreground px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Crown className="w-4 h-4" />
            プランを選択
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-6">
            禁酒の旅を、<br />
            <span className="text-primary">もっと豊かに。</span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Proプランで、AIコーチのサポート、クラウド同期、詳細な統計など、
            禁酒継続に役立つすべての機能をアンロックしましょう。
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Free Plan */}
          <Card className="border-2 border-border">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl font-serif">Free</CardTitle>
              <CardDescription>禁酒を始めたばかりの方に</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <span className="text-4xl font-bold">¥0</span>
                <span className="text-muted-foreground">/月</span>
              </div>
              <ul className="space-y-3">
                {plans?.free.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" disabled>
                現在のプラン
              </Button>
            </CardFooter>
          </Card>

          {/* Pro Monthly */}
          <Card className="border-2 border-primary relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-4 py-1 text-xs font-bold rounded-bl-lg">
              人気
            </div>
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl font-serif flex items-center gap-2">
                Pro
                <Sparkles className="w-5 h-5 text-secondary" />
              </CardTitle>
              <CardDescription>本気で禁酒を続けたい方に</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <span className="text-4xl font-bold">¥480</span>
                <span className="text-muted-foreground">/月</span>
                <p className="text-xs text-muted-foreground mt-1">ビール1杯分で禁酒をサポート</p>
              </div>
              <ul className="space-y-3">
                {plans?.proMonthly.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              {isPro ? (
                <Button variant="outline" className="w-full" disabled>
                  現在のプラン
                </Button>
              ) : (
                <Button 
                  className="w-full bg-primary hover:bg-primary/90"
                  onClick={() => handleSubscribe('PRO_MONTHLY')}
                  disabled={checkoutMutation.isPending}
                >
                  {checkoutMutation.isPending ? '処理中...' : 'Proを始める'}
                </Button>
              )}
            </CardFooter>
          </Card>

          {/* Pro Yearly */}
          <Card className="border-2 border-secondary relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-secondary text-secondary-foreground px-4 py-1 text-xs font-bold rounded-bl-lg">
              お得
            </div>
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl font-serif flex items-center gap-2">
                Pro 年額
                <Crown className="w-5 h-5 text-secondary" />
              </CardTitle>
              <CardDescription>2ヶ月分お得な年額プラン</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <span className="text-4xl font-bold">¥3,980</span>
                <span className="text-muted-foreground">/年</span>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="line-through">¥5,760</span> → ¥1,780お得！
                </p>
              </div>
              <ul className="space-y-3">
                {plans?.proYearly.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              {isPro ? (
                <Button variant="outline" className="w-full" disabled>
                  現在のプラン
                </Button>
              ) : (
                <Button 
                  variant="outline"
                  className="w-full border-secondary text-secondary hover:bg-secondary/10"
                  onClick={() => handleSubscribe('PRO_YEARLY')}
                  disabled={checkoutMutation.isPending}
                >
                  {checkoutMutation.isPending ? '処理中...' : '年額プランを始める'}
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>

        {/* FAQ / Trust Section */}
        <div className="mt-20 text-center max-w-2xl mx-auto">
          <h2 className="text-2xl font-serif font-bold mb-6">よくある質問</h2>
          <div className="space-y-6 text-left">
            <div className="bg-card p-6 rounded-xl border">
              <h3 className="font-bold mb-2">いつでもキャンセルできますか？</h3>
              <p className="text-sm text-muted-foreground">
                はい、いつでもキャンセル可能です。キャンセル後も、支払い済みの期間が終了するまでProプランの機能をご利用いただけます。
              </p>
            </div>
            <div className="bg-card p-6 rounded-xl border">
              <h3 className="font-bold mb-2">支払い方法は？</h3>
              <p className="text-sm text-muted-foreground">
                クレジットカード（Visa、Mastercard、American Express、JCB）に対応しています。決済はStripeを通じて安全に処理されます。
              </p>
            </div>
            <div className="bg-card p-6 rounded-xl border">
              <h3 className="font-bold mb-2">無料プランでも十分使えますか？</h3>
              <p className="text-sm text-muted-foreground">
                はい、無料プランでも基本的な節約トラッキングと目標設定が可能です。まずは無料で始めて、必要に応じてアップグレードしてください。
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
