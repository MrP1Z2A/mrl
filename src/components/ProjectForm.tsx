import React, { useState, useRef } from 'react';
import { X, Plus, Trash2, Upload, Image as ImageIcon, FileUp, Loader2 } from 'lucide-react';
import { PROJECT_CATEGORIES } from '../categories';
import { supabase } from '../lib/supabase';

import { Project } from '../utils';

interface ProjectFormProps {
  onClose: () => void;
  onSuccess: () => void;
  initialData?: Project;
}

export const ProjectForm: React.FC<ProjectFormProps> = ({ onClose, onSuccess, initialData }) => {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inlineFileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    author: initialData?.author || '',
    category: initialData?.category || 'Robotics',
    difficulty: initialData?.difficulty || 'Intermediate',
    image_url: initialData?.image_url || '',
    content: initialData?.content || '',
    components: initialData?.components?.join(', ') || '',
    code_snippet: initialData?.code_snippet || '',
    schematic_url: initialData?.schematic_url || ''
  });

  const uploadFile = async (file: File) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from('project-assets')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('project-assets')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error: any) {
      alert('Error uploading file: ' + error.message);
      return null;
    }
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploading(true);
    const url = await uploadFile(e.target.files[0]);
    if (url) {
      setFormData({ ...formData, image_url: url });
    }
    setUploading(false);
  };

  const handleInlineUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploading(true);
    const url = await uploadFile(e.target.files[0]);
    if (url) {
      const markdownImage = `\n![Image](${url})\n`;
      setFormData({ ...formData, content: formData.content + markdownImage });
    }
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        alert('Please login to post a project');
        return;
      }

      if (initialData?.id) {
        const { error } = await supabase
          .from('projects')
          .update({
            ...formData,
            components: formData.components.split(',').map(s => s.trim()).filter(s => s !== ''),
          })
          .eq('id', initialData.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('projects')
          .insert([{
            ...formData,
            user_id: user.id,
            components: formData.components.split(',').map(s => s.trim()).filter(s => s !== ''),
            created_at: new Date().toISOString()
          }]);
        if (error) throw error;
      }
      onSuccess();
    } catch (err: any) {
      console.error('Error saving project:', err);
      alert('Failed to save project: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#0f2230]/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10">
          <h2 className="text-2xl font-bold">{initialData ? 'Edit Project' : 'Post New Project'}</h2>
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
                {PROJECT_CATEGORIES.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
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

          <div className="space-y-4">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Cover Image</label>
            <div className="flex gap-4 items-start">
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 h-32 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-[#6CBAE6] hover:bg-slate-50 transition-all group relative overflow-hidden"
              >
                {formData.image_url ? (
                  <>
                    <img src={formData.image_url} alt="Cover preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <Upload className="text-white" size={24} />
                    </div>
                  </>
                ) : (
                  <>
                    {uploading ? <Loader2 className="animate-spin text-slate-300" size={24} /> : <Upload className="text-slate-300 group-hover:text-[#6CBAE6]" size={24} />}
                    <span className="text-xs text-slate-400 mt-2">Upload Image</span>
                  </>
                )}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handleCoverUpload}
                  disabled={uploading}
                />
              </div>
              <div className="flex-1 space-y-2">
                <label className="text-[10px] font-bold text-slate-400">OR PASTE URL</label>
                <input 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#6CBAE6] outline-none text-sm"
                  placeholder="https://images.unsplash.com/..."
                  value={formData.image_url}
                  onChange={e => setFormData({...formData, image_url: e.target.value})}
                />
              </div>
            </div>
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
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Components Used</label>
            <input 
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#6CBAE6] outline-none"
              placeholder="Arduino Uno, SG90 Servo, Ultrasonic Sensor (comma separated)"
              value={formData.components}
              onChange={e => setFormData({...formData, components: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Schematic Link (Optional)</label>
              <input 
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#6CBAE6] outline-none"
                placeholder="Link to Wokwi/Circuits.io"
                value={formData.schematic_url}
                onChange={e => setFormData({...formData, schematic_url: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Code Snippet (Optional)</label>
              <textarea 
                rows={1}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 font-mono text-sm focus:border-[#6CBAE6] outline-none resize-none"
                placeholder="void setup() { ... }"
                value={formData.code_snippet}
                onChange={e => setFormData({...formData, code_snippet: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Project Documentation (Markdown)</label>
              <button
                type="button"
                onClick={() => inlineFileInputRef.current?.click()}
                disabled={uploading}
                className="flex items-center gap-1.5 text-xs font-bold text-[#6CBAE6] hover:text-[#5BA9D6] transition-colors"
              >
                {uploading ? <Loader2 className="animate-spin" size={14} /> : <ImageIcon size={14} />}
                Add Image
              </button>
              <input 
                type="file" 
                ref={inlineFileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleInlineUpload}
              />
            </div>
            <textarea 
              required
              rows={8}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 font-mono text-sm focus:border-[#6CBAE6] outline-none"
              placeholder="# Step 1: Assembly\nPlace the wheels..."
              value={formData.content}
              onChange={e => setFormData({...formData, content: e.target.value})}
            />
          </div>

          <button 
            disabled={loading}
            className="w-full py-4 bg-[#6CBAE6] hover:bg-[#5BA9D6] text-white font-bold rounded-xl transition-all shadow-lg shadow-[#6CBAE6]/20 disabled:opacity-50"
          >
            {loading ? 'Publishing...' : initialData ? 'Update Project' : 'Publish Project'}
          </button>
        </form>
      </div>
    </div>
  );
};
