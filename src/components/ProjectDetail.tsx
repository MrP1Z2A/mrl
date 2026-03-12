import React from 'react';
import { Project } from '../utils';
import ReactMarkdown from 'react-markdown';
import { ArrowLeft, User, Calendar, BarChart } from 'lucide-react';

interface ProjectDetailProps {
  project: Project;
  onBack: () => void;
}

export const ProjectDetail: React.FC<ProjectDetailProps> = ({ project, onBack }) => {
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
          {project.title}
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
        </div>
      </div>

      <div className="rounded-2xl overflow-hidden mb-12 shadow-2xl">
        <img 
          src={project.image_url} 
          alt={project.title}
          referrerPolicy="no-referrer"
          className="w-full aspect-video object-cover"
        />
      </div>

      <div className="prose prose-slate max-w-none">
        <ReactMarkdown>{project.content}</ReactMarkdown>
      </div>
    </div>
  );
};
