import { useState, useEffect } from 'react';
import { Project } from './utils';
import { ProjectDetail } from './components/ProjectDetail';
import { ProjectForm } from './components/ProjectForm';
import { HeroShowcase } from './components/HeroShowcase';
import { CategoryStrip } from './components/CategoryStrip';
import { AuthModal } from './components/AuthModal';
import { supabase } from './lib/supabase';
import { Search, Github, Cloud, User as UserIcon, LogOut, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { User } from '@supabase/supabase-js';
import logo from '../pics/pic.jpg';
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Link, 
  useNavigate, 
  useLocation 
} from 'react-router-dom';
import { Home } from './pages/Home';
import { Projects } from './pages/Projects';
import { FAQ } from './components/FAQ';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';

function Layout({ children, onNewProject, user, setIsAuthOpen, searchQuery, setSearchQuery, isSearchOpen, setIsSearchOpen }: any) {
  const navigate = useNavigate();
  const { language, setLanguage } = useLanguage();
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-white">
        <div className="w-full h-28 px-4 md:px-6 lg:px-8 grid grid-cols-[auto_1fr_auto] items-center gap-4">
          <Link 
            to="/"
            className="flex items-center gap-2 md:gap-3 cursor-pointer"
          >
            <img src={logo} alt="Myanmar Robotics Lab logo" className="h-24 w-24 rounded-md object-cover" />
            <div className="mrl-brand leading-none">
              <div className="mrl-brand-top">MRL</div>
              <div className="mrl-brand-bottom">Project Hub</div>
            </div>
          </Link>

          <div className="hidden lg:flex items-center justify-center gap-12">
            <Link to="/" className="mrl-nav-item">Home</Link>
            <Link to="/projects" className="mrl-nav-item">Projects</Link>
            <Link to="/faq" className="mrl-nav-item">FAQ</Link>
            <button 
              onClick={onNewProject}
              className="mrl-cta"
            >
              + New Project
            </button>
          </div>

          <div className="flex items-center gap-3 md:gap-4 justify-self-end">
            <AnimatePresence>
              {isSearchOpen && (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 240, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  className="relative overflow-hidden"
                >
                  <input
                    autoFocus
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search projects..."
                    className="w-full h-10 pl-4 pr-10 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#6CBAE6]/25"
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <X size={14} />
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
            <button 
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="text-[#5c5c5b] hover:text-slate-900 transition-colors" 
              aria-label="Search"
            >
              <Search size={20} />
            </button>
            <span className="hidden md:inline-block h-8 border-l border-[#5c5c5b]/40" aria-hidden="true" />
            <button className="hidden md:inline-flex items-center gap-1 text-[#5c5c5b] hover:text-slate-900 transition-colors">
              <Cloud size={20} />
              <span className="mrl-nav-item">Cloud</span>
            </button>
            <div className="flex bg-slate-100 p-1 rounded-xl">
              <button 
                onClick={() => setLanguage('en')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${language === 'en' ? 'bg-white text-[#6CBAE6] shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              >
                EN
              </button>
              <button 
                onClick={() => setLanguage('mm')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${language === 'mm' ? 'bg-white text-[#6CBAE6] shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              >
                MM
              </button>
            </div>

            <span className="hidden md:inline-block h-8 border-l border-[#5c5c5b]/40" aria-hidden="true" />
            
            {user ? (
              <div className="flex items-center gap-4 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex flex-col items-end">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">MEMBER</span>
                  <span className="text-sm font-black text-slate-900 leading-tight">
                    {user.email?.split('@')[0]}
                  </span>
                </div>
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#6CBAE6] to-[#5c98ff] flex items-center justify-center text-white font-bold text-xs ring-2 ring-white shadow-md">
                  {user.email?.[0].toUpperCase()}
                </div>
                <button 
                  onClick={() => supabase.auth.signOut()}
                  className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                  title="Sign Out"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setIsAuthOpen(true)}
                className="hidden md:inline-flex items-center gap-1 text-[#5c5c5b] hover:text-slate-900 transition-colors"
              >
                <UserIcon size={20} />
                <span className="mrl-nav-item">Login</span>
              </button>
            )}
          </div>
        </div>
      </nav>
      {children}
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <Router>
        <AppContent />
      </Router>
    </LanguageProvider>
  );
}

function AppContent() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All categories');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const navigate = useNavigate();
  const location = useLocation();

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (err) {
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <Layout 
      user={user} 
      setIsAuthOpen={setIsAuthOpen}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      isSearchOpen={isSearchOpen}
      setIsSearchOpen={setIsSearchOpen}
      onNewProject={() => user ? setIsFormOpen(true) : setIsAuthOpen(true)}
    >
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
                onEdit={() => {
                  setEditingProject(selectedProject);
                  setIsFormOpen(true);
                }}
                onDelete={() => {
                  setSelectedProject(null);
                  fetchProjects();
                }}
                user={user}
              />
            </motion.div>
          ) : (
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={
                <Home 
                  projects={projects} 
                  loading={loading}
                  selectedCategory={selectedCategory}
                  onSelectCategory={setSelectedCategory}
                  onProjectClick={setSelectedProject}
                  searchQuery={searchQuery}
                />
              } />
              <Route path="/projects" element={
                <Projects 
                  projects={projects} 
                  loading={loading}
                  selectedCategory={selectedCategory}
                  onSelectCategory={setSelectedCategory}
                  onProjectClick={setSelectedProject}
                  searchQuery={searchQuery}
                />
              } />
              <Route path="/faq" element={<FAQ />} />
            </Routes>
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

      {/* Modals */}
      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ProjectForm 
              onClose={() => {
                setIsFormOpen(false);
                setEditingProject(null);
              }} 
              onSuccess={() => {
                setIsFormOpen(false);
                setEditingProject(null);
                fetchProjects();
              }}
              initialData={editingProject || undefined}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isAuthOpen && (
          <AuthModal 
            isOpen={isAuthOpen} 
            onClose={() => setIsAuthOpen(false)} 
          />
        )}
      </AnimatePresence>
    </Layout>
  );
}
