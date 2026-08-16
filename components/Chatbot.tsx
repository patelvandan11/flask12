'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot } from 'lucide-react';
import { ChatMessage } from '@/types/portfolio';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content:
        '👋 Hello! I am **Vandan\'s AI Assistant**.\n\nFeel free to ask me anything about Vandan Patel\'s profile, skills, work experience, projects, or contact information.',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = input.trim();
    if (!query || loading) return;

    const newHistory: ChatMessage[] = [
      ...messages,
      { role: 'user', content: query },
    ];
    setMessages(newHistory);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newHistory }),
      });

      const data = await res.json();
      const reply = data.reply || 'Sorry, I could not process that query right now.';

      setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: '⚠️ Network error occurred while connecting to the AI Assistant.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const renderFormattedContent = (content: string) => {
    let html = content
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(
        /\[(.*?)\]\((.*?)\)/g,
        '<a href="$2" target="_blank" rel="noopener noreferrer" style="color: var(--accent-cyan, #06b6d4); text-decoration: underline;">$1</a>'
      )
      .replace(/\n\n/g, '<br/><br/>')
      .replace(/\n- (.*?)/g, '<br/>&bull; $1')
      .replace(/\n/g, '<br/>');

    return <span dangerouslySetInnerHTML={{ __html: html }} />;
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999]">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-gradient-to-br from-cyber-cyan to-cyber-violet text-white flex items-center justify-center relative cursor-pointer transition-all duration-300 hover:scale-110 shadow-[0_8px_24px_rgba(6,182,212,0.35)] hover:shadow-[0_12px_30px_rgba(6,182,212,0.5)] border border-white/10 outline-none"
        aria-label="Open AI Assistant"
        title="Chat with Vandan's AI Profile"
      >
        {isOpen ? <X size={22} /> : <MessageSquare size={22} />}
        <span className="absolute top-0.5 right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-[#030712] rounded-full z-10 animate-pulse"></span>
      </button>

      {/* Chat Modal */}
      <div className={`fixed bottom-24 right-0 w-[380px] max-w-[calc(100vw-2rem)] h-[540px] max-h-[calc(100vh-8rem)] flex flex-col overflow-hidden shadow-2xl rounded-2xl border border-black/10 dark:border-white/10 transition-all duration-300 transform origin-bottom-right bg-white/95 dark:bg-[#07090e]/95 backdrop-blur-xl ${
        isOpen ? 'scale-100 translate-y-0 opacity-100 visible' : 'scale-90 translate-y-4 opacity-0 invisible'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5">
          <div className="flex items-center gap-3">
            <div className="w-[38px] h-[38px] rounded-full flex items-center justify-center bg-cyber-cyan/10 border border-cyber-cyan/30 text-cyber-cyan relative">
              <Bot size={20} />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border border-white dark:border-[#07090e]"></span>
            </div>
            <div>
              <h3 className="text-[0.95rem] font-bold text-text-primaryLight dark:text-text-primaryDark leading-snug">Vandan&apos;s AI Assistant</h3>
              <p className="text-[0.72rem] text-text-muted">Ask me anything about Vandan&apos;s profile</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-text-muted hover:text-text-primaryLight dark:hover:text-text-primaryDark transition-colors duration-150 cursor-pointer"
            aria-label="Close Chat"
          >
            <X size={18} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 p-5 overflow-y-auto flex flex-col gap-4 scroll-smooth">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`max-w-[85%] px-4 py-3 rounded-2xl text-[0.88rem] leading-relaxed break-words shadow-sm ${
                msg.role === 'user'
                  ? 'self-end bg-gradient-to-br from-cyber-cyan to-cyber-blue text-white rounded-br-none'
                  : 'self-start bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 text-text-primaryLight dark:text-text-primaryDark rounded-bl-none'
              }`}
            >
              {renderFormattedContent(msg.content)}
            </div>
          ))}

          {loading && (
            <div className="self-start bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 text-text-primaryLight dark:text-text-primaryDark max-w-[85%] px-5 py-3.5 rounded-2xl rounded-bl-none">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-text-muted rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-1.5 h-1.5 bg-text-muted rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-1.5 h-1.5 bg-text-muted rounded-full animate-bounce"></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <form onSubmit={handleSend} className="p-3.5 border-t border-black/10 dark:border-white/10 flex gap-2 bg-black/5 dark:bg-white/5">
          <input
            type="text"
            className="flex-1 px-4 py-2.5 rounded-full border border-black/10 dark:border-white/10 bg-white/90 dark:bg-[#030712]/60 text-text-primaryLight dark:text-text-primaryDark text-[0.88rem] focus:border-cyber-cyan focus:outline-none transition-all duration-200 shadow-inner"
            placeholder="Type your question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
          />
          <button
            type="submit"
            className="w-10 h-10 rounded-full bg-cyber-cyan hover:bg-cyber-blue text-white flex items-center justify-center cursor-pointer transition-all duration-200 shadow-md hover:scale-105 disabled:opacity-50"
            aria-label="Send Message"
            disabled={loading}
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}
