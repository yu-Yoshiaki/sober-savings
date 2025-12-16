import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Sparkles, Lock, Send, Bot, User, ArrowLeft, Crown } from "lucide-react";
import { Link } from "wouter";
import { getLoginUrl } from "@/const";
import { useState, useRef, useEffect } from "react";
import { Streamdown } from "streamdown";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function AICoach() {
  const { user, isAuthenticated } = useAuth();
  const { data: status } = trpc.subscription.getStatus.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'こんにちは！私はあなたの禁酒をサポートするAIコーチです。禁酒に関するお悩みや、モチベーションを上げたい時など、何でも相談してください。一緒に頑張りましょう！'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isPro = status?.isPro;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    // Simulate AI response (in production, this would call the backend)
    setTimeout(() => {
      const responses = [
        "禁酒を続けることは本当に素晴らしいことです。毎日の小さな勝利を積み重ねていきましょう。今日も一日、お酒なしで過ごせたことを誇りに思ってください。",
        "お酒を飲みたくなった時は、深呼吸をして、なぜ禁酒を始めたのかを思い出してみてください。あなたの目標を達成するために、一緒に頑張りましょう。",
        "禁酒によって節約できたお金で、自分へのご褒美を考えてみるのはいかがですか？新しい趣味を始めたり、行きたかった場所に行ったり、可能性は無限大です。",
        "辛い時もあると思いますが、それは成長の証です。禁酒を続けることで、あなたの体と心は日々回復しています。その変化を感じてみてください。",
        "今日の調子はいかがですか？禁酒を続ける中で感じた変化や、困っていることがあれば、いつでも話してください。私はあなたの味方です。"
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      setMessages(prev => [...prev, { role: 'assistant', content: randomResponse }]);
      setIsLoading(false);
    }, 1500);
  };

  // Not logged in
  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center">
          <CardHeader>
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Lock className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="font-serif text-2xl">ログインが必要です</CardTitle>
            <CardDescription>
              AIコーチ機能を利用するには、ログインしてください。
            </CardDescription>
          </CardHeader>
          <CardContent>
            <a href={getLoginUrl()}>
              <Button className="w-full">ログインする</Button>
            </a>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Not Pro
  if (!isPro) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center border-2 border-secondary/50">
          <CardHeader>
            <div className="mx-auto w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mb-4">
              <Crown className="w-8 h-8 text-secondary" />
            </div>
            <CardTitle className="font-serif text-2xl flex items-center justify-center gap-2">
              Pro限定機能
              <Sparkles className="w-5 h-5 text-secondary" />
            </CardTitle>
            <CardDescription className="text-base">
              AIコーチは、Proプランでご利用いただける機能です。
              パーソナライズされたアドバイスで、禁酒の継続をサポートします。
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-lg text-left space-y-2">
              <p className="text-sm font-medium">AIコーチでできること：</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• 禁酒に関する悩み相談</li>
                <li>• モチベーション維持のアドバイス</li>
                <li>• パーソナライズされた励まし</li>
                <li>• 禁酒のコツや知識の提供</li>
              </ul>
            </div>
            <Link href="/pricing">
              <Button className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                Proプランを見る
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Pro user - show chat
  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-4 pb-4 border-b">
        <div className="p-2 bg-primary/10 rounded-full">
          <Bot className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-serif font-bold">AIコーチ</h1>
          <p className="text-sm text-muted-foreground">禁酒をサポートするパーソナルコーチ</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto py-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
              message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary/20'
            }`}>
              {message.role === 'user' ? (
                <User className="w-4 h-4" />
              ) : (
                <Bot className="w-4 h-4 text-secondary" />
              )}
            </div>
            <div className={`max-w-[80%] p-4 rounded-2xl ${
              message.role === 'user' 
                ? 'bg-primary text-primary-foreground rounded-tr-sm' 
                : 'bg-muted rounded-tl-sm'
            }`}>
              <Streamdown>{message.content}</Streamdown>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3">
            <div className="shrink-0 w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center">
              <Bot className="w-4 h-4 text-secondary" />
            </div>
            <div className="bg-muted p-4 rounded-2xl rounded-tl-sm">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="pt-4 border-t">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="flex gap-2"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="メッセージを入力..."
            className="flex-1"
            disabled={isLoading}
          />
          <Button type="submit" disabled={!input.trim() || isLoading}>
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
