import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, Clock, CheckCircle2, AlertTriangle, ExternalLink, Filter } from 'lucide-react';
import { getAdminQuestions } from '../../services/api';

export default function AdminQuestions() {
  const [questions, setQuestions] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [answeredFilter, setAnsweredFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchQuestions = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAdminQuestions({
        page,
        limit: 15,
        answered: answeredFilter || undefined
      });
      setQuestions(data.questions || []);
      setTotal(data.total || 0);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load question logs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [page, answeredFilter]);

  return (
    <div className="space-y-6 max-w-7xl">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Customer Query History
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Audit log of all questions submitted to the SupportSense AI engine with citation matching status.
          </p>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2">
          <select
            value={answeredFilter}
            onChange={(e) => {
              setAnsweredFilter(e.target.value);
              setPage(1);
            }}
            className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs focus:outline-none"
          >
            <option value="">All Queries</option>
            <option value="true">Answered With Citations</option>
            <option value="false">Fallback (Safe Mode)</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs text-slate-400">Loading queries...</div>
        ) : error ? (
          <div className="p-8 text-center text-xs text-red-600">{error}</div>
        ) : questions.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400">No question records found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-5 py-3.5">Question Text</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5">Matched Grounding Sources</th>
                  <th className="px-5 py-3.5 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {questions.map((q) => (
                  <tr key={q._id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-5 py-3.5 font-medium text-slate-900 max-w-md">
                      {q.questionText}
                    </td>

                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        q.answered
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {q.answered ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Answered
                          </>
                        ) : (
                          <>
                            <AlertTriangle className="w-3 h-3 text-amber-600" />
                            Fallback
                          </>
                        )}
                      </span>
                    </td>

                    <td className="px-4 py-3.5">
                      {q.matchedArticleIds && q.matchedArticleIds.length > 0 ? (
                        <div className="space-y-1">
                          {q.matchedArticleIds.map((art) => (
                            <Link
                              key={art._id}
                              to={`/articles/${art._id}`}
                              target="_blank"
                              className="text-purple-700 hover:text-purple-900 font-medium inline-flex items-center gap-1 truncate max-w-xs block"
                            >
                              <span>{art.title}</span>
                              <ExternalLink className="w-3 h-3" />
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">No reliable evidence matched</span>
                      )}
                    </td>

                    <td className="px-5 py-3.5 text-right text-slate-400 whitespace-nowrap font-mono text-[11px]">
                      {new Date(q.createdAt).toLocaleString([], {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Total queries: {total}</span>
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

