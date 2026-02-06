import React, { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { ProjectDetail } from './components/ProjectDetail';
import { AboutOverlay } from './components/AboutOverlay';
import { AdminDashboard } from './components/AdminDashboard';
import { Project } from './types';
import { Loader2 } from 'lucide-react';

const DEFAULT_PROJECTS: Project[] = [
  {
    id: '1',
    title: 'HUSSON ARCHIVES',
    category: 'Visual Arts',
    year: '2024',
    description: 'Une exploration des textures et de la lumière.',
    coverImage: 'https://images.unsplash.com/photo-1492691523567-6119e281dfbb?q=80&w=2070&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1492691523567-6119e281dfbb?q=80&w=2070&auto=format&fit=crop']
  }
];

const DEFAULT_SHOWREEL = "https://cdn.coverr.co/videos/coverr-walking-through-an-empty-underground-parking-lot-4536/1080p.mp4";

export default function App() {
  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const saved = localStorage.getItem('portfolio_projects');
      return saved ? JSON.parse(saved) : DEFAULT_PROJECTS;
    } catch (e) { return DEFAULT_PROJECTS; }
  });
  
  const [bio, setBio] = useState<string>(() => localStorage.getItem('portfolio_bio') || "Basé à Paris, je capture l'éphémère.");
  const [showreelUrl, setShowreelUrl] = useState<string>(() => localStorage.getItem('portfolio_showreel') || DEFAULT_SHOWREEL);
  
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isAdminView, setIsAdminView] = useState(false);
  const [currentView, setCurrentView] = useState<'home' | 'work'>('home');
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    localStorage.setItem('portfolio_projects', JSON.stringify(projects));
    localStorage.setItem('portfolio_bio', bio);
    localStorage.setItem('portfolio_showreel', showreelUrl);
  }, [projects, bio, showreelUrl]);

  useEffect(() => {
    setMounted(true);
    const handleRoute = () => {
      // Détection de l'URL admin
      if (window.location.hash === '#admin' || window.location.pathname === '/admin') {
        setIsAdminView(true);
      } else {
        setIsAdminView(false);
      }
    };
    handleRoute();
    window.addEventListener('hashchange', handleRoute);
    return () => window.removeEventListener('hashchange', handleRoute);
  }, []);

  if (isAdminView) {
    return (
      <AdminDashboard 
        projects={projects} setProjects={setProjects}
        bio={bio} setBio={setBio}
        showreelUrl={showreelUrl} setShowreelUrl={setShowreelUrl}
        onClose={() => { window.location.hash = ''; setIsAdminView(false); }}
      />
    );
  }

  return (
    <div className={`min-h-screen relative bg-[#050505] text-[#e5e5e5] transition-opacity duration-1000 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
      <Navigation title="HUSSON" onNavigate={setCurrentView} currentView={currentView} onOpenAbout={() => setIsAboutOpen(true)} />

      <main className="w-full h-full">
        {currentView === 'home' && (
          <div className="fixed inset-0 z-0 bg-[#050505] flex items-center justify-center overflow-hidden">
            {/* Background Gradient Fallback (évite l'écran noir) */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] to-[#050505] opacity-50" />
            
            {!videoLoaded && (
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <Loader2 className="animate-spin text-white/5" size={40} />
              </div>
            )}
            
            <video 
              key={showreelUrl}
              src={showreelUrl} 
              onLoadedData={() => setVideoLoaded(true)}
              className={`w-full h-full object-cover transition-opacity duration-2000 ${videoLoaded ? 'opacity-40' : 'opacity-0'}`} 
              autoPlay muted loop playsInline 
            />
            
            {/* Overlay toujours visible pour cliquer et entrer */}
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center cursor-pointer group" onClick={() => setCurrentView('work')}>
              <div className="text-center space-y-6 animate-fade-in">
                <h1 className="text-white/80 text-[10px] uppercase tracking-[0.8em] font-light">Maxime Husson</h1>
                <div className="flex flex-col items-center gap-4">
                  <span className="text-[9px] uppercase tracking-[0.4em] text-white/30 group-hover:text-white transition-all duration-700">Enter Portfolio</span>
                  <div className="w-[1px] h-12 bg-gradient-to-b from-white/0 via-white/20 to-white/0 group-hover:via-white/60 transition-all duration-700" />
                </div>
              </div>
            </div>

            {/* Accès Admin discret */}
            <button 
              onClick={() => window.location.hash = 'admin'}
              className="absolute bottom-8 right-8 z-30 text-[8px] uppercase tracking-widest text-white/5 hover:text-white/40 transition-colors"
            >
              System Admin
            </button>
          </div>
        )}

        {currentView === 'work' && (
          <div className="pt-32 pb-20 px-6 md:px-12 max-w-[2400px] mx-auto animate-fade-in">
            <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
              {projects.map((project) => (
                <div key={project.id} className="break-inside-avoid group cursor-pointer" onClick={() => setSelectedProject(project)}>
                  <div className="relative overflow-hidden bg-neutral-900 shadow-2xl">
                    <img 
                      src={project.coverImage} 
                      alt={project.title} 
                      className="w-full h-auto object-cover transition-transform duration-1000 group-hover:scale-105 grayscale-[30%] group-hover:grayscale-0 opacity-80 group-hover:opacity-100" 
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-all duration-700" />
                    <div className="absolute bottom-0 left-0 w-full p-8 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0 flex justify-between items-end text-white">
                      <div>
                        <h3 className="text-lg font-medium tracking-tight uppercase">{project.title}</h3>
                        <p className="text-[9px] uppercase tracking-widest mt-1 text-white/60">{project.category}</p>
                      </div>
                      <span className="text-[9px] opacity-40">{project.year}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {currentView === 'work' && (
        <footer className="px-12 py-20 flex flex-col md:flex-row justify-between items-center text-[9px] uppercase tracking-[0.3em] text-neutral-600 border-t border-neutral-900/30 mt-20">
          <div className="flex gap-10 mb-8 md:mb-0">
            <a href="#" className="hover:text-white transition-colors">Instagram</a>
            <a href="#" className="hover:text-white transition-colors">Vimeo</a>
            <a href="#" className="hover:text-white transition-colors">Mail</a>
          </div>
          <div className="flex flex-col items-center md:items-end gap-2">
            <span>© {new Date().getFullYear()} HUSSON STUDIO</span>
          </div>
        </footer>
      )}

      <ProjectDetail project={selectedProject} onClose={() => setSelectedProject(null)} />
      <AboutOverlay isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} bio={bio} onUpdateBio={setBio} />
    </div>
  );
}