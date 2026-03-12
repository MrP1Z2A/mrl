import React from 'react';
import { Project } from '../utils';
import { User, BarChart } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="group bg-white border border-slate-200 rounded-xl overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 flex flex-col h-full"
    >
      <div className="relative aspect-video overflow-hidden">
        <img 
          src={project.image_url} 
          alt={project.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="px-2 py-1 bg-white/90 backdrop-blur-sm text-[10px] font-bold uppercase tracking-wider rounded-md border border-slate-200">
            {project.category}
          </span>
        </div>
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-xl font-bold mb-2 group-hover:text-[#6CBAE6] transition-colors">
          {project.title}
        </h3>
        <p className="text-slate-500 text-sm line-clamp-2 mb-4 flex-grow">
          {project.description}
        </p>
        
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-slate-400 text-xs font-medium">
          <div className="flex items-center gap-1.5">
            <User size={14} />
            <span>{project.author}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <BarChart size={14} />
              <span>{project.difficulty}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
