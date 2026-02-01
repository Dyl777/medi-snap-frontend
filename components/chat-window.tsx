'use client';

import React from "react"

import { useCallback, useRef, useState, useEffect } from 'react';
import { Send, Loader2, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface ChatWindowProps {
  onSendQuestion: (question: string) => void;
  isLoading?: boolean;
  suggestedQuestions?: string[];
}

export function ChatWindow({
  onSendQuestion,
  isLoading = false,
  suggestedQuestions = [
    'What does this mean?',
    'What are the risks?',
    'What next?',
  ],
}: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [localLoading, setLocalLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendQuestion = useCallback(
    async (question: string) => {
      if (!question.trim() || localLoading || isLoading) return;

      setLocalLoading(true);
      const newMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: question,
      };

      setMessages((prev) => [...prev, newMessage]);
      setInput('');

      try {
        onSendQuestion(question);

        setTimeout(() => {
          const assistantMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content:
              'Based on the document analysis, I can help explain this. Please note I provide general medical information, not professional medical advice. Always consult your healthcare provider.',
          };
          setMessages((prev) => [...prev, assistantMessage]);
          setLocalLoading(false);
        }, 800);
      } catch (error) {
        console.error('[v0] Error sending question:', error);
        setLocalLoading(false);
      }
    },
    [localLoading, isLoading, onSendQuestion]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendQuestion(input);
  };

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border bg-muted/50">
      {/* Messages */}
      <ScrollArea
        ref={scrollRef}
        className="h-64 sm:h-80 px-4 py-4 space-y-3"
      >
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="rounded-2xl bg-primary/10 p-3 mb-3">
              <MessageCircle className="h-6 w-6 text-primary" aria-hidden="true" />
            </div>
            <p className="text-sm text-muted-foreground">
              Ask a question to get started
            </p>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 animate-in fade-in ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-xs sm:max-w-sm px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                message.role === 'user'
                  ? 'bg-primary text-primary-foreground rounded-br-none'
                  : 'bg-background border border-border text-foreground rounded-bl-none'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}

        {localLoading && (
          <div className="flex gap-3 justify-start">
            <div className="max-w-xs sm:max-w-sm px-4 py-3 rounded-2xl bg-background border border-border rounded-bl-none">
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            </div>
          </div>
        )}
      </ScrollArea>

      {/* Suggested Questions */}
      {messages.length === 0 && (
        <div className="px-4 pb-3 space-y-2">
          <p className="text-xs text-muted-foreground font-medium">Quick Questions:</p>
          <div className="flex flex-wrap gap-2">
            {suggestedQuestions.map((q) => (
              <button
                key={q}
                onClick={() => handleSendQuestion(q)}
                className="text-xs px-3 py-2 rounded-full bg-background hover:bg-muted border border-border transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-border">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question..."
            disabled={localLoading || isLoading}
            className="rounded-2xl h-10 bg-background border-border"
          />
          <Button
            type="submit"
            disabled={!input.trim() || localLoading || isLoading}
            size="sm"
            className="rounded-2xl h-10 w-10 p-0"
          >
            {localLoading || isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
              <Send className="h-4 w-4" aria-hidden="true" />
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
