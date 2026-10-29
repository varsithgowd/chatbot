import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  AlertTriangle,
  ExternalLink,
  ThumbsUp,
  ThumbsDown,
  Copy,
  Check,
  FileText,
  LifeBuoy
} from 'lucide-react';
import FeedbackModal from './FeedbackModal';

export default function AnswerCard({ result, onFeedbackSubmitted }) {
  const [copied, setCopied] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [pendingRating, setPendingRating] = useState('helpful');

  if (!result) return null;

  const { answer, answered, sources = [], questionId } = result;

  const handleCopy = () => {
    navigator.clipboard.writeText(answer);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRateClick = (rating) => {
    setPendingRating(rating);
    setShowFeedbackModal(true);
  };

  const onFeedbackSuccess = (rating) => {
    setFeedbackRating(rating);
    if (onFeedbackSubmitted) onFeedbackSubmitted(rating);
  };

  return (
    <div className={`rounded-2xl border transition-all overflow-hidden ${
      answered
        ? 'bg-white border-purple-200/80 shadow-md shadow-purple-500/5'
        : 'bg-amber-50/50 border-amber-200 shadow-sm'
    }`}>
      
      {/* Top Banner */}
      <div className={`px-5 py-3 border-b flex items-center justify-between ${
        answered
          ? 'bg-gradient-to-r from-purple-50 via-indigo-50/50 to-white border-purple-100 text-purple-900'
          : 'bg-amber-100/70 border-amber-200 text-amber-900'
      }`}>
        <div className="flex items-center gap-2">
          {answered ? (
            <>
              <div className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-purple-800">
                Verified Grounded Answer
              </span>
            </>
          ) : (
            <>
              <div className="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center">
                <AlertTriangle className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
                Safe Fallback — Insufficient Approved Evidence
              </span>
            </>
          )}
        </div>

        <button
          onClick={handleCopy}
          className="text-xs font-medium text-slate-500 hover:text-purple-700 transition-colors flex items-center gap-1 px-2 py-1 rounded-md hover:bg-white/80"
          title="Copy answer to clipboard"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-green-600" />
              <span className="text-green-600">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Answer Body */}
      <div className="p-5 sm:p-6 space-y-4">
        <p className="text-slate-800 text-sm sm:text-base leading-relaxed">
          {answer}
        </p>

        {/* Citations Section (When Answered) */}
        {answered && sources.length > 0 && (
          <div className="pt-3 border-t border-slate-100">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-2">
              Verified Source Citations ({sources.length}):
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {sources.map((src, idx) => (
                <Link
                  key={idx}
                  to={`/articles/${src.articleId}`}
                  className="flex items-start gap-2.5 p-3 rounded-xl border border-purple-100 bg-purple-50/40 hover:bg-purple-100/60 hover:border-purple-300 transition-all group"
                >
                  <FileText className="w-4 h-4 text-purple-600 mt-0.5 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <h5 className="text-xs font-semibold text-slate-900 group-hover:text-purple-700 truncate flex items-center gap-1">
                      {src.title}
                      <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h5>
                    <p className="text-[11px] text-purple-700/80 truncate">
                      Section: <span className="font-medium text-slate-700">{src.section}</span>
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Fallback Contact Action */}
        {!answered && (
          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-amber-50 rounded-xl p-3 border border-amber-200/60">
            <span className="text-xs text-amber-800">
              This question has been automatically queued for our documentation team.
            </span>
            <Link
              to="/articles/how-to-contact-official-customer-support"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white transition-colors shrink-0"
            >
              <LifeBuoy className="w-3.5 h-3.5" />
              Contact Customer Support
            </Link>
          </div>
        )}

        {/* Bottom Feedback Bar */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Was this response helpful?</span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handleRateClick('helpful')}
              disabled={feedbackRating !== null}
              className={`p-1.5 rounded-lg border flex items-center gap-1 font-medium transition-colors ${
                feedbackRating === 'helpful'
                  ? 'bg-green-100 border-green-300 text-green-800'
                  : 'border-slate-200 hover:bg-slate-100 text-slate-600'
              }`}
              title="Helpful"
            >
              <ThumbsUp className="w-3.5 h-3.5 text-green-600" />
              <span className="text-[11px]">Helpful</span>
            </button>
            <button
              onClick={() => handleRateClick('not_helpful')}
              disabled={feedbackRating !== null}
              className={`p-1.5 rounded-lg border flex items-center gap-1 font-medium transition-colors ${
                feedbackRating === 'not_helpful'
                  ? 'bg-amber-100 border-amber-300 text-amber-800'
                  : 'border-slate-200 hover:bg-slate-100 text-slate-600'
              }`}
              title="Not Helpful"
            >
              <ThumbsDown className="w-3.5 h-3.5 text-amber-600" />
              <span className="text-[11px]">Not Helpful</span>
            </button>
          </div>
        </div>

      </div>

      {showFeedbackModal && (
        <FeedbackModal
          questionId={questionId}
          initialRating={pendingRating}
          onClose={() => setShowFeedbackModal(false)}
          onSuccess={onFeedbackSuccess}
        />
      )}

    </div>
  );
}

