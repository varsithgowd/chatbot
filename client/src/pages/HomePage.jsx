import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Search,
  Sparkles,
  ShieldCheck,
  UserCheck,
  KeyRound,
  PackageCheck,
  CreditCard,
  RotateCcw,
  Cpu,
  ArrowRight,
  BookOpen,
  FileCheck2,
  Clock
} from 'lucide-react';
import ChatAssistant from '../components/ChatAssistant';
import { getArticles } from '../services/api';

const POPULAR_CATEGORIES = [
  {
    name: 'Account Support',
    description: 'Profile updates, email changes, and account settings',
    icon: UserCheck,
    color: 'from-blue-500 to-indigo-600',
    slug: 'Account Support'
  },
  {
    name: 'Login and Security',
    description: 'Passwords, 2FA setup, and lockout troubleshooting',
    icon: KeyRound,
    color: 'from-purple-500 to-violet-600',
    slug: 'Login and Security'
  },
  {
    name: 'Orders and Delivery',
    description: 'Shipment tracking, courier delays, and order cancellations',
    icon: PackageCheck,
    color: 'from-emerald-500 to-teal-600',
    slug: 'Orders and Delivery'
  },
  {
    name: 'Payments and Billing',
    description: 'Card updates, VAT invoices, and renewal proration',
    icon: CreditCard,
    color: 'from-amber-500 to-orange-600',
    slug: 'Payments and Billing'
  },
  {
    name: 'Returns and Refunds',
    description: 'Return labels, store policy terms, and refund timelines',
    icon: RotateCcw,
    color: 'from-rose-500 to-pink-600',
    slug: 'Returns and Refunds'
  },
  {
    name: 'Product Troubleshooting',
    description: 'Wi-Fi pairing, IoT LED error codes, and OTA updates',
    icon: Cpu,
    color: 'from-cyan-500 to-blue-600',
    slug: 'Product Troubleshooting'
  }
];

const SUGGESTED_CHIPS = [
  'How do I reset my password?',
  'Where can I track my shipment delivery?',
  'What is the return window under the refund policy?',
  'How to enable two-factor authentication (2FA)?',
  'Can I cancel an order I just placed?'
];

export default function HomePage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [recentArticles, setRecentArticles] = useState([]);
  const [loadingArticles, setLoadingArticles] = useState(true);

  useEffect(() => {
    async function loadArticles() {
      try {
        const data = await getArticles({ limit: 6 });
        setRecentArticles(data.articles || []);
      } catch (err) {
        console.error('Failed to load recent articles', err);
      } finally {
        setLoadingArticles(false);
      }
    }
    loadArticles();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  return (
    <div className="space-y-14 pb-16">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 sm:pb-20 bg-gradient-to-b from-purple-100/60 via-purple-50/30 to-slate-50 border-b border-purple-100/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold border border-purple-200 shadow-sm animate-fade-in">
            <ShieldCheck className="w-4 h-4 text-purple-600" />
            <span>Strictly Grounded Knowledge • Zero Hallucinations</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Find Answers You Can <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-600">Trust.</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Search our verified customer support library or query our deterministic AI assistant.
            Every answer is verified against approved documentation with transparent citations.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto pt-2">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center shadow-lg rounded-2xl bg-white border border-purple-200 p-2 focus-within:ring-2 focus-within:ring-purple-500/30 focus-within:border-purple-500 transition-all">
              <Search className="w-5 h-5 text-purple-500 ml-3 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search approved articles (e.g., password reset, 2FA, refunds, invoice)..."
                className="w-full px-3 py-2 text-sm sm:text-base text-slate-800 bg-transparent placeholder-slate-400 focus:outline-none"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm transition-colors shadow-sm flex items-center gap-1.5 shrink-0"
              >
                Search
              </button>
            </form>

            {/* Suggested Chips */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              <span className="text-xs text-slate-500 font-medium">Popular inquiries:</span>
              {SUGGESTED_CHIPS.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => navigate(`/search?q=${encodeURIComponent(chip)}`)}
                  className="text-xs bg-white/90 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-300 text-slate-600 border border-slate-200 rounded-lg px-2.5 py-1 transition-all shadow-2xs"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* Main Content Area: Categories & Embedded AI Assistant */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        
        {/* Support Categories Grid */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Popular Support Categories</h2>
              <p className="text-sm text-slate-500">Browse verified documentation by domain or product function</p>
            </div>
            <Link
              to="/search"
              className="text-sm font-semibold text-purple-600 hover:text-purple-700 flex items-center gap-1 group"
            >
              Browse all articles
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {POPULAR_CATEGORIES.map((cat, idx) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={idx}
                  to={`/search?category=${encodeURIComponent(cat.slug)}`}
                  className="p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-purple-300 hover:shadow-md transition-all group flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-tr ${cat.color} text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 group-hover:text-purple-700 transition-colors">
                        {cat.name}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        {cat.description}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-medium text-purple-600 group-hover:text-purple-700">
                    <span>View articles</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Interactive Chat Assistant Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <div className="lg:col-span-4 space-y-5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-purple-100 text-purple-700 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              Live Interactive Support
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Ask SupportSense AI Directly
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Have a specific problem? Type your inquiry into our active assistant. The engine inspects approved knowledge-base articles, scores relevance, extracts grounded evidence, and cites each source.
            </p>

            <div className="p-4 rounded-xl bg-purple-50 border border-purple-200 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-purple-900">
                Core Grounding Principles:
              </h4>
              <ul className="text-xs text-purple-800 space-y-2">
                <li className="flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                  <span><strong>Zero Hallucinations:</strong> Never fabricates return policies or product features.</span>
                </li>
                <li className="flex items-start gap-2">
                  <FileCheck2 className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                  <span><strong>Verified Citations:</strong> Only references real database articles with direct links.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Clock className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                  <span><strong>Safe Fallback:</strong> If evidence is insufficient, it admits inability and logs for human triage.</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="lg:col-span-8">
            <ChatAssistant embedded={true} />
          </div>

        </section>

        {/* Recently Approved Articles Section */}
        <section className="space-y-6 pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Recently Approved Articles</h2>
              <p className="text-sm text-slate-500">Official, verified guides from our support knowledge team</p>
            </div>
            <Link
              to="/search"
              className="text-sm font-semibold text-purple-600 hover:text-purple-700"
            >
              View all
            </Link>
          </div>

          {loadingArticles ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-40 rounded-2xl bg-slate-100 animate-pulse border border-slate-200" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {recentArticles.map((article) => (
                <Link
                  key={article._id}
                  to={`/articles/${article._id}`}
                  className="p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-purple-300 hover:shadow-md transition-all group flex flex-col justify-between"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-md bg-purple-50 text-purple-700 border border-purple-100">
                        {article.category}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {article.product}
                      </span>
                    </div>

                    <h3 className="font-semibold text-slate-900 group-hover:text-purple-700 transition-colors line-clamp-2">
                      {article.title}
                    </h3>

                    <p className="text-xs text-slate-500 line-clamp-2">
                      {article.content}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                    <span>{article.sections?.length || 0} sections</span>
                    <span className="text-purple-600 font-medium group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                      Read guide <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

      </div>
    </div>
  );
}

