import React from 'react';
import { Project } from '../utils';
import ReactMarkdown from 'react-markdown';
import { ArrowLeft, User, Calendar, BarChart, Cpu, Code, ExternalLink, Box, Edit2, Trash2, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { User as AuthUser } from '@supabase/supabase-js';
import { useLanguage } from '../contexts/LanguageContext';

interface ProjectDetailProps {
  project: Project;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
  user: AuthUser | null;
}

export const ProjectDetail: React.FC<ProjectDetailProps> = ({ project, onBack, onEdit, onDelete, user }) => {
  const [isDeleting, setIsDeleting] = React.useState(false);
  const { language, t } = useLanguage();
  const isOwner = user?.id === project.user_id;

  const displayTitle = language === 'mm' && project.title_mm ? project.title_mm : project.title;
  const displayContent = language === 'mm' && project.content_mm ? project.content_mm : project.content;

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) return;
    
    setIsDeleting(true);
    try {
      console.log('Deleting project:', project.id);
      const { data, error } = await supabase
        .from('projects')
        .delete()
        .eq('id', project.id)
        .select();
      
      if (error) throw error;
      
      if (!data || data.length === 0) {
        throw new Error('No project was deleted. This is usually due to database permissions (RLS) or an incorrect ID.');
      }

      console.log('Project deleted successfully');
      onDelete();
    } catch (err: any) {
      console.error('Delete error:', err);
      alert('Delete failed: ' + err.message);
    } finally {
      setIsDeleting(false);
    }
  };
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-8 transition-colors group"
      >
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        <span className="font-medium">Back to Projects</span>
      </button>

      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <span className="px-3 py-1 bg-[#6CBAE6]/20 text-[#2a6f9a] text-xs font-bold uppercase tracking-widest rounded-full">
            {project.category}
          </span>
          <div className="flex items-center gap-1 text-slate-400 text-sm">
            <BarChart size={16} />
            <span>{project.difficulty}</span>
          </div>
        </div>
        <h1 className="text-5xl font-black tracking-tight mb-6 leading-tight">
          {displayTitle}
        </h1>
        
        <div className="flex items-center gap-6 text-slate-500 border-y border-slate-200 py-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
              <User size={16} />
            </div>
            <span className="font-medium">{project.author}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={18} />
            <span>{new Date(project.created_at).toLocaleDateString()}</span>
          </div>

          {isOwner && (
            <div className="flex-grow flex justify-end gap-3">
              <button 
                onClick={onEdit}
                className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-sm transition-all"
              >
                <Edit2 size={16} />
                Edit
              </button>
              <button 
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl font-bold text-sm transition-all disabled:opacity-50"
              >
                {isDeleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="rounded-2xl overflow-hidden mb-12 shadow-2xl">
        <img 
          src={project.image_url} 
          alt={displayTitle}
          referrerPolicy="no-referrer"
          className="w-full aspect-video object-cover"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <div className="prose prose-slate max-w-none mb-12">
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Box className="text-[#6CBAE6]" size={24} />
              Project Story
            </h3>
            <ReactMarkdown>{displayContent}</ReactMarkdown>
          </div>

          {project.code_snippet && (
            <div className="mb-12">
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Code className="text-[#6CBAE6]" size={24} />
                Example Code
              </h3>
              <div className="bg-[#1e293b] text-slate-100 p-6 rounded-2xl overflow-x-auto font-mono text-sm leading-relaxed border border-slate-700 shadow-xl">
                <pre>{project.code_snippet}</pre>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-8">
          {project.components && project.components.length > 0 && (
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Cpu className="text-[#6CBAE6]" size={20} />
                Bill of Materials
              </h3>
              <ul className="space-y-3">
                {project.components.map((comp, i) => (
                  <li key={i} className="flex items-center gap-2 text-slate-600 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#6CBAE6]" />
                    {comp}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {project.schematic_url && (
            <div className="bg-[#6CBAE6]/10 p-6 rounded-2xl border border-[#6CBAE6]/20">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <ExternalLink className="text-[#6CBAE6]" size={20} />
                Schematics
              </h3>
              <p className="text-sm text-slate-600 mb-4">View the circuit diagram for this project.</p>
              <a 
                href={project.schematic_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#6CBAE6] text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-[#5BA9D6] transition-colors"
                title="Open Schematic"
              >
                Open in Designer
                <ExternalLink size={14} />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
