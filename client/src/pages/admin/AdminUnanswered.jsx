import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertTriangle, PlusCircle, ArrowRight, Clock, HelpCircle, CheckCircle } from 'lucide-react';
import { getAdminUnanswered } from '../../services/api';

export default function AdminUnanswered() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUnanswered = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAdminUnanswered({ page, limit: 15 });
      setQuestions(data.questions || []);
      setTotal(data.total || 0);
    } catch (err) {
      setError('Failed to fetch unanswered questions queue.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUnanswered();
  }, [page]);

  const handleCreateArticle = (questionText) => {
    // Navigate to article creator with prefilled title
    navigate(`/admin/articles/new?title=${encodeURIComponent(questionText)}`);
  };

  return (
    <div className="space-y-6 max-w-7xl">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Unanswered & Fallback Queue
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Questions where no reliable published evidence was found. Convert user queries into approved knowledge articles with 1 click.
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs text-slate-400">Loading unanswered queue...</div>
        ) : error ? (
          <div className="p-8 text-center text-xs text-red-600">{error}</div>
        ) : questions.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto" />
            <h4 className="text-sm font-bold text-slate-900">Zero Unanswered Questions!</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              All customer inquiries submitted so far have successfully matched verified knowledge base articles.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-5 py-3.5">Customer Inquiry</th>
                  <th className="px-4 py-3.5">Triggered Reason</th>
                  <th className="px-4 py-3.5">Date & Time</th>
                  <th className="px-5 py-3.5 text-right">Knowledge Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {questions.map((q) => (
                  <tr key={q._id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-5 py-3.5 font-bold text-slate-900 max-w-md">
                      {q.questionText}
                    </td>

                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-50 text-amber-800 border border-amber-200">
                        Insufficient Evidence
                      </span>
                    </td>

                    <td className="px-4 py-3.5 text-slate-400 whitespace-nowrap font-mono text-[11px]">
                      {new Date(q.createdAt).toLocaleString([], {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>

                    <td className="px-5 py-3.5 text-right whitespace-nowrap">
                      <button
                        onClick={() => handleCreateArticle(q.questionText)}
                        className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-[11px] font-bold shadow-2xs transition-colors inline-flex items-center gap-1.5"
                      >
                        <PlusCircle className="w-3.5 h-3.5" />
                        <span>Draft Article</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Total unresolved: {total}</span>
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

