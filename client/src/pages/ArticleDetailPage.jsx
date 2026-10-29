import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  FileText,
  LifeBuoy,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  Tag,
  ThumbsDown,
  ThumbsUp
} from 'lucide-react';
import { getArticle } from '../services/api';

export default function ArticleDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [helpfulFeedback, setHelpfulFeedback] = useState(null);

  useEffect(() => {
    async function loadArticle() {
      setLoading(true);
      setError(null);
      try {
        const data = await getArticle(id);
        setArticle(data.article);
      } catch (err) {
        setError(err.response?.data?.error || 'Article not found or not published.');
      } finally {
        setLoading(false);
      }
    }
    loadArticle();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="h-8 w-48 bg-slate-200 rounded animate-pulse mb-6" />
        <div className="h-12 w-3/4 bg-slate-200 rounded animate-pulse mb-8" />
        <div className="space-y-4">
          <div className="h-24 bg-slate-100 rounded-xl animate-pulse" />
          <div className="h-32 bg-slate-100 rounded-xl animate-pulse" />
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-14 h-14 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto border border-red-200">
          <FileText className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Article Unavailable</h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          {error || 'This article could not be found or is not approved for public access.'}
        </p>
        <Link
          to="/search"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-semibold hover:bg-purple-700 transition-colors shadow-sm"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Knowledge Base
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 overflow-x-auto whitespace-nowrap">
        <Link to="/" className="hover:text-purple-600 transition-colors">Home</Link>
        <span>/</span>
        <Link to="/search" className="hover:text-purple-600 transition-colors">Knowledge Base</Link>
        <span>/</span>
        <Link to={`/search?category=${encodeURIComponent(article.category)}`} className="hover:text-purple-600 transition-colors">
          {article.category}
        </Link>
        <span>/</span>
        <span className="text-slate-800 font-medium truncate max-w-xs">{article.title}</span>
      </nav>

      {/* Article Header Card */}
      <div className="bg-white rounded-3xl border border-purple-100 p-6 sm:p-8 shadow-sm space-y-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-purple-100 text-purple-700 border border-purple-200">
            {article.category}
          </span>
          <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-700">
            Product: {article.product}
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5" />
            Official Approved Policy
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
          {article.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-2 border-t border-slate-100">
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            Last Updated: {new Date(article.updatedAt || article.createdAt).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })}
          </span>
          <span>•</span>
          <span>ID: <code className="text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded text-[11px] font-mono">{article._id}</code></span>
        </div>

        {/* Overview content */}
        <p className="text-slate-700 text-base leading-relaxed pt-2">
          {article.content}
        </p>
      </div>

      {/* Sections Breakdown */}
      {article.sections && article.sections.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-purple-600" />
            Detailed Procedures & Guidelines
          </h2>

          <div className="space-y-4">
            {article.sections.map((section, idx) => (
              <div
                key={idx}
                id={`section-${idx}`}
                className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2.5"
              >
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 text-xs font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900">
                    {section.heading}
                  </h3>
                </div>
                <p className="text-slate-700 text-sm sm:text-base leading-relaxed pl-8">
                  {section.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tags */}
      {article.tags && article.tags.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-2">
          <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
            <Tag className="w-3.5 h-3.5 text-slate-400" /> Keywords:
          </span>
          {article.tags.map((t, i) => (
            <Link
              key={i}
              to={`/search?q=${encodeURIComponent(t)}`}
              className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-purple-50 hover:text-purple-700 text-slate-600 border border-slate-200/60 transition-colors"
            >
              #{t}
            </Link>
          ))}
        </div>
      )}

      {/* Ask AI & Feedback Bottom Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-50 via-indigo-50/60 to-white border border-purple-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <h4 className="text-sm font-bold text-slate-900">Still have questions regarding this topic?</h4>
          <p className="text-xs text-slate-500">
            Ask our verified AI Assistant to synthesize procedures from this article.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(`/chat?prompt=${encodeURIComponent(`Explain: ${article.title}`)}`)}
            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white transition-colors shadow-sm flex items-center gap-1.5 shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Query AI Assistant
          </button>
        </div>
      </div>

    </div>
  );
}

