import React, { useState } from 'react';
import { X } from 'lucide-react';

interface ProjectFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

export const ProjectForm: React.FC<ProjectFormProps> = ({ onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    author: '',
    category: 'Robotics',
    difficulty: 'Intermediate',
    image_url: '',
    content: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        onSuccess();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#0f2230]/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10">
          <h2 className="text-2xl font-bold">Post New Project</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Project Title</label>
              <input 
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#6CBAE6] focus:ring-2 focus:ring-[#6CBAE6]/25 outline-none transition-all"
                placeholder="e.g. Hexapod Walker"
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Author Name</label>
              <input 
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#6CBAE6] focus:ring-2 focus:ring-[#6CBAE6]/25 outline-none transition-all"
                placeholder="Your Name"
                value={formData.author}
                onChange={e => setFormData({...formData, author: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Category</label>
              <select 
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#6CBAE6] outline-none"
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value})}
              >
                <option>Robotics</option>
                <option>Mechanical</option>
                <option>Energy</option>
                <option>IoT</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Difficulty</label>
              <select 
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#6CBAE6] outline-none"
                value={formData.difficulty}
                onChange={e => setFormData({...formData, difficulty: e.target.value})}
              >
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Cover Image URL</label>
            <input 
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#6CBAE6] outline-none"
              placeholder="https://images.unsplash.com/..."
              value={formData.image_url}
              onChange={e => setFormData({...formData, image_url: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Short Description</label>
            <textarea 
              required
              rows={2}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#6CBAE6] outline-none resize-none"
              placeholder="Briefly explain what your project does..."
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Project Content (Markdown)</label>
            <textarea 
              required
              rows={8}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 font-mono text-sm focus:border-[#6CBAE6] outline-none"
              placeholder="# Introduction\nDetails about your build..."
              value={formData.content}
              onChange={e => setFormData({...formData, content: e.target.value})}
            />
          </div>

          <button 
            disabled={loading}
            className="w-full py-4 bg-[#6CBAE6] hover:bg-[#5BA9D6] text-white font-bold rounded-xl transition-all shadow-lg shadow-[#6CBAE6]/20 disabled:opacity-50"
          >
            {loading ? 'Publishing...' : 'Publish Project'}
          </button>
        </form>
      </div>
    </div>
  );
};
