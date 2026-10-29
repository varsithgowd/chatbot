import React, { useState, useEffect } from 'react';
import { ThumbsUp, ThumbsDown, Filter, MessageSquare, Clock } from 'lucide-react';
import { getAdminFeedback } from '../../services/api';

export default function AdminFeedback() {
  const [feedback, setFeedback] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [ratingFilter, setRatingFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFeedback = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAdminFeedback({
        page,
        limit: 15,
        rating: ratingFilter || undefined
      });
      setFeedback(data.feedback || []);
      setTotal(data.total || 0);
    } catch (err) {
      setError('Failed to fetch user feedback.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, [page, ratingFilter]);

  return (
    <div className="space-y-6 max-w-7xl">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            User Feedback & Helpfulness
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Real customer ratings and comments submitted for verified AI answers.
          </p>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2">
          <select
            value={ratingFilter}
            onChange={(e) => {
              setRatingFilter(e.target.value);
              setPage(1);
            }}
            className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs focus:outline-none"
          >
            <option value="">All Ratings</option>
            <option value="helpful">Helpful Only</option>
            <option value="not_helpful">Needs Improvement</option>
          </select>
        </div>
      </div>

      {/* Feedback List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs text-slate-400">Loading feedback...</div>
        ) : error ? (
          <div className="p-8 text-center text-xs text-red-600">{error}</div>
        ) : feedback.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400">No feedback submitted yet.</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {feedback.map((fb) => (
              <div key={fb._id} className="p-5 hover:bg-slate-50/70 transition-colors space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold uppercase ${
                    fb.rating === 'helpful'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {fb.rating === 'helpful' ? (
                      <>
                        <ThumbsUp className="w-3.5 h-3.5 text-emerald-600" />
                        Helpful
                      </>
                    ) : (
                      <>
                        <ThumbsDown className="w-3.5 h-3.5 text-amber-600" />
                        Needs Improvement
                      </>
                    )}
                  </span>

                  <span className="text-[11px] text-slate-400 font-mono">
                    {new Date(fb.createdAt).toLocaleString()}
                  </span>
                </div>

                <div>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Question Evaluated:
                  </span>
                  <p className="text-xs sm:text-sm font-semibold text-slate-900 mt-0.5">
                    "{fb.questionId?.questionText || 'Inquiry ID: ' + fb.questionId}"
                  </p>
                </div>

                {fb.comment && (
                  <div className="p-3 rounded-xl bg-purple-50/60 border border-purple-100/70 text-xs text-purple-950 mt-2">
                    <span className="font-semibold block text-purple-800 text-[10px] uppercase">
                      User Suggestion / Comment:
                    </span>
                    <p className="mt-0.5 text-slate-700 italic">"{fb.comment}"</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Total entries: {total}</span>
          <div className="flex items-center gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
              className="px-3 py-1 bg-white border border-slate-200 rounded-lg disabled:opacity-40"
            >
              Previous
            </button>
            <span>Page {page} of {Math.max(1, Math.ceil(total / 15))}</span>
            <button
              disabled={page >= Math.ceil(total / 15)}
              onClick={() => setPage(page + 1)}
              className="px-3 py-1 bg-white border border-slate-200 rounded-lg disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}

