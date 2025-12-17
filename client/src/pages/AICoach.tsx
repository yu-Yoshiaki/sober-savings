import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Crown, Bot, Send, Sparkles, ChevronRight, User } from "lucide-react";
import { Link } from "wouter";
import { getLoginUrl } from "@/const";
import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { useApp } from "@/contexts/AppContext";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const suggestedQuestions = [
  "今日飲みたくなったらどうすればいい？",
  "禁酒のモチベーションを上げたい",
  "お酒の代わりになるものは？",
  "禁酒の健康効果を教えて",
];

export default function AICoach() {
  const { user, isAuthenticated } = useAuth();
  const { data: status } = trpc.subscription.getStatus.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const { daysSober, totalSaved, settings } = useApp();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
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

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        `素晴らしいですね！${daysSober}日間の禁酒、本当によく頑張っています。飲みたくなった時は、深呼吸をして、なぜ禁酒を始めたのか思い出してみてください。`,
        `あなたはすでに${Math.round(totalSaved / 500)}杯分のお酒代を節約しています。その努力を誇りに思ってください。今日も一緒に頑張りましょう！`,
        `禁酒を続けることで、睡眠の質が向上し、肌の調子も良くなります。体は確実に回復しています。`,
        `辛い時もあると思いますが、それは成長の証です。禁酒を続けることで、あなたの体と心は日々回復しています。`,
        `お酒の代わりに、炭酸水やノンアルコールビール、ハーブティーなどを試してみてはいかがですか？新しいお気に入りが見つかるかもしれません。`,
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      setMessages(prev => [...prev, { role: 'assistant', content: randomResponse }]);
      setIsLoading(false);
    }, 1500);
  };

  const handleSuggestedQuestion = (question: string) => {
    setInput(question);
  };

  // Not logged in
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-20 h-20 bg-secondary/20 rounded-full flex items-center justify-center mb-6"
          >
            <Bot className="w-10 h-10 text-secondary" />
          </motion.div>
          <h1 className="text-2xl font-bold mb-2">AIコーチ</h1>
          <p className="text-muted-foreground mb-6 max-w-sm">
            禁酒をサポートするAIコーチと会話しましょう。ログインして利用を開始してください。
          </p>
          <a href={getLoginUrl()}>
            <Button size="lg" className="rounded-full px-8">
              ログインして始める
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </a>
        </div>
      </div>
    );
  }

  // Not Pro
  if (!isPro) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-24 h-24 bg-gradient-to-br from-secondary/30 to-secondary/10 rounded-full flex items-center justify-center mb-6 relative"
          >
            <Bot className="w-12 h-12 text-secondary" />
            <div className="absolute -top-1 -right-1 w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
              <Crown className="w-4 h-4 text-secondary-foreground" />
            </div>
          </motion.div>
          
          <h1 className="text-2xl font-bold mb-2">AIコーチ</h1>
          <div className="inline-flex items-center gap-1 bg-secondary/20 text-secondary px-3 py-1 rounded-full text-sm font-medium mb-4">
            <Crown className="w-3 h-3" />
            Pro限定機能
          </div>
          
          <p className="text-muted-foreground mb-6 max-w-sm">
            禁酒をサポートするAIコーチがあなたの相談に24時間対応。モチベーション維持や代替行動のアドバイスを受けられます。
          </p>
          
          <div className="bg-card rounded-3xl p-5 mb-6 w-full max-w-sm text-left border border-border/50">
            <div className="text-sm font-medium mb-3">AIコーチでできること</div>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 bg-secondary/10 rounded-xl flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4 text-secondary" />
                </div>
                飲みたくなった時のアドバイス
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 bg-secondary/10 rounded-xl flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4 text-secondary" />
                </div>
                モチベーション維持のサポート
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 bg-secondary/10 rounded-xl flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4 text-secondary" />
                </div>
                お酒の代替手段の提案
              </li>
            </ul>
          </div>
          
          <Link href="/pricing">
            <Button size="lg" className="rounded-full px-8 bg-secondary hover:bg-secondary/90 text-secondary-foreground">
              <Crown className="w-4 h-4 mr-2" />
              Proにアップグレード
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Pro user - Chat interface
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border/50 px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-secondary/20 rounded-full flex items-center justify-center">
            <Bot className="w-5 h-5 text-secondary" />
          </div>
          <div>
            <h1 className="font-bold">AIコーチ</h1>
            <p className="text-xs text-muted-foreground">24時間あなたをサポート</p>
          </div>
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-24">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mb-4">
              <Bot className="w-8 h-8 text-secondary" />
            </div>
            <h2 className="font-bold mb-2">何でも相談してください</h2>
            <p className="text-sm text-muted-foreground mb-6 max-w-xs">
              禁酒に関する悩みや質問があれば、AIコーチがサポートします。
            </p>
            
            {/* Suggested questions */}
            <div className="w-full max-w-sm space-y-2">
              {suggestedQuestions.map((question, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSuggestedQuestion(question)}
                  className="w-full text-left p-4 bg-card rounded-2xl border border-border/50 text-sm hover:bg-muted transition-colors"
                >
                  {question}
                </motion.button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  msg.role === 'user' ? 'bg-primary' : 'bg-secondary/20'
                }`}>
                  {msg.role === 'user' ? (
                    <User className="w-4 h-4 text-primary-foreground" />
                  ) : (
                    <Bot className="w-4 h-4 text-secondary" />
                  )}
                </div>
                <div className={`max-w-[75%] p-4 rounded-2xl ${
                  msg.role === 'user' 
                    ? 'bg-primary text-primary-foreground rounded-tr-sm' 
                    : 'bg-card border border-border/50 rounded-tl-sm'
                }`}>
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                </div>
              </motion.div>
            ))}
            {isLoading && (
              <div className="flex gap-3">
                <div className="shrink-0 w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-secondary" />
                </div>
                <div className="bg-card border border-border/50 p-4 rounded-2xl rounded-tl-sm">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input area */}
      <div className="fixed bottom-16 md:bottom-0 left-0 right-0 md:left-20 bg-background border-t border-border/50 p-4">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="flex gap-2 max-w-2xl mx-auto"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="メッセージを入力..."
            className="flex-1 bg-muted rounded-full px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            disabled={isLoading}
          />
          <motion.button
            type="submit"
            whileTap={{ scale: 0.95 }}
            disabled={!input.trim() || isLoading}
            className="w-12 h-12 bg-primary rounded-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5 text-primary-foreground" />
          </motion.button>
        </form>
      </div>
    </div>
  );
}
