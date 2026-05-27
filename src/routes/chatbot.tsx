import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { MessageSquare, Send, Sparkles, Brain } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PageHeader } from "@/components/page-header";
import { AiDisclaimer } from "@/components/ai-disclaimer";
import { chatReply } from "@/lib/mock-ai";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/chatbot")({
  head: () => ({
    meta: [
      { title: "AI Chatbot — Worksmith AI" },
      { name: "description", content: "Your workplace AI assistant for any question." },
    ],
  }),
  component: ChatbotPage,
});

interface Msg { role: "user" | "ai"; text: string; id: string }

const prompts = [
  "Draft a polite follow-up to a client",
  "Summarize today's standup notes",
  "Plan a focused 2-hour deep work block",
  "Brainstorm taglines for a product launch",
];

function ChatbotPage() {
  const [messages, setMessages] = useState<Msg[]>([
    { id: "0", role: "ai", text: "Hi! I'm your workplace AI assistant. Ask me anything — emails, planning, research, or just brainstorm." },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  const send = async (text?: string) => {
    const value = (text ?? input).trim();
    if (!value) return;
    setInput("");
    setMessages((m) => [...m, { id: crypto.randomUUID(), role: "user", text: value }]);
    setTyping(true);
    const reply = await chatReply(value);
    setTyping(false);
    setMessages((m) => [...m, { id: crypto.randomUUID(), role: "ai", text: reply }]);
  };

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-4 p-4 md:p-6 lg:p-8" style={{ minHeight: "calc(100vh - 4rem)" }}>
      <PageHeader
        title="AI Chatbot"
        description="Your always-on assistant for quick answers and creative work."
        icon={<MessageSquare className="h-5 w-5" />}
      />

      <Card className="flex flex-1 flex-col overflow-hidden shadow-soft">
        <ScrollArea className="flex-1" viewportRef={scrollRef as any}>
          <div ref={scrollRef} className="space-y-4 p-4 md:p-6">
            {messages.map((m) => (
              <div key={m.id} className={cn("flex gap-3 animate-in fade-in slide-in-from-bottom-2", m.role === "user" && "flex-row-reverse")}>
                <div className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                  m.role === "ai" ? "bg-gradient-primary text-primary-foreground shadow-elegant" : "bg-secondary text-secondary-foreground"
                )}>
                  {m.role === "ai" ? <Brain className="h-4 w-4" /> : "AM"}
                </div>
                <div className={cn(
                  "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                  m.role === "ai" ? "bg-muted text-foreground rounded-tl-sm" : "bg-primary text-primary-foreground rounded-tr-sm"
                )}>
                  {m.text}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-primary text-primary-foreground shadow-elegant">
                  <Brain className="h-4 w-4" />
                </div>
                <div className="flex items-center gap-1 rounded-2xl rounded-tl-sm bg-muted px-4 py-3">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.3s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.15s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {messages.length <= 1 && (
          <div className="flex flex-wrap gap-2 border-t bg-muted/30 px-4 py-3">
            {prompts.map((p) => (
              <button
                key={p}
                onClick={() => send(p)}
                className="flex items-center gap-1.5 rounded-full border bg-card px-3 py-1.5 text-xs transition hover:border-primary hover:text-primary"
              >
                <Sparkles className="h-3 w-3" />{p}
              </button>
            ))}
          </div>
        )}

        <CardContent className="border-t p-3">
          <div className="flex items-end gap-2">
            <Textarea
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              placeholder="Message your assistant…"
              className="min-h-10 max-h-40 resize-none"
            />
            <Button onClick={() => send()} disabled={!input.trim() || typing} className="h-10 bg-gradient-primary shadow-elegant hover:opacity-95">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <AiDisclaimer />
    </div>
  );
}
