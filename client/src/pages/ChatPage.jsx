import React, { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Sparkles, ShieldCheck, CheckCircle2 } from 'lucide-react';
import ChatAssistant from '../components/ChatAssistant';

export default function ChatPage() {
  const [searchParams] = useSearchParams();
  const initialPrompt = searchParams.get('prompt') || '';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-purple-100 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              SupportSense Verified Assistant
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Deterministic search & extractive evidence synthesis. Zero fabricated policies.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-50 border border-purple-200 text-xs text-purple-700 font-semibold self-start sm:self-auto">
          <ShieldCheck className="w-4 h-4 text-purple-600" />
          <span>Active Grounding Pipeline</span>
        </div>
      </div>

      {/* Main Chat Assistant Component */}
      <ChatAssistant embedded={false} />

    </div>
  );
}

