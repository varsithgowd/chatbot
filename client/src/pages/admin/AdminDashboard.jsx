import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  HelpCircle,
  AlertTriangle,
  ThumbsUp,
  ThumbsDown,
  CheckCircle2,
  Clock,
  ArrowRight,
  PlusCircle,
  RefreshCw,
  Archive,
  Layers
} from 'lucide-react';
import { getAdminDashboard } from '../../services/api';

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAdminDashboard();
      setData(res);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load dashboard statistics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading && !data) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-64 bg-slate-200 rounded animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-28 bg-white rounded-2xl border border-slate-200 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="p-8 rounded-2xl bg-red-50 border border-red-200 text-center space-y-3">
        <AlertTriangle className="w-8 h-8 text-red-600 mx-auto" />
        <h3 className="font-bold text-red-900">{error}</h3>
        <button
          onClick={fetchDashboard}
          className="px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-semibold hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  const { stats, recentQuestions = [], recentFeedback = [] } = data || {};
  const { articles = {}, questions = {}, feedback = {} } = stats || {};

  return (
    <div className="space-y-8 max-w-7xl">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            System Overview & Metrics
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Real-time analytics for approved articles, AI grounding success, and user feedback.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchDashboard}
            disabled={loading}
            className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-purple-700 hover:bg-purple-50 transition-colors shadow-2xs"
            title="Refresh Metrics"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-purple-600' : ''}`} />
          </button>
          <Link
            to="/admin/articles/new"
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold transition-colors shadow-sm flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create Article</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Published Articles */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Approved Knowledge</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-slate-900">
              {articles.published || 0}
            </div>
            <div className="text-xs text-slate-500 mt-1 flex items-center gap-2">
              <span>{articles.draft || 0} drafts</span>
              <span>•</span>
              <span>{articles.archived || 0} archived</span>
            </div>
          </div>
        </div>

        {/* Total Questions Asked */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Questions</span>
            <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
              <HelpCircle className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-slate-900">
              {questions.total || 0}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Resolution Rate: <strong className="text-purple-700">{questions.answeredRatio || 0}%</strong>
            </div>
          </div>
        </div>

        {/* Unanswered / Fallback Queue */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Unanswered Queue</span>
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-amber-700">
              {questions.unanswered || 0}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Gaps requiring documentation
            </div>
          </div>
        </div>

        {/* Helpful Feedback Ratio */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Satisfaction Rate</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <ThumbsUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-slate-900">
              {feedback.helpfulRatio || 0}%
            </div>
            <div className="text-xs text-slate-500 mt-1 flex items-center gap-2">
              <span className="text-emerald-600 font-medium">{feedback.helpful || 0} helpful</span>
              <span>•</span>
              <span className="text-amber-600 font-medium">{feedback.notHelpful || 0} unhelpful</span>
            </div>
          </div>
        </div>

      </div>

      {/* Two Column Layout: Recent Questions & Recent Feedback */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Recent Inquiries List */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Recent Customer Questions</h3>
              <p className="text-xs text-slate-500">Live stream of questions asked to the support engine</p>
            </div>
            <Link
              to="/admin/questions"
              className="text-xs font-semibold text-purple-600 hover:text-purple-700 flex items-center gap-1"
            >
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentQuestions.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              No recent questions recorded yet.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentQuestions.map((q) => (
                <div key={q._id} className="py-3 flex items-start justify-between gap-3">
                  <div className="space-y-1 min-w-0">
                    <p className="text-xs font-medium text-slate-900 truncate">
                      {q.questionText}
                    </p>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(q.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      {q.matchedArticleIds && q.matchedArticleIds.length > 0 && (
                        <>
                          <span>•</span>
                          <span className="text-purple-700 truncate max-w-xs">
                            Citing: {q.matchedArticleIds[0]?.title}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase shrink-0 ${
                    q.answered
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}>
                    {q.answered ? 'Answered' : 'Fallback'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* User Feedback Stream */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Latest Feedback</h3>
              <p className="text-xs text-slate-500">Customer helpfulness ratings & notes</p>
            </div>
            <Link
              to="/admin/feedback"
              className="text-xs font-semibold text-purple-600 hover:text-purple-700 flex items-center gap-1"
            >
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentFeedback.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              No feedback entries recorded yet.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentFeedback.map((fb) => (
                <div key={fb._id} className="py-3 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      fb.rating === 'helpful'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {fb.rating === 'helpful' ? (
                        <>
                          <ThumbsUp className="w-3 h-3 text-emerald-600" />
                          Helpful
                        </>
                      ) : (
                        <>
                          <ThumbsDown className="w-3 h-3 text-amber-600" />
                          Needs Improvement
                        </>
                      )}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(fb.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 font-medium">
                    Question: "{fb.questionId?.questionText || 'Inquiry'}"
                  </p>

                  {fb.comment && (
                    <p className="text-xs text-slate-500 italic bg-slate-50 p-2 rounded-lg border border-slate-100">
                      "{fb.comment}"
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}

