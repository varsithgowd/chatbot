import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShieldCheck, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

/**
 * FloatingAdminButton:
 * Rendered in the bottom-right corner of the screen strictly for authenticated,
 * backend-verified administrators browsing customer-facing pages.
 * Never rendered for customers, logged-out users, or on the admin login page.
 */
export default function FloatingAdminButton() {
  const { isVerifiedAdmin, loading } = useAuth();
  const location = useLocation();

  // Guard clauses:
  // 1. Never show if auth check is still resolving
  // 2. Never show unless verified admin from backend
  // 3. Never show on /admin/login or inside the admin console (/admin/*)
  if (loading || !isVerifiedAdmin) {
    return null;
  }

  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <aside aria-label="Admin Portal Quick Access">
      <Link
        to="/admin"
        id="floating-admin-portal-button"
        className="fixed bottom-6 right-6 z-50 inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-slate-900/95 hover:bg-purple-700 text-white text-xs font-semibold shadow-xl shadow-purple-950/25 border border-purple-400/30 backdrop-blur-md transition-all duration-200 hover:scale-105 active:scale-95 group focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2"
        title="Open SupportSense Admin Portal"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
        </span>
        <ShieldCheck className="w-4 h-4 text-purple-300 group-hover:text-white transition-colors" />
        <span className="tracking-wide">Admin Portal</span>
        <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
      </Link>
    </aside>
  );
}
