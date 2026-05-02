// src/components/user/AIBotChat.jsx
// AI Chat interface with OpenAI integration

import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, RefreshCw, AlertCircle, Sparkles } from 'lucide-react';
import { sendAIMessage } from '../../lib/gemini';

export default function AIBotChat() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hello! I'm your AI College Assistant. How can I help you today? I can help with study tips, project ideas, or any general questions you have! 🎓",
      timestamp: new Date().toISOString()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { 
      role: 'user', 
      content: input.trim(),
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      // Create message history for OpenAI (standardize format)
      const chatHistory = messages.concat(userMessage).map(m => ({
        role: m.role,
        content: m.content
      }));

      const aiResponseText = await sendAIMessage(chatHistory);
      
      const aiResponse = {
        role: 'assistant',
        content: aiResponseText,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, aiResponse]);
    } catch (err) {
      setError("AI failed to respond. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-bg relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/10 blur-[120px] rounded-full pointer-events-none" />

      {/* ── Chat Messages ── */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5 pt-6 relative z-0">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex items-end gap-3 animate-fade-in ${
              message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
            }`}
          >
            {/* Avatar */}
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-glow transition-transform hover:scale-105 ${
              message.role === 'user' 
                ? 'bg-primary/20 border border-primary/30' 
                : 'bg-gradient-to-br from-primary to-accent border border-white/10'
            }`}>
              {message.role === 'user' ? (
                <User className="w-5 h-5 text-white" />
              ) : (
                <Bot className="w-5 h-5 text-white" />
              )}
            </div>

            {/* Bubble */}
            <div className={`flex flex-col max-w-[80%] lg:max-w-[70%] ${message.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={message.role === 'user' ? 'bubble-sent' : 'bubble-received'}>
                {message.role === 'assistant' && (
                   <div className="flex items-center gap-1.5 mb-1.5 opacity-60">
                      <Sparkles className="w-3.5 h-3.5 text-accent" />
                      <span className="text-[10px] font-black tracking-widest uppercase">AI Assistant</span>
                   </div>
                )}
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {message.content}
                </p>
              </div>
              <span className={`text-[10px] text-text-2 font-medium mt-1.5 px-1 uppercase tracking-wider ${
                message.role === 'user' ? 'text-right' : 'text-left'
              }`}>
                {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex items-end gap-3 animate-fade-in">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shrink-0 border border-white/10 shadow-glow">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="bubble-received py-4 px-6">
              <div className="flex gap-2">
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
              </div>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="flex justify-center my-6">
            <div className="bg-red-500/10 border border-red-500/20 px-5 py-3 rounded-2xl flex items-center gap-3 text-red-400 text-xs shadow-glow backdrop-blur-xl">
              <AlertCircle className="w-4.5 h-4.5" />
              <span className="font-semibold">{error}</span>
              <button 
                onClick={() => setError(null)}
                className="ml-2 hover:text-white transition-colors p-1"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* ── Input Area ── */}
      <div className="p-6 bg-surface/50 backdrop-blur-3xl border-t border-border mt-auto">
        <form onSubmit={handleSend} className="max-w-4xl mx-auto flex items-center gap-3">
          <div className="relative flex-1 group">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask the AI Assistant..."
              className="input-base !bg-bg/50 pr-12 !py-3.5 border-primary/20 hover:border-primary/40 focus:border-primary shadow-inner"
              disabled={isLoading}
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-40 group-focus-within:opacity-100 transition-opacity">
               <Bot className="w-5 h-5 text-primary shadow-glow" />
            </div>
          </div>
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="w-12 h-12 btn-primary !p-0 shadow-glow hover:scale-105 active:scale-95 transition-all"
          >
            <Send className="w-5.5 h-5.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
