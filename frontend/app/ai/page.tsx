"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import AppShell from "@/components/layout/AppShell";
import Header from "@/components/layout/Header";
import { Input } from "@/components/ui/input";
import { HugeiconsIcon } from "@hugeicons/react";
import { SparklesIcon, SentIcon } from "@hugeicons/core-free-icons";
import { useChatStore } from "@/store/chatStore";

const suggestedQuestions = [
  "How can I save more?",
  "Analyze my spending",
  "Budget tips",
  "Can I afford a big purchase?",
];

export default function AIPage() {
  const { messages, isLoading, sendMessage } = useChatStore();
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || isLoading) return;
    setInput("");
    await sendMessage(text);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <AppShell>
      <Header title="AI Coach" />
      <div className="p-4 md:p-6 flex flex-col h-[calc(100vh-4rem-6rem)] md:h-[calc(100vh-4rem)]">
        {/* Chat header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center gap-3 pb-5 border-b border-border mb-5"
        >
          <div className="relative">
            <div className="size-11 rounded-2xl bg-primary/15 flex items-center justify-center">
              <HugeiconsIcon icon={SparklesIcon} className="size-5 text-primary" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full bg-green-500 ring-2 ring-background animate-pulse-dot" />
          </div>
          <div>
            <h3 className="font-display font-bold text-sm">PayPath AI</h3>
            <p className="text-xs text-muted-foreground">Online</p>
          </div>
        </motion.div>

        {/* Chat area */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-4 pb-4">
          {messages.map((msg) =>
            msg.role === "ai" ? (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex gap-3 max-w-lg"
              >
                <div className="size-8 rounded-xl bg-primary/15 flex items-center justify-center shrink-0 mt-1">
                  <HugeiconsIcon icon={SparklesIcon} className="size-3.5 text-primary" />
                </div>
                <div className="bg-muted/50 dark:bg-white/[0.04] rounded-2xl rounded-tl-md p-4">
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex justify-end max-w-lg ml-auto"
              >
                <div className="bg-primary/10 dark:bg-primary/15 rounded-2xl rounded-tr-md p-4">
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                </div>
              </motion.div>
            )
          )}

          {/* Typing indicator */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-3 max-w-lg"
            >
              <div className="size-8 rounded-xl bg-primary/15 flex items-center justify-center shrink-0 mt-1">
                <HugeiconsIcon icon={SparklesIcon} className="size-3.5 text-primary" />
              </div>
              <div className="bg-muted/50 dark:bg-white/[0.04] rounded-2xl rounded-tl-md p-4">
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="size-2 rounded-full bg-muted-foreground/40"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Suggested questions */}
        {messages.length <= 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap gap-2 pb-3"
          >
            {suggestedQuestions.map((q) => (
              <button
                key={q}
                onClick={() => sendMessage(q)}
                disabled={isLoading}
                className="text-xs font-medium text-primary bg-primary/10 hover:bg-primary/15 rounded-full px-3 py-1.5 transition-colors disabled:opacity-50"
              >
                {q}
              </button>
            ))}
          </motion.div>
        )}

        {/* Input bar */}
        <div className="flex items-center gap-2 bg-card rounded-2xl shadow-card dark:shadow-none dark:border dark:border-white/[0.06] p-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask your AI coach..."
            disabled={isLoading}
            className="border-0 bg-transparent focus-visible:ring-0 focus-visible:border-0 h-10"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="size-10 rounded-xl bg-primary flex items-center justify-center shrink-0 hover:bg-primary/85 transition-colors disabled:opacity-50"
          >
            <HugeiconsIcon icon={SentIcon} className="size-[18px] text-primary-foreground" />
          </button>
        </div>
      </div>
    </AppShell>
  );
}
