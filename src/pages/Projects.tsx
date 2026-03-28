import React from 'react';
import { CategoryStrip } from '../components/CategoryStrip';
import { ProjectCard } from '../components/ProjectCard';
import { Project } from '../utils';
import { motion } from 'motion/react';

interface ProjectsProps {
  projects: Project[];
  loading: boolean;
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  onProjectClick: (project: Project) => void;
  searchQuery: string;
}

export const Projects: React.FC<ProjectsProps> = ({ 
  projects, 
  loading, 
  selectedCategory, 
  onSelectCategory, 
  onProjectClick,
  searchQuery
}) => {
  const filteredProjects = projects.filter((project) => {
    const matchesCategory = selectedCategory === 'All categories' || project.category === selectedCategory;
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          project.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-7xl mx-auto px-4 py-12"
    >
      <div className="mb-12">
        <h1 className="text-4xl font-black text-slate-900 mb-4">Explore Projects</h1>
        <p className="text-slate-500">Discover amazing robotics projects from our community.</p>
      </div>

      <CategoryStrip
        selectedCategory={selectedCategory}
        onSelectCategory={onSelectCategory}
      />

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="bg-slate-100 animate-pulse rounded-xl aspect-[4/5]" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map(project => (
            <ProjectCard 
              key={project.id} 
              project={project} 
              onClick={() => onProjectClick(project)}
            />
          ))}
        </div>
      )}

      {!loading && filteredProjects.length === 0 && (
        <div className="text-center py-24">
          <p className="text-slate-400 font-medium">No projects found matching your criteria.</p>
        </div>
      )}
    </motion.div>
  );
};
