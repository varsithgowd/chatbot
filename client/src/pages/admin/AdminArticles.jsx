import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  PlusCircle,
  Search,
  Filter,
  CheckCircle,
  Archive,
  Edit,
  ExternalLink,
  AlertCircle,
  Check,
  RefreshCw
} from 'lucide-react';
import {
  getAdminArticles,
  publishAdminArticle,
  archiveAdminArticle
} from '../../services/api';

export default function AdminArticles() {
  const [articles, setArticles] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');
  const [category, setCategory] = useState('');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionSuccess, setActionSuccess] = useState(null);
  const [error, setError] = useState(null);

  const fetchArticles = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAdminArticles({
        q: query.trim() || undefined,
        status: status || undefined,
        category: category || undefined,
        page,
        limit: 10
      });
      setArticles(data.articles || []);
      setTotal(data.total || 0);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load articles catalog.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, [page, status, category]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchArticles();
  };

  const handlePublish = async (id, title) => {
    try {
      await publishAdminArticle(id);
      setActionSuccess(`Published "${title}"`);
      fetchArticles();
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err) {
      setError('Failed to publish article.');
    }
  };

  const handleArchive = async (id, title) => {
    try {
      await archiveAdminArticle(id);
      setActionSuccess(`Archived "${title}"`);
      fetchArticles();
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err) {
      setError('Failed to archive article.');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Knowledge Articles Catalog
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Publish, edit, and archive knowledge-base documentation. Only published articles are visible to customer chat and search.
          </p>
        </div>

        <Link
          to="/admin/articles/new"
          className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold transition-colors shadow-sm flex items-center gap-1.5 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Article</span>
        </Link>
      </div>

      {/* Action Toast Alert */}
      {actionSuccess && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs space-y-3">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search articles by title, tag, or content..."
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-purple-600 text-white rounded-xl text-xs font-semibold hover:bg-purple-700"
          >
            Search
          </button>
        </form>

        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100 text-xs">
          <span className="font-semibold text-slate-500 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Filter by:
          </span>

          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none"
          >
            <option value="">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>

          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setPage(1);
            }}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none"
          >
            <option value="">All Categories</option>
            <option value="Account Support">Account Support</option>
            <option value="Login and Security">Login and Security</option>
            <option value="Orders and Delivery">Orders and Delivery</option>
            <option value="Payments and Billing">Payments and Billing</option>
            <option value="Returns and Refunds">Returns and Refunds</option>
            <option value="Product Troubleshooting">Product Troubleshooting</option>
          </select>

          <button
            onClick={() => {
              setQuery('');
              setStatus('');
              setCategory('');
              setPage(1);
            }}
            className="text-xs text-purple-600 hover:text-purple-800 font-medium ml-auto"
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* Articles Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs text-slate-400">Loading articles...</div>
        ) : error ? (
          <div className="p-8 text-center text-xs text-red-600">{error}</div>
        ) : articles.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <FileText className="w-8 h-8 text-slate-300 mx-auto" />
            <h4 className="text-sm font-semibold text-slate-700">No articles found</h4>
            <p className="text-xs text-slate-400">Try adjusting your filters or search keywords.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200/80 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-5 py-3.5">Title & Product</th>
                  <th className="px-4 py-3.5">Category</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5">Sections</th>
                  <th className="px-4 py-3.5">Updated</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {articles.map((art) => (
                  <tr key={art._id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="font-bold text-slate-900 hover:text-purple-700 transition-colors">
                        <Link to={`/admin/articles/${art._id}/edit`}>
                          {art.title}
                        </Link>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {art.product} • <code className="font-mono text-purple-600">{art.slug}</code>
                      </div>
                    </td>

                    <td className="px-4 py-3.5 text-slate-600 font-medium whitespace-nowrap">
                      {art.category}
                    </td>

                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        art.status === 'published'
                          ? 'bg-emerald-100 text-emerald-800'
                          : art.status === 'draft'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {art.status}
                      </span>
                    </td>

                    <td className="px-4 py-3.5 text-slate-500 whitespace-nowrap">
                      {art.sections?.length || 0} sections
                    </td>

                    <td className="px-4 py-3.5 text-slate-400 whitespace-nowrap">
                      {new Date(art.updatedAt || art.createdAt).toLocaleDateString()}
                    </td>

                    <td className="px-5 py-3.5 text-right space-x-2 whitespace-nowrap">
                      {art.status !== 'published' && (
                        <button
                          onClick={() => handlePublish(art._id, art.title)}
                          className="px-2 py-1 rounded bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 text-[11px] font-semibold"
                          title="Publish to live search"
                        >
                          Publish
                        </button>
                      )}

                      {art.status === 'published' && (
                        <button
                          onClick={() => handleArchive(art._id, art.title)}
                          className="px-2 py-1 rounded bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200 text-[11px] font-semibold"
                          title="Archive article"
                        >
                          Archive
                        </button>
                      )}

                      <Link
                        to={`/admin/articles/${art._id}/edit`}
                        className="px-2 py-1 rounded bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 text-[11px] font-semibold inline-flex items-center gap-1"
                      >
                        <Edit className="w-3 h-3" /> Edit
                      </Link>

                      {art.status === 'published' && (
                        <Link
                          to={`/articles/${art._id}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1 rounded text-slate-400 hover:text-purple-600 inline-block align-middle"
                          title="View live public article"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Total catalog: {total} articles</span>
          <div className="flex items-center gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
              className="px-3 py-1 bg-white border border-slate-200 rounded-lg disabled:opacity-40"
            >
              Previous
            </button>
            <span>Page {page} of {Math.max(1, Math.ceil(total / 10))}</span>
            <button
              disabled={page >= Math.ceil(total / 10)}
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

