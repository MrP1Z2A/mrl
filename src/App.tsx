import { useState, useEffect } from 'react';
import { Project } from './utils';
import { ProjectCard } from './components/ProjectCard';
import { ProjectDetail } from './components/ProjectDetail';
import { ProjectForm } from './components/ProjectForm';
import { HeroShowcase } from './components/HeroShowcase';
import { CategoryStrip } from './components/CategoryStrip';
import { ProjectToolbar } from './components/ProjectToolbar';
import { Search, Github, Cloud, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import logo from '../pics/pic.jpg';

export default function App() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All categories');

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

  const filteredProjects =
    selectedCategory === 'All categories'
      ? projects
      : projects.filter((project) => project.category === selectedCategory);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-white">
        <div className="w-full h-28 px-4 md:px-6 lg:px-8 grid grid-cols-[auto_1fr_auto] items-center gap-4">
          <div 
            className="flex items-center gap-2 md:gap-3 cursor-pointer"
            onClick={() => setSelectedProject(null)}
          >
            <img src={logo} alt="Myanmar Robotics Lab logo" className="h-24 w-24 rounded-md object-cover" />
            <div className="mrl-brand leading-none">
              <div className="mrl-brand-top">MRL</div>
              <div className="mrl-brand-bottom">Project Hub</div>
            </div>
          </div>

          <div className="hidden lg:flex items-center justify-center gap-12">
            <button className="mrl-nav-item">Home</button>
            <button className="mrl-nav-item">Projects</button>
            <button className="mrl-nav-item">FAQ</button>
            <button 
              onClick={() => setIsFormOpen(true)}
              className="mrl-cta"
            >
              + New Project
            </button>
          </div>

          <div className="flex items-center gap-3 md:gap-4 justify-self-end">
            <button className="hidden md:inline-flex text-[#5c5c5b] hover:text-slate-900 transition-colors" aria-label="Search">
              <Search size={20} />
            </button>
            <span className="hidden md:inline-block h-8 border-l border-[#5c5c5b]/40" aria-hidden="true" />
            <button className="hidden md:inline-flex items-center gap-1 text-[#5c5c5b] hover:text-slate-900 transition-colors">
              <Cloud size={20} />
              <span className="mrl-nav-item">Cloud</span>
            </button>
            <span className="hidden md:inline-block h-8 border-l border-[#5c5c5b]/40" aria-hidden="true" />
            <button className="hidden md:inline-flex items-center gap-1 text-[#5c5c5b] hover:text-slate-900 transition-colors">
              <User size={20} />
              <span className="mrl-nav-item">Login</span>
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
              <CategoryStrip
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
              />
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
