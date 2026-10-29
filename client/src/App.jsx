import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ScrollToTop from './components/ScrollToTop';
import CustomerLayout from './layouts/CustomerLayout';
import AdminLayout from './layouts/AdminLayout';

import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import ChatPage from './pages/ChatPage';
import ArticleDetailPage from './pages/ArticleDetailPage';

import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminArticles from './pages/admin/AdminArticles';
import AdminArticleEditor from './pages/admin/AdminArticleEditor';
import AdminQuestions from './pages/admin/AdminQuestions';
import AdminUnanswered from './pages/admin/AdminUnanswered';
import AdminFeedback from './pages/admin/AdminFeedback';

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AuthProvider>
        <Routes>
          {/* Customer Facing Routes */}
          <Route path="/" element={<CustomerLayout />}>
            <Route index element={<HomePage />} />
            <Route path="search" element={<SearchPage />} />
            <Route path="chat" element={<ChatPage />} />
            <Route path="articles/:id" element={<ArticleDetailPage />} />
          </Route>

          {/* Admin Auth Route */}
          <Route path="/admin/login" element={<AdminLoginPage />} />

          {/* Protected Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="articles" element={<AdminArticles />} />
            <Route path="articles/new" element={<AdminArticleEditor />} />
            <Route path="articles/:id/edit" element={<AdminArticleEditor />} />
            <Route path="questions" element={<AdminQuestions />} />
            <Route path="unanswered" element={<AdminUnanswered />} />
            <Route path="feedback" element={<AdminFeedback />} />
          </Route>

          {/* Catch-all redirect to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

