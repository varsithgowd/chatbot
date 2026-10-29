import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Filter, Sparkles, BookOpen, ArrowRight, Tag, ShieldCheck, AlertCircle } from 'lucide-react';
import { getArticles, searchArticles } from '../services/api';

const CATEGORIES = [
  'All Categories',
  'Account Support',
  'Login and Security',
  'Orders and Delivery',
  'Payments and Billing',
  'Returns and Refunds',
  'Product Troubleshooting'
];

const PRODUCTS = [
  'All Products',
  'SupportSense Web App',
  'SupportSense Cloud',
  'SupportSense Store',
  'SupportSense IoT Hub'
];

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialCategory = searchParams.get('category') || '';
  const initialProduct = searchParams.get('product') || '';

  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState(initialCategory);
  const [product, setProduct] = useState(initialProduct);

  const [articles, setArticles] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function executeFetch() {
      setLoading(true);
      setError(null);
      try {
        const catParam = category && category !== 'All Categories' ? category : undefined;
        const prodParam = product && product !== 'All Products' ? product : undefined;

        if (query.trim()) {
          const data = await searchArticles({
            q: query.trim(),
            category: catParam,
            product: prodParam,
            limit: 20
          });
          setArticles(data.results || []);
          setTotal(data.total || 0);
        } else {
          const data = await getArticles({
            category: catParam,
            product: prodParam,
            limit: 20
          });
          setArticles(data.articles || []);
          setTotal(data.total || 0);
        }
      } catch (err) {
        setError('Error loading search results. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    executeFetch();
  }, [query, category, product]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = {};
    if (query.trim()) params.q = query.trim();
    if (category && category !== 'All Categories') params.category = category;
    if (product && product !== 'All Products') params.product = product;
    setSearchParams(params);
  };

  const handleCategorySelect = (cat) => {
    const val = cat === 'All Categories' ? '' : cat;
    setCategory(val);
    const params = { ...Object.fromEntries(searchParams.entries()) };
    if (val) params.category = val;
    else delete params.category;
    setSearchParams(params);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Support Knowledge Base
        </h1>
        <p className="text-sm text-slate-500">
          Keyword search across all official, approved help documentation and troubleshooting guides.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by keywords, errors, procedures, or policies..."
              className="w-full pl-11 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm transition-colors shadow-sm shrink-0"
          >
            Search
          </button>
        </form>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100 text-xs">
          <span className="font-semibold text-slate-500 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-slate-400" /> Filter:
          </span>

          <select
            value={category || 'All Categories'}
            onChange={(e) => handleCategorySelect(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:border-purple-400"
          >
            {CATEGORIES.map((cat, i) => (
              <option key={i} value={cat}>{cat}</option>
            ))}
          </select>

          <select
            value={product || 'All Products'}
            onChange={(e) => setProduct(e.target.value === 'All Products' ? '' : e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:border-purple-400"
          >
            {PRODUCTS.map((prod, i) => (
              <option key={i} value={prod}>{prod}</option>
            ))}
          </select>

          {(query || category || product) && (
            <button
              onClick={() => {
                setQuery('');
                setCategory('');
                setProduct('');
                setSearchParams({});
              }}
              className="text-purple-600 hover:text-purple-800 font-medium ml-auto"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Results Meta */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span>
          Showing <strong>{articles.length}</strong> {articles.length === 1 ? 'article' : 'articles'}
          {query && <span> for query "<strong className="text-slate-700">{query}</strong>"</span>}
        </span>
        <span className="text-slate-400">Strictly published articles only</span>
      </div>

      {/* Results List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-white rounded-2xl border border-slate-200 animate-pulse p-6" />
          ))}
        </div>
      ) : error ? (
        <div className="p-8 rounded-2xl bg-red-50 border border-red-200 text-center space-y-2">
          <AlertCircle className="w-8 h-8 text-red-600 mx-auto" />
          <h3 className="font-semibold text-red-900">{error}</h3>
        </div>
      ) : articles.length === 0 ? (
        <div className="p-12 rounded-2xl bg-white border border-slate-200 text-center space-y-4 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center mx-auto">
            <BookOpen className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-slate-900">No matching approved articles found</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              We couldn't locate published documentation matching your exact search criteria. Try different keywords or consult our verified AI assistant.
            </p>
          </div>
          <Link
            to={`/chat${query ? `?prompt=${encodeURIComponent(query)}` : ''}`}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-purple-600 hover:bg-purple-700 text-white transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Ask AI Support Assistant
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {articles.map((art) => {
            const articleId = art.articleId || art._id;
            return (
              <Link
                key={articleId}
                to={`/articles/${articleId}`}
                className="p-6 rounded-2xl bg-white border border-slate-200/80 hover:border-purple-300 hover:shadow-md transition-all group space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-purple-50 text-purple-700 border border-purple-200/60">
                      {art.category}
                    </span>
                    <span className="text-xs font-medium text-slate-500">
                      {art.product}
                    </span>
                  </div>

                  {art.score !== undefined && (
                    <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-[11px] font-semibold text-slate-600">
                      <span>Relevance:</span>
                      <span className="text-purple-700">{art.score}</span>
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-purple-700 transition-colors flex items-center justify-between">
                    <span>{art.title}</span>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all shrink-0" />
                  </h3>

                  <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                    {art.excerpt || art.content}
                  </p>
                </div>

                {/* Matched Section Snippet */}
                {art.matchedSection && (
                  <div className="p-3 rounded-xl bg-purple-50/50 border border-purple-100/70 text-xs text-purple-900">
                    <span className="font-semibold">Relevant Section: </span>
                    <span className="font-medium text-slate-700">{art.matchedSection.heading}</span>
                    <p className="text-slate-600 mt-0.5">{art.matchedSection.content}</p>
                  </div>
                )}

                {/* Tags */}
                {art.tags && art.tags.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-2">
                    {art.tags.slice(0, 5).map((t, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium bg-slate-100 text-slate-600 rounded-md"
                      >
                        <Tag className="w-2.5 h-2.5 text-slate-400" />
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      )}

    </div>
  );
}

