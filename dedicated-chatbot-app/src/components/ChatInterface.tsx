import React, { useState, useRef, useEffect } from 'react';
import { Send, X, Bot, Globe, ExternalLink, Minimize2 } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'bot' | 'error';
  text: string;
  source_url?: string;
  scraped_at?: string;
  timestamp: string;
}

interface ChatInterfaceProps {
  onClose: () => void;
}

const QUICK_PROMPTS = [
  "What is the NAV of ICICI Large Cap?",
  "ICICI Smallcap fund managers?",
  "ICICI ELSS Tax Saver exit load?"
];

const ChatInterface: React.FC<ChatInterfaceProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async (queryText?: string) => {
    const text = queryText || input;
    if (!text.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: text })
      });

      if (!response.ok) throw new Error('API unreachable');

      const data = await response.json();

      const botMsg: Message = {
        id: data.id,
        role: data.role as 'bot',
        text: data.text,
        source_url: data.source_url,
        scraped_at: data.scraped_at,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      setMessages(prev => [...prev, {
        id: Date.now().toString() + '-err',
        role: 'error',
        text: "I'm having trouble connecting to the data source. Please ensure the backend is running.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white border border-gray-100 rounded-[28px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.15)] flex flex-col h-[85vh] max-h-[700px] border-b-0">

      {/* Header (Pill Style) */}
      <div className="bg-groww-emerald p-5 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-[15px] font-bold leading-none">Mutual Funds FAQ Assistant </h2>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
              <span className="text-[11px] font-semibold opacity-90">Always online • AI</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button className="p-2 hover:bg-white/10 rounded-xl transition-colors">
            <Minimize2 className="w-5 h-5" />
          </button>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Advisory Bar */}
      <div className="bg-[#E6F7F3] px-5 py-2.5 text-center text-[10px] font-bold text-[#0F6E56] border-b border-[#9FE1CB]/30 uppercase tracking-widest">
        Facts only • no investment advice
      </div>

      {/* Messages Area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-5 space-y-6 bg-[#FAFBFC]/50"
      >
        {messages.length === 0 && (
          <div className="space-y-6 animate-in fade-in duration-500 py-4">
            <div className="bg-white border border-gray-100 p-5 rounded-2xl rounded-tl-none shadow-sm text-sm text-[#44475b] leading-relaxed">
              Hi! Welcome to Groww's AI Assistant. I can help you understand the facts about different mutual fund schemes, managers, and loads.
            </div>

            <div className="space-y-3">
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Try asking</p>
              <div className="flex flex-col gap-2">
                {QUICK_PROMPTS.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(q)}
                    className="w-full text-left px-4 py-3 bg-white border border-gray-100 rounded-xl text-[13px] font-semibold text-[#44475b] hover:border-groww-emerald hover:bg-groww-light/20 transition-all flex items-center justify-between group shadow-sm"
                  >
                    {q}
                    <ExternalLink className="w-3 h-3 text-gray-300 group-hover:text-groww-emerald transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}
          >
            <div className={`max-w-[85%] flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div
                className={`p-4 rounded-2xl text-[14px] leading-relaxed shadow-sm ${msg.role === 'user'
                  ? 'bg-groww-emerald text-white font-medium rounded-tr-none'
                  : msg.role === 'error'
                    ? 'bg-red-50 text-red-600 border border-red-100 rounded-tl-none'
                    : 'bg-white text-[#44475b] border border-gray-100 rounded-tl-none'
                  }`}
              >
                {msg.text}
              </div>

              {msg.source_url && (
                <a
                  href={msg.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 flex items-center gap-2 px-3 py-1.5 bg-white border border-groww-light rounded-lg text-[10px] text-groww-emerald font-bold hover:bg-groww-light/50 transition-colors shadow-sm"
                >
                  <Globe className="w-3 h-3" />
                  Source: {msg.source_url.split('/')[2].replace('www.', '')}
                </a>
              )}

              <span className="mt-1.5 text-[9px] text-gray-400 font-bold uppercase tracking-widest">
                {msg.timestamp}
              </span>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-100 p-4 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-1.5">
              <div className="w-1 h-1 bg-groww-emerald rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-1 h-1 bg-groww-emerald rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-1 h-1 bg-groww-emerald rounded-full animate-bounce"></div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-50 pb-6">
        <div className="relative flex items-center gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask a factual question..."
            className="w-full pl-5 pr-12 py-3.5 bg-gray-50 border border-transparent rounded-2xl text-sm font-medium focus:outline-none focus:bg-white focus:border-groww-emerald transition-all placeholder:text-gray-400"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoading}
            className={`p-2.5 rounded-xl absolute right-1.5 transition-all ${input.trim() && !isLoading
              ? 'text-groww-emerald hover:bg-groww-light/30'
              : 'text-gray-300'
              }`}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <div className="flex items-center justify-center gap-1 mt-3 opacity-30 select-none grayscale">
          <span className="text-[10px] font-bold">Powered by</span>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-[#44475b] rounded-sm rotate-45"></div>
            <span className="text-[10px] font-bold">Groww</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
