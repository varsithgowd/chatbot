import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  CheckCircle,
  AlertCircle,
  Layers,
  FileText
} from 'lucide-react';
import {
  getAdminArticle,
  createAdminArticle,
  updateAdminArticle
} from '../../services/api';

const CATEGORIES = [
  'Account Support',
  'Login and Security',
  'Orders and Delivery',
  'Payments and Billing',
  'Returns and Refunds',
  'Product Troubleshooting'
];

const PRODUCTS = [
  'SupportSense Web App',
  'SupportSense Cloud',
  'SupportSense Store',
  'SupportSense IoT Hub'
];

export default function AdminArticleEditor() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const initialTitleFromQuery = searchParams.get('title') || '';
  const initialCategoryFromQuery = searchParams.get('category') || 'Account Support';

  const [formData, setFormData] = useState({
    title: initialTitleFromQuery,
    category: initialCategoryFromQuery,
    product: 'SupportSense Web App',
    status: 'draft',
    tags: '',
    content: '',
    sections: [
      { heading: 'Overview & Steps', content: '' }
    ]
  });

  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (isEditMode) {
      async function loadArticle() {
        try {
          const res = await getAdminArticle(id);
          const art = res.article;
          setFormData({
            title: art.title || '',
            category: art.category || 'Account Support',
            product: art.product || 'SupportSense Web App',
            status: art.status || 'draft',
            tags: (art.tags || []).join(', '),
            content: art.content || '',
            sections: art.sections?.length > 0 ? art.sections : [{ heading: 'Overview', content: '' }]
          });
        } catch (err) {
          setError('Failed to fetch article for editing.');
        } finally {
          setLoading(false);
        }
      }
      loadArticle();
    }
  }, [id, isEditMode]);

  const handleAddSection = () => {
    setFormData(prev => ({
      ...prev,
      sections: [...prev.sections, { heading: '', content: '' }]
    }));
  };

  const handleRemoveSection = (idx) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.filter((_, i) => i !== idx)
    }));
  };

  const handleSectionChange = (idx, field, value) => {
    setFormData(prev => {
      const updated = [...prev.sections];
      updated[idx] = { ...updated[idx], [field]: value };
      return { ...prev, sections: updated };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSaving(true);

    try {
      const tagsArray = formData.tags
        .split(',')
        .map(t => t.trim())
        .filter(Boolean);

      const cleanedSections = formData.sections
        .filter(s => s.heading.trim() && s.content.trim())
        .map(s => ({ heading: s.heading.trim(), content: s.content.trim() }));

      const payload = {
        title: formData.title.trim(),
        category: formData.category,
        product: formData.product,
        status: formData.status,
        tags: tagsArray,
        content: formData.content.trim(),
        sections: cleanedSections
      };

      if (isEditMode) {
        await updateAdminArticle(id, payload);
        setSuccess('Article updated successfully!');
      } else {
        const res = await createAdminArticle(payload);
        setSuccess('Article created successfully!');
        setTimeout(() => navigate('/admin/articles'), 1000);
      }
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.details?.[0]?.message || 'Failed to save article.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-xs text-slate-400">Loading editor...</div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/articles"
            className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {isEditMode ? 'Edit Knowledge Article' : 'Create Knowledge Article'}
            </h1>
            <p className="text-xs text-slate-500">
              Approved articles directly power verified keyword search and AI citations.
            </p>
          </div>
        </div>
      </div>

      {success && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Basic Article Info Card */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b pb-2">
            Article Metadata
          </h2>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Article Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. How to Reset Your Password"
              className="w-full text-sm rounded-xl border border-slate-200 p-2.5 focus:outline-none focus:border-purple-500 bg-slate-50"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full text-xs rounded-xl border border-slate-200 p-2.5 bg-slate-50 focus:outline-none focus:border-purple-500"
              >
                {CATEGORIES.map((c, i) => (
                  <option key={i} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Product *
              </label>
              <select
                value={formData.product}
                onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                className="w-full text-xs rounded-xl border border-slate-200 p-2.5 bg-slate-50 focus:outline-none focus:border-purple-500"
              >
                {PRODUCTS.map((p, i) => (
                  <option key={i} value={p}>{p}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Status *
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full text-xs rounded-xl border border-slate-200 p-2.5 bg-slate-50 focus:outline-none focus:border-purple-500 font-semibold"
              >
                <option value="draft">Draft (Internal)</option>
                <option value="published">Published (Live Public Search & AI)</option>
                <option value="archived">Archived (Retired)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Search Tags (comma-separated keywords)
            </label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="password, credentials, login, reset, recovery"
              className="w-full text-xs rounded-xl border border-slate-200 p-2.5 bg-slate-50 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Main Summary / Introduction *
            </label>
            <textarea
              required
              rows={3}
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="High level overview explaining what this article covers and prerequisites..."
              className="w-full text-xs sm:text-sm rounded-xl border border-slate-200 p-3 bg-slate-50 focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>

        {/* Dynamic Sections Builder Card */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b pb-2">
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Procedural Sections & Guidelines
              </h2>
              <p className="text-[11px] text-slate-400">
                AI extracts verifiable citations directly from these section headings and contents.
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddSection}
              className="px-3 py-1.5 rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 text-xs font-semibold flex items-center gap-1 border border-purple-200"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Section
            </button>
          </div>

          <div className="space-y-4">
            {formData.sections.map((section, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-slate-200/90 bg-slate-50/50 space-y-3 relative group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-800 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-purple-200 text-purple-800 flex items-center justify-center text-[10px]">
                      {idx + 1}
                    </span>
                    Section {idx + 1}
                  </span>

                  {formData.sections.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveSection(idx)}
                      className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      title="Remove section"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div>
                  <input
                    type="text"
                    required
                    value={section.heading}
                    onChange={(e) => handleSectionChange(idx, 'heading', e.target.value)}
                    placeholder="Section Heading (e.g. Step-by-Step Reset via Mobile App)"
                    className="w-full text-xs font-semibold bg-white border border-slate-200 rounded-lg p-2 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <textarea
                    required
                    rows={3}
                    value={section.content}
                    onChange={(e) => handleSectionChange(idx, 'content', e.target.value)}
                    placeholder="Specific actionable instructions, policy clauses, error resolutions..."
                    className="w-full text-xs bg-white border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Link
            to="/admin/articles"
            className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-xs font-bold transition-colors shadow-sm flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : isEditMode ? 'Update Article' : 'Create Article'}</span>
          </button>
        </div>

      </form>

    </div>
  );
}

