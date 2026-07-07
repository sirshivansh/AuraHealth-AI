import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Sparkles, 
  User, 
  Trash2, 
  HelpCircle, 
  PlusCircle, 
  AlertCircle,
  Clock,
  ArrowRight,
  Bot
} from 'lucide-react';
import { streamChat as chatWithAI } from '../../lib/api.js';
import GlassCard from '../../components/ui/GlassCard.jsx';

const Chat = () => {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'ai',
      text: "### Welcome to MediMind AI!\n\nI am your personalized health companion. Feel free to select any suggestion below, or write your own wellness question.\n\n*This AI provides general wellness information and is not a substitute for professional medical advice.*",
      timestamp: new Date()
    }
  ]);
  
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversations, setConversations] = useState([
    { id: '1', title: 'Wellness Discussion', active: true }
  ]);
  
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);
  const isLoadingRef = useRef(false);

  const quickPrompts = [
    { text: "I have headache", label: "Headache Relief" },
    { text: "I have fever", label: "Fever Care" },
    { text: "What should I eat?", label: "Nutrition Plan" },
    { text: "How much water should I drink?", label: "Hydration Advice" },
    { text: "Suggest exercise", label: "Exercise & Fitness" },
    { text: "Help me sleep better", label: "Sleep Hygiene" }
  ];

  // Auto scroll to bottom
  const scrollToBottom = (behavior = 'auto') => {
    chatEndRef.current?.scrollIntoView({ behavior, block: 'end' });
  };

  // Instant scroll on message updates to follow streaming tokens
  useEffect(() => {
    scrollToBottom('auto');
  }, [messages]);

  // Smooth scroll when input loading state changes
  useEffect(() => {
    scrollToBottom('smooth');
  }, [isLoading]);

  const handleSendMessage = async (textToSend) => {
    if (!textToSend.trim() || isLoadingRef.current) return;

    isLoadingRef.current = true;
    setIsLoading(true);

    const userMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date()
    };

    const aiMessageId = (Date.now() + 1).toString();
    const aiPlaceholder = {
      id: aiMessageId,
      sender: 'ai',
      text: '', // Empty initially, will stream tokens into this message
      timestamp: new Date()
    };

    // Add both messages to state immediately to prevent lag
    setMessages(prev => [...prev, userMessage, aiPlaceholder]);
    setInputText('');
    setTimeout(() => inputRef.current?.focus(), 10);

    try {
      // Limit context to last 5 non-empty messages to prevent context pollution
      const chatHistory = messages
        .filter(msg => msg.text && msg.text.trim() !== '')
        .slice(-5);
      
      await chatWithAI(textToSend, chatHistory, (chunk, accumulated) => {
        setMessages(prev => 
          prev.map(msg => 
            msg.id === aiMessageId 
              ? { ...msg, text: accumulated } 
              : msg
          )
        );
      });
    } catch (error) {
      console.error(error);
      setMessages(prev => 
        prev.map(msg => 
          msg.id === aiMessageId 
            ? { 
                ...msg, 
                text: `⚠️ **Service Alert**: ${error.message || "Unable to reach the health companion service. Please check if the backend server is running and GROQ_API_KEY is configured in your .env file."}\n\n*This AI provides general wellness information and is not a substitute for professional medical advice.*` 
              } 
            : msg
        )
      );
    } finally {
      isLoadingRef.current = false;
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'welcome',
        sender: 'ai',
        text: "### Welcome to MediMind AI!\n\nI am your personalized health companion. Feel free to select any suggestion below, or write your own wellness question.\n\n*This AI provides general wellness information and is not a substitute for professional medical advice.*",
        timestamp: new Date()
      }
    ]);
  };

  // Helper to parse simple markdown in messages to HTML elements (headers, lists, bold)
  const parseMarkdown = (text) => {
    return text.split('\n').map((line, idx) => {
      // Header 3
      if (line.startsWith('### ')) {
        return <h3 key={idx} className="text-sm sm:text-base font-display font-bold mt-4 mb-2 text-slate-800 dark:text-slate-100">{line.replace('### ', '')}</h3>;
      }
      // Header 4 or bold subheaders
      if (line.startsWith('#### ')) {
        return <h4 key={idx} className="text-xs sm:text-sm font-display font-semibold mt-3 mb-1.5 text-slate-800 dark:text-slate-100">{line.replace('#### ', '')}</h4>;
      }
      // Bullet lists
      if (line.startsWith('* ') || line.startsWith('- ')) {
        const content = line.substring(2);
        return <li key={idx} className="list-disc ml-5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed my-1.5">{parseInlineBold(content)}</li>;
      }
      // Numbered lists
      const numberRegex = /^\d+\.\s(.*)/;
      if (numberRegex.test(line)) {
        const content = line.replace(/^\d+\.\s/, '');
        return <li key={idx} className="list-decimal ml-5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed my-1.5">{parseInlineBold(content)}</li>;
      }
      // Empty line
      if (line.trim() === '') {
        return <div key={idx} className="h-2"></div>;
      }
      // Regular line (with bold check)
      return <p key={idx} className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed my-2 whitespace-pre-wrap break-words">{parseInlineBold(line)}</p>;
    });
  };

  // Helper to parse inline bolding **text**
  const parseInlineBold = (text) => {
    const parts = text.split(/\*\*(.*?)\*\*/g);
    return parts.map((part, index) => {
      if (index % 2 === 1) {
        return <strong key={index} className="font-bold text-slate-800 dark:text-slate-100">{part}</strong>;
      }
      // Also check for italics/disclaimer styling
      if (part.startsWith('*') && part.endsWith('*')) {
        return <em key={index} className="text-slate-500 dark:text-slate-400 italic">{part.replace(/\*/g, '')}</em>;
      }
      return part;
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 h-[calc(100vh-64px-130px)] min-h-[500px] flex gap-6">
      
      {/* SIDEBAR: Conversation list & Quick Actions */}
      <div className="hidden lg:flex flex-col w-64 shrink-0 glass-panel rounded-3xl p-4 h-full border-transparent">
        <button 
          onClick={handleClearChat}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-dashed border-slate-300 dark:border-slate-800 hover:border-primary-500 hover:text-primary-500 text-xs font-semibold transition-all mb-4"
        >
          <PlusCircle className="h-4 w-4" />
          Start New Chat
        </button>

        <div className="flex-grow space-y-2 overflow-y-auto pr-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block px-2 mb-2">History</label>
          {conversations.map(c => (
            <div 
              key={c.id}
              className={`flex items-center justify-between p-2 rounded-xl text-xs font-medium cursor-pointer ${
                c.active 
                  ? 'bg-primary-50 dark:bg-primary-950/20 text-primary-600 dark:text-primary-400 border border-primary-100/50 dark:border-primary-800/20' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/50'
              }`}
            >
              <span className="truncate">{c.title}</span>
              <Clock className="h-3 w-3 text-slate-400" />
            </div>
          ))}
        </div>

        {/* Info Disclaimer Badge */}
        <div className="p-3.5 rounded-2xl bg-amber-500/5 border border-amber-500/10 text-[10px] text-amber-600/80 dark:text-amber-400/80 leading-normal flex gap-2 mt-4">
          <AlertCircle className="h-4 w-4 shrink-0 text-amber-500" />
          <span>Advice is informational only. Confirm severe complaints with a physician.</span>
        </div>
      </div>

      {/* MAIN CHAT AREA */}
      <div className="flex-grow flex flex-col glass-panel rounded-3xl h-full border-transparent overflow-hidden">
        
        {/* Chat Window Header */}
        <div className="px-6 py-4 border-b border-slate-200/50 dark:border-slate-800/50 flex items-center justify-between bg-white/20 dark:bg-slate-900/10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-500/10 text-primary-500 rounded-xl">
              <Bot className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <h2 className="font-bold text-sm">MediMind Assistant</h2>
              <span className="text-[10px] font-semibold text-success-500 flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-success-500 animate-ping"></span>
                Llama 3.1 Active
              </span>
            </div>
          </div>
          <button 
            onClick={handleClearChat}
            className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
            title="Clear Chat History"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        {/* Message Thread Scroll view */}
        <div className="flex-grow overflow-y-auto px-6 py-4 space-y-4">
          {messages.map((msg) => {
            if (msg.sender === 'ai' && !msg.text) return null;
            return (
              <div 
                key={msg.id}
                className={`flex gap-3 max-w-2xl ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
              >
                {/* Avatar */}
                <div className={`h-8 w-8 rounded-full shrink-0 flex items-center justify-center border ${
                  msg.sender === 'user'
                    ? 'bg-primary-500 border-primary-600 text-white'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-primary-500'
                }`}>
                  {msg.sender === 'user' ? <User className="h-4.5 w-4.5" /> : <Sparkles className="h-4.5 w-4.5 animate-pulse" />}
                </div>

                {/* Text Balloon */}
                <div className={`p-4 rounded-2xl shadow-sm border max-w-full break-words overflow-x-auto ${
                  msg.sender === 'user'
                    ? 'bg-primary-600 border-primary-700 text-white rounded-tr-none'
                    : 'bg-white/80 dark:bg-slate-900/50 backdrop-blur border-slate-200/50 dark:border-slate-800/50 text-slate-800 dark:text-slate-200 rounded-tl-none'
                }`}>
                  {msg.sender === 'user' ? (
                    <p className="text-xs leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                  ) : (
                    <div className="space-y-1.5 text-left">
                      {parseMarkdown(msg.text)}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isLoading && messages[messages.length - 1]?.sender === 'ai' && !messages[messages.length - 1]?.text && (
            <div className="flex gap-3 mr-auto items-center">
              <div className="h-8 w-8 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-primary-500">
                <Sparkles className="h-4.5 w-4.5 animate-spin" />
              </div>
              <div className="p-3 bg-white/50 dark:bg-slate-900/20 rounded-2xl rounded-tl-none border border-slate-200/30 dark:border-slate-800/30 flex gap-1 items-center">
                <div className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Quick suggestions area */}
        {messages.length <= 1 && (
          <div className="px-6 py-2 border-t border-slate-200/30 dark:border-slate-800/30">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">Suggested Inquiries</span>
            <div className="flex flex-wrap gap-2">
              {quickPrompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(p.text)}
                  className="px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-800 hover:border-primary-500 hover:bg-primary-500/5 text-xs text-slate-600 dark:text-slate-300 transition-all flex items-center gap-1"
                >
                  {p.label}
                  <ArrowRight className="h-3 w-3" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Bar */}
        <div className="p-4 border-t border-slate-200/50 dark:border-slate-800/50 bg-white/20 dark:bg-slate-900/10">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSendMessage(inputText); }}
            className="flex gap-2 relative items-center"
          >
            <input
              ref={inputRef}
              type="text"
              className="glass-input pr-12 text-sm py-3"
              placeholder="Ask a medical wellness question (e.g. 'I have a headache', 'What should I eat?')"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className="absolute right-2 p-2 rounded-xl bg-primary-600 text-white disabled:opacity-40 disabled:hover:scale-100 hover:scale-105 active:scale-95 transition-transform"
              aria-label="Send Message"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>

      </div>

    </div>
  );
};

export default Chat;
