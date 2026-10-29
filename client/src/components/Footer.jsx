import React from 'react';
import { ShieldCheck, Heart, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-purple-600 flex items-center justify-center text-white">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span className="font-bold text-slate-900 tracking-tight">SupportSense AI</span>
            </div>
            <p className="text-sm text-slate-500 max-w-md leading-relaxed">
              A high-precision customer support knowledge system engineered around the principle of
              <strong className="text-purple-700 font-semibold"> Trustworthy Answers over Unverified AI Hallucinations</strong>.
              All responses are strictly grounded in approved documentation with verifiable citations.
            </p>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 border border-amber-200 text-[11px] text-amber-800 font-medium">
              <span>Demo environment with fictional support knowledge articles.</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 mb-3">Knowledge Base</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><Link to="/search?category=Account%20Support" className="hover:text-purple-600 transition-colors">Account Support</Link></li>
              <li><Link to="/search?category=Login%20and%20Security" className="hover:text-purple-600 transition-colors">Login & Security</Link></li>
              <li><Link to="/search?category=Orders%20and%20Delivery" className="hover:text-purple-600 transition-colors">Orders & Tracking</Link></li>
              <li><Link to="/search?category=Payments%20and%20Billing" className="hover:text-purple-600 transition-colors">Billing & Invoices</Link></li>
              <li><Link to="/search?category=Returns%20and%20Refunds" className="hover:text-purple-600 transition-colors">Returns & Refunds</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 mb-3">System & Tools</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><Link to="/chat" className="hover:text-purple-600 transition-colors">Interactive AI Assistant</Link></li>
              <li><Link to="/search" className="hover:text-purple-600 transition-colors">Keyword Search Engine</Link></li>
              <li><Link to="/admin/login" className="hover:text-purple-600 transition-colors">Admin Management</Link></li>
              <li>
                <a
                  href="/api/health"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-purple-600 transition-colors inline-flex items-center gap-1"
                >
                  API Health Status
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-slate-100 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} SupportSense AI. Built for hackathon evaluation.</p>
          <p className="flex items-center gap-1">
            Grounded & Deterministic Verification Architecture
          </p>
        </div>
      </div>
    </footer>
  );
}

