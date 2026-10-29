import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShieldCheck, Sparkles, BookOpen, Search, MessageSquare, Lock, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const location = useLocation();
  const { user, logout } = useAuth();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-purple-100 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-700 via-purple-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-purple-500/20 group-hover:scale-105 transition-transform">
            <ShieldCheck className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-lg text-slate-900 tracking-tight">SupportSense</span>
              <span className="px-1.5 py-0.5 text-[11px] font-semibold bg-purple-100 text-purple-700 rounded-md border border-purple-200">AI</span>
            </div>
            <p className="text-[10px] text-slate-500 font-medium -mt-0.5 tracking-wide uppercase">Verified Support Engine</p>
          </div>
        </Link>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-1">
          <Link
            to="/"
            className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
              isActive('/') ? 'text-purple-700 bg-purple-50/80' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Support Center
          </Link>
          <Link
            to="/search"
            className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
              isActive('/search') ? 'text-purple-700 bg-purple-50/80' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Search className="w-4 h-4" />
            Knowledge Base
          </Link>
          <Link
            to="/chat"
            className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
              isActive('/chat') ? 'text-purple-700 bg-purple-50/80' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Sparkles className="w-4 h-4 text-purple-600" />
            AI Assistant
          </Link>
        </nav>

        {/* Admin Navigation Button */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-2">
              <Link
                to="/admin"
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-purple-600 text-white hover:bg-purple-700 transition-colors shadow-sm flex items-center gap-1.5"
              >
                <Lock className="w-3.5 h-3.5" />
                Admin Dashboard
              </Link>
              <button
                onClick={logout}
                title="Log out"
                className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              to="/admin/login"
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 transition-all flex items-center gap-1.5"
            >
              <Lock className="w-3.5 h-3.5" />
              Admin Portal
            </Link>
          )}
        </div>

      </div>
    </header>
  );
}

