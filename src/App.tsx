import { useState, useEffect } from 'react';
import { Project } from './utils';
import { ProjectCard } from './components/ProjectCard';
import { ProjectDetail } from './components/ProjectDetail';
import { ProjectForm } from './components/ProjectForm';
import { Plus, Search, Github } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import logo from '../pics/pic.jpg';

export default function App() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/projects');
      const data = await res.json();
      setProjects(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const filteredProjects = filter === 'All' 
    ? projects 
    : projects.filter(p => p.category === filter);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div 
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setSelectedProject(null)}
          >
            <img src={logo} alt="Myanmar Robotics Lab (MRL) logo" className="h-9 w-9 rounded-lg object-cover ring-2 ring-[#6CBAE6]/30" />
            <span className="text-xl font-black tracking-tighter uppercase">Myanmar Robotics Lab (MRL)</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <button className="text-sm font-bold uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-colors">Explore</button>
            <button className="text-sm font-bold uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-colors">Community</button>
            <button className="text-sm font-bold uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-colors">Hardware</button>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsFormOpen(true)}
              className="flex items-center gap-2 bg-[#6CBAE6] text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-[#5BA9D6] transition-all shadow-lg shadow-[#6CBAE6]/20"
            >
              <Plus size={18} />
              <span>Post Project</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="flex-grow">
        <AnimatePresence mode="wait">
          {selectedProject ? (
            <motion.div
              key="detail"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <ProjectDetail 
                project={selectedProject} 
                onBack={() => setSelectedProject(null)} 
              />
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-7xl mx-auto px-4 py-12"
            >
              {/* Hero Section */}
              <div className="mb-16 text-center">
                <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6 leading-none">
                  BUILD THE <span className="text-[#6CBAE6]">FUTURE</span>
                </h1>
                <p className="text-xl text-slate-600 max-w-2xl mx-auto font-medium">
                  The community for open-source mechanical engineering and robotics. 
                  Share your builds, learn from others, and push the boundaries of hardware.
                </p>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center justify-between gap-6 mb-12 pb-6 border-b border-slate-200">
                <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
                  {['All', 'Robotics', 'Mechanical', 'Energy', 'IoT'].map(cat => (
                    <button
                      key={cat}
                      onClick={() => setFilter(cat)}
                      className={`px-4 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap ${
                        filter === cat 
                          ? 'bg-[#6CBAE6] text-white shadow-lg shadow-[#6CBAE6]/20' 
                          : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    placeholder="Search projects..."
                    className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-full text-sm focus:ring-2 focus:ring-[#6CBAE6]/30 outline-none"
                  />
                </div>
              </div>

              {/* Project Grid */}
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="bg-slate-100 animate-pulse rounded-xl aspect-[4/5]" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredProjects.map(project => (
                    <ProjectCard 
                      key={project.id} 
                      project={project} 
                      onClick={() => setSelectedProject(project)}
                    />
                  ))}
                </div>
              )}

              {!loading && filteredProjects.length === 0 && (
                <div className="text-center py-24">
                  <p className="text-slate-400 font-medium">No projects found in this category.</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-[#0f2230] text-slate-300 py-12 border-t border-[#1f3d54]">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 text-white mb-6">
              <img src={logo} alt="Myanmar Robotics Lab (MRL) logo" className="h-8 w-8 rounded-md object-cover" />
              <span className="text-xl font-black tracking-tighter uppercase">Myanmar Robotics Lab (MRL)</span>
            </div>
            <p className="max-w-md mb-6">
              Empowering engineers and makers to document and share their hardware innovations. 
              Built for the community, by the community.
            </p>
            <div className="flex gap-4">
              <button className="p-2 bg-[#1f3d54] rounded-full hover:text-white transition-colors">
                <Github size={20} />
              </button>
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-6">Resources</h4>
            <ul className="space-y-4 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Hardware Guide</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Safety Protocols</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-6">Company</h4>
            <ul className="space-y-4 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 mt-12 pt-12 border-t border-[#1f3d54] text-xs text-center">
          © {new Date().getFullYear()} Myanmar Robotics Lab (MRL). All rights reserved.
        </div>
      </footer>

      {/* Project Form Modal */}
      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ProjectForm 
              onClose={() => setIsFormOpen(false)} 
              onSuccess={() => {
                setIsFormOpen(false);
                fetchProjects();
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
