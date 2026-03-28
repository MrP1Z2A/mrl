import React from 'react';
import { Project } from '../utils';
import ReactMarkdown from 'react-markdown';
import { ArrowLeft, User, Calendar, BarChart, Cpu, Code, ExternalLink, Box } from 'lucide-react';

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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <div className="prose prose-slate max-w-none mb-12">
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Box className="text-[#6CBAE6]" size={24} />
              Project Story
            </h3>
            <ReactMarkdown>{project.content}</ReactMarkdown>
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
