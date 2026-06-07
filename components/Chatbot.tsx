"use client";

import { useChat, UIMessage } from '@ai-sdk/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useRef, useEffect, useState } from 'react';
import fpPromise from '@fingerprintjs/fingerprintjs';
import { FiMessageSquare, FiSend, FiLoader, FiX } from 'react-icons/fi';
import Image from 'next/image';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [visitorId, setVisitorId] = useState<string>('');

  useEffect(() => {
    const loadFingerprint = async () => {
      const fp = await fpPromise.load();
      const result = await fp.get();
      setVisitorId(result.visitorId);
    };
    loadFingerprint();
  }, []);

  const { messages, sendMessage, status, error } = useChat();
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300); // Wait for the slide-in animation to finish
    }
  }, [isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage({ text: input }, { headers: visitorId ? { 'x-visitor-id': visitorId } : {} });
    setInput('');
  };

  const isLoading = status === 'submitted' || status === 'streaming';
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom only when a new message arrives (not during streaming)
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-40 p-4 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 transition-all duration-300 hover:scale-110 active:scale-95 ${isOpen ? 'opacity-0 scale-50 pointer-events-none' : 'opacity-100 scale-100'
          }`}
        aria-label="Open AI Chat"
      >
        <FiMessageSquare className="w-6 h-6" />
      </button>

      {/*outside click */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Off-canvas Sidebar */}
      <div
        className={`fixed top-0 right-0 h-screen w-full sm:w-[400px] bg-background border-l border-white/10 z-50 shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/5">
          <div className="flex items-center gap-3">
            <div className="relative w-8 h-8">
              <Image
                src="/Logo.svg"
                alt="Logo"
                fill
                className="rounded-full object-cover dark:invert transition-all duration-300"
                sizes="32px"
              />
            </div>
            <div>
              <h3 className="font-semibold text-sm">AI Assistant</h3>
              <p className="text-xs text-muted-foreground">Ask about my work</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-full hover:bg-white/10 transition-colors text-muted-foreground hover:text-foreground"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-3 text-muted-foreground opacity-70">
              <FiMessageSquare className="w-10 h-10 mb-2" />
              <p className="text-sm px-4">
                Hi! I'm an AI trained on Shreyash's portfolio. <br /> Ask me anything!
              </p>
            </div>
          )}

          {messages.map((m: UIMessage) => (
            <div
              key={m.id}
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${m.role === 'user'
                  ? 'bg-primary/10 border border-primary/20 text-foreground rounded-br-sm'
                  : 'bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-foreground rounded-bl-sm'
                  }`}
              >
                {m.parts?.map((part, i) => {
                  if (part.type === 'text') {
                    return (
                      <div key={i} className="prose prose-sm dark:prose-invert max-w-none prose-p:leading-relaxed prose-pre:bg-black/50 prose-pre:border prose-pre:border-white/10 prose-pre:p-3 prose-pre:rounded-lg prose-p:text-inherit prose-headings:text-inherit prose-strong:text-inherit prose-a:text-primary">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {part.text}
                        </ReactMarkdown>
                      </div>
                    );
                  }
                  if (part.type === 'reasoning') {
                    return (
                      <div key={i} className="italic opacity-70 border-l-2 pl-2 mb-2 text-xs text-muted-foreground">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {part.text}
                        </ReactMarkdown>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            </div>
          ))}
          {isLoading && messages[messages.length - 1]?.role === 'user' && (
            <div className="flex justify-start">
              <div className="max-w-[85%] rounded-2xl px-4 py-3 text-sm bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-foreground rounded-bl-sm flex items-center gap-2">
                <FiLoader className="w-4 h-4 animate-spin" />
                <span>Thinking...</span>
              </div>
            </div>
          )}
          {error && (
            <div className="flex justify-start">
              <div className="max-w-[85%] rounded-2xl px-4 py-3 text-sm bg-red-500/10 border border-red-500/20 text-red-400 rounded-bl-sm">
                {(() => {
                  try {
                    return JSON.parse(error.message).error || error.message;
                  } catch {
                    return error.message || 'An error occurred';
                  }
                })()}
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-black/10 dark:border-white/10 bg-background/50 pb-8 lg:pb-4">
          <form
            onSubmit={handleSubmit}
            className={`flex items-center gap-2 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-full p-1 pl-4 transition-all ${isLoading
              ? 'opacity-50 cursor-not-allowed'
              : 'focus-within:ring-1 focus-within:ring-primary focus-within:border-primary'
              }`}
          >
            <input
              ref={inputRef}
              value={input}
              onChange={handleInputChange}
              placeholder={isLoading ? "AI is typing..." : "Ask anything..."}
              className="flex-1 bg-transparent border-none outline-none text-sm placeholder:text-muted-foreground/50 py-2 disabled:cursor-not-allowed disabled:bg-transparent text-foreground"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="p-2 rounded-full bg-primary text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-colors hover:bg-primary/90"
            >
              <FiSend className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
