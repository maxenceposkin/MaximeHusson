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
    category: 'Motion / Photography',
    year: '2024',
    description: 'Exploration visuelle et sonore.',
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
  
  const [bio, setBio] = useState<string>(() => {
    return localStorage.getItem('portfolio_bio') || "Basé à Paris, je capture l'éphémère.";
  });

  const [showreelUrl, setShowreelUrl] = useState<string>(() => {
      return localStorage.getItem('portfolio_showreel') || DEFAULT_SHOWREEL;
  });

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isAdminView, setIsAdminView] = useState(false);
  const [currentView, setCurrentView] = useState<'home' | 'work'>('home');
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem('portfolio_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('portfolio_bio', bio);
  }, [bio]);

  useEffect(() => {
    localStorage.setItem('portfolio_showreel', showreelUrl);
  }, [showreelUrl]);

  // Handle Admin Routing via HASH (#admin)
  useEffect(() => {
    setMounted(true);
    const handleRoute = () => {
      if (window.location.hash === '#admin') {
        setIsAdminView(true);
      } else {
        setIsAdminView(false);
      }
    };
    handleRoute();
    window.addEventListener('hashchange', handleRoute);
    return () => window.removeEventListener('hashchange', handleRoute);
  }, []);

  const handleCloseAdmin = () => {
      window.location.hash = '';
      setIsAdminView(false);
  };

  if (isAdminView) {
      return (
          <AdminDashboard 
            projects={projects} setProjects={setProjects}
            bio={bio} setBio={setBio}
            showreelUrl={showreelUrl} setShowreelUrl={setShowreelUrl}
            onClose={handleCloseAdmin}
          />
      );
  }

  return (
    <div className={`min-h-screen relative bg-[#050505] text-[#e5e5e5] transition-opacity duration-1000 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
      <Navigation title="HUSSON" onNavigate={setCurrentView} currentView={currentView} onOpenAbout={() => setIsAboutOpen(true)} />

      <main className="w-full h-full">
        {currentView === 'home' && (
            <div className="fixed inset-0 z-0 bg-[#050505] flex items-center justify-center overflow-hidden">
                {/* Loader visible pendant le chargement de la vidéo */}
                {!videoLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center z-10">
                        <Loader2 className="animate-spin text-white/10" size={40} />
                    </div>
                )}
                
                <video 
                    key={showreelUrl}
                    src={showreelUrl} 
                    onLoadedData={() => setVideoLoaded(true)}
                    // On garde un fallback visuel avec une opacité minimale même avant chargement
                    className={`w-full h-full object-cover transition-opacity duration-1000 ${videoLoaded ? 'opacity-60' : 'opacity-20'}`} 
                    autoPlay 
                    muted 
                    loop 
                    playsInline 
                    poster="https://images.unsplash.com/photo-1492691523567-6119e281dfbb?q=80&w=2070&auto=format&fit=crop"
                />
                
                {/* Zone cliquable pour entrer */}
                <div className="absolute inset-0 z-20 flex items-center justify-center cursor-pointer group" onClick={() => setCurrentView('work')}>
                     <div className="text-center space-y-4">
                        <p className="text-[10px] uppercase tracking-[0.5em] text-white/40 group-hover:text-white transition-all duration-500">Explorer</p>
                        <div className="h-[1px] w-0 group-hover:w-12 bg-white/40 mx-auto transition-all duration-500"></div>
                     </div>
                </div>

                {/* Bouton Admin secret en bas à droite sur l'accueil */}
                <button 
                    onClick={() => window.location.hash = 'admin'}
                    className="absolute bottom-6 right-6 z-30 text-[9px] uppercase tracking-widest text-white/5 hover:text-white/40 transition-colors"
                >
                    Admin
                </button>
            </div>
        )}

        {currentView === 'work' && (
            <div className="pt-32 pb-20 px-4 md:px-10 max-w-[2400px] mx-auto animate-[fadeIn_0.8s_ease-out]">
                <div className="columns-1 md:columns-2 lg:columns-3 gap-6 md:gap-10 space-y-6 md:space-y-10">
                {projects.map((project) => (
                    <div key={project.id} className="break-inside-avoid group cursor-pointer" onClick={() => setSelectedProject(project)}>
                        <div className="relative overflow-hidden bg-neutral-900 aspect-auto">
                            <img 
                                src={project.coverImage} 
                                alt={project.title} 
                                className="w-full h-auto object-cover transition-transform duration-1000 ease-out group-hover:scale-105 opacity-90 group-hover:opacity-100" 
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-700" />
                            <div className="absolute bottom-0 left-0 w-full p-8 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0 flex justify-between items-end text-white mix-blend-difference">
                                <div>
                                    <h3 className="text-xl font-medium tracking-tight">{project.title}</h3>
                                    <p className="text-[10px] uppercase tracking-widest mt-1 opacity-70">{project.category}</p>
                                </div>
                                <span className="text-[10px] font-light opacity-50">{project.year}</span>
                            </div>
                        </div>
                    </div>
                ))}
                </div>
            </div>
        )}
      </main>

      {currentView === 'work' && (
        <footer className="px-10 py-16 flex flex-col md:flex-row justify-between items-center text-[10px] uppercase tracking-[0.2em] text-neutral-600 border-t border-neutral-900/50 mt-20">
            <div className="flex gap-8 mb-6 md:mb-0">
                <a href="#" className="hover:text-white transition-colors">Instagram</a>
                <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
            <div className="flex flex-col items-center md:items-end gap-2">
                <span>© HUSSON {new Date().getFullYear()}</span>
                <button onClick={() => { window.location.hash = 'admin'; }} className="opacity-30 hover:opacity-100 transition-opacity">Panel</button>
            </div>
        </footer>
      )}

      <ProjectDetail project={selectedProject} onClose={() => setSelectedProject(null)} />
      <AboutOverlay isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} bio={bio} onUpdateBio={setBio} />
    </div>
  );
}