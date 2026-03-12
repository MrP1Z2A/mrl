import { useState, useEffect } from 'react';
import { Project } from './utils';
import { ProjectCard } from './components/ProjectCard';
import { ProjectDetail } from './components/ProjectDetail';
import { ProjectForm } from './components/ProjectForm';
import { HeroShowcase } from './components/HeroShowcase';
import { CategoryStrip } from './components/CategoryStrip';
import { ProjectToolbar } from './components/ProjectToolbar';
import { Plus, Search, Github, Cloud, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import logo from '../pics/pic.jpg';

export default function App() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="w-full pl-2 pr-4 h-20 flex items-center justify-between gap-3">
          <div 
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setSelectedProject(null)}
          >
            <img src={logo} alt="Myanmar Robotics Lab logo" className="h-20 w-20 rounded-md object-cover ring-2 ring-[#6CBAE6]/30" />
            <div className="mrl-brand leading-none">
              <div className="mrl-brand-top">Myanmar</div>
              <div className="mrl-brand-bottom">Robotics Lab</div>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-8">
            <button className="text-sm font-bold text-[#0f8b95] hover:text-[#0e737b] transition-colors">Projects</button>
            <button className="text-sm font-bold text-slate-700 hover:text-slate-900 transition-colors">Featured</button>
            <button className="text-sm font-bold text-slate-700 hover:text-slate-900 transition-colors">Pro</button>
            <button className="text-sm font-bold text-slate-700 hover:text-slate-900 transition-colors">For School</button>
            <button className="text-sm font-bold text-slate-700 hover:text-slate-900 transition-colors">FAQ</button>
          </div>

          <div className="flex items-center gap-3">
            <button className="hidden md:inline-flex text-slate-600 hover:text-slate-900 transition-colors" aria-label="Search">
              <Search size={20} />
            </button>
            <button className="hidden md:inline-flex items-center gap-1 text-slate-700 hover:text-slate-900 transition-colors">
              <Cloud size={18} />
              <span className="text-sm font-semibold">Cloud</span>
            </button>
            <button className="hidden md:inline-flex items-center gap-1 text-slate-700 hover:text-slate-900 transition-colors">
              <User size={18} />
              <span className="text-sm font-semibold">Login</span>
            </button>
            <button 
              onClick={() => setIsFormOpen(true)}
              className="flex items-center gap-2 bg-[#0f8b95] text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-[#0e737b] transition-all shadow-lg shadow-[#0f8b95]/20"
            >
              <Plus size={18} />
              <span>New Project</span>
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
              <HeroShowcase />
              <CategoryStrip />
              <ProjectToolbar />

              {/* Project Grid */}
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="bg-slate-100 animate-pulse rounded-xl aspect-[4/5]" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {projects.map(project => (
                    <ProjectCard 
                      key={project.id} 
                      project={project} 
                      onClick={() => setSelectedProject(project)}
                    />
                  ))}
                </div>
              )}

              {!loading && projects.length === 0 && (
                <div className="text-center py-24">
                  <p className="text-slate-400 font-medium">No projects available yet.</p>
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
              <img src={logo} alt="Myanmar Robotics Lab logo" className="h-16 w-16 rounded-md object-cover" />
              <div className="mrl-brand leading-none">
                <div className="mrl-brand-top">Myanmar</div>
                <div className="mrl-brand-bottom">Robotics Lab</div>
              </div>
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
          © {new Date().getFullYear()} Myanmar Robotics Lab. All rights reserved.
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
