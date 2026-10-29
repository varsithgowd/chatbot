import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, RotateCcw, Bot, User, AlertCircle, Loader2 } from 'lucide-react';
import { sendChatMessage } from '../services/api';
import AnswerCard from './AnswerCard';

const SUGGESTED_PROMPTS = [
  'How do I reset my password?',
  'How to enable two-factor authentication?',
  'Where can I track my shipment delivery?',
  'What is the return window under the refund policy?',
  'How do I update my credit card payment method?',
  'My IoT Hub cannot connect to Wi-Fi. How do I fix it?'
];

export default function ChatAssistant({ embedded = false }) {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'bot',
      text: "Hello! I'm your SupportSense AI verified assistant. Ask any question about your account, orders, billing, or device troubleshooting. All my answers are strictly backed by approved documentation.",
      result: null
    }
  ]);
  const [input, setInput] = useState('');
  const [category, setCategory] = useState('');
  const [product, setProduct] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const messagesContainerRef = useRef(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    // Avoid any scrolling on initial mount so page does not jump
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    // Scroll only the internal chat container, never the window or outer page
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, loading]);

  const handleSend = async (questionText = input) => {
    const textToSend = questionText.trim();
    if (!textToSend || loading) return;

    setError(null);
    setInput('');

    // Append user message
    const userMsgId = 'user-' + Date.now();
    setMessages(prev => [
      ...prev,
      { id: userMsgId, sender: 'user', text: textToSend }
    ]);

    setLoading(true);

    try {
      const payload = { question: textToSend };
      if (category) payload.category = category;
      if (product) payload.product = product;

      const data = await sendChatMessage(payload);

      const botMsgId = 'bot-' + Date.now();
      setMessages(prev => [
        ...prev,
        {
          id: botMsgId,
          sender: 'bot',
          text: data.answer,
          result: data
        }
      ]);
    } catch (err) {
      const serverError = err.response?.data?.error;
      const errorMsg = serverError || 'Cannot reach SupportSense AI backend service. Please verify server connectivity or try again in a few moments.';
      setError(errorMsg);
      const errorMsgId = 'bot-error-' + Date.now();
      setMessages(prev => [
        ...prev,
        {
          id: errorMsgId,
          sender: 'bot',
          text: errorMsg,
          result: {
            answer: errorMsg,
            answered: false,
            sources: []
          }
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setMessages([
      {
        id: 'welcome-' + Date.now(),
        sender: 'bot',
        text: "Conversation reset. What can I help you find today?",
        result: null
      }
    ]);
    setError(null);
  };

  return (
    <div className={`flex flex-col bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden ${
      embedded ? 'h-[620px]' : 'h-[750px] max-h-[85vh]'
    }`}>
      
      {/* Chat Header */}
      <div className="px-5 py-3.5 bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-600 text-white flex items-center justify-between shadow-sm shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center text-white">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-semibold text-sm leading-tight">Verified AI Assistant</h3>
            <p className="text-[11px] text-purple-200">Grounded strictly in approved articles</p>
          </div>
        </div>

        <button
          onClick={handleReset}
          className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/90 transition-colors flex items-center gap-1 text-xs"
          title="Clear Conversation History"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Reset</span>
        </button>
      </div>

      {/* Filter Bar (Optional Category/Product) */}
      <div className="px-4 py-2 bg-slate-50 border-b border-slate-200/60 flex items-center gap-2 text-xs text-slate-600 shrink-0 overflow-x-auto">
        <span className="font-semibold text-slate-500 uppercase text-[10px]">Filter Scope:</span>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-700 focus:outline-none focus:border-purple-400"
        >
          <option value="">All Categories</option>
          <option value="Account Support">Account Support</option>
          <option value="Login and Security">Login and Security</option>
          <option value="Orders and Delivery">Orders and Delivery</option>
          <option value="Payments and Billing">Payments and Billing</option>
          <option value="Returns and Refunds">Returns and Refunds</option>
          <option value="Product Troubleshooting">Product Troubleshooting</option>
        </select>

        <select
          value={product}
          onChange={(e) => setProduct(e.target.value)}
          className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-700 focus:outline-none focus:border-purple-400"
        >
          <option value="">All Products</option>
          <option value="SupportSense Web App">SupportSense Web App</option>
          <option value="SupportSense Cloud">SupportSense Cloud</option>
          <option value="SupportSense Store">SupportSense Store</option>
          <option value="SupportSense IoT Hub">SupportSense IoT Hub</option>
        </select>
      </div>

      {/* Message History */}
      <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'bot' && (
              <div className="w-7 h-7 rounded-lg bg-purple-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div className={`max-w-[85%] ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
              {msg.sender === 'user' ? (
                <div className="inline-block p-3.5 rounded-2xl bg-purple-600 text-white text-sm shadow-sm font-medium">
                  {msg.text}
                </div>
              ) : msg.result ? (
                <AnswerCard result={msg.result} />
              ) : (
                <div className="inline-block p-3.5 rounded-2xl bg-slate-100 text-slate-800 text-sm leading-relaxed border border-slate-200/60">
                  {msg.text}
                </div>
              )}
            </div>

            {msg.sender === 'user' && (
              <div className="w-7 h-7 rounded-lg bg-slate-800 text-white flex items-center justify-center shrink-0 mt-0.5">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-purple-600 text-white flex items-center justify-center shrink-0 animate-pulse">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-3.5 rounded-2xl bg-purple-50 text-purple-700 text-sm border border-purple-100 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
              <span>Verifying approved articles and extracting citations...</span>
            </div>
          </div>
        )}
      </div>

      {/* Suggested Question Chips */}
      {messages.length <= 2 && (
        <div className="px-4 py-2 border-t border-slate-100 bg-slate-50/50 shrink-0">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
            Suggested Inquiries:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {SUGGESTED_PROMPTS.slice(0, 4).map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(prompt)}
                className="text-xs bg-white hover:bg-purple-50 hover:text-purple-700 text-slate-600 border border-slate-200 rounded-lg px-2.5 py-1 transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Box */}
      <div className="p-3.5 sm:p-4 bg-white border-t border-slate-200 shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question about passwords, tracking, billing, or returns..."
            disabled={loading}
            className="flex-1 text-base sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 disabled:opacity-60 transition-all"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-medium text-sm transition-all shadow-sm flex items-center gap-1.5 shrink-0"
          >
            <span className="hidden sm:inline">Ask AI</span>
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

    </div>
  );
}

