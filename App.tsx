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
    title: 'SILENCE URBAIN',
    category: 'Architecture',
    year: '2024',
    description: 'Une étude photographique sur les espaces liminaux.',
    coverImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop']
  }
];

const DEFAULT_SHOWREEL = "https://cdn.coverr.co/videos/coverr-walking-through-an-empty-underground-parking-lot-4536/1080p.mp4";

export default function App() {
  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('portfolio_projects');
    return saved ? JSON.parse(saved) : DEFAULT_PROJECTS;
  });
  
  const [bio, setBio] = useState<string>(() => {
    return localStorage.getItem('portfolio_bio') || "Basé à Paris, je capture l'éphémère à travers une lentille brute.";
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

  useEffect(() => {
    localStorage.setItem('portfolio_projects', JSON.stringify(projects));
    localStorage.setItem('portfolio_bio', bio);
    localStorage.setItem('portfolio_showreel', showreelUrl);
  }, [projects, bio, showreelUrl]);

  useEffect(() => {
    setMounted(true);
    const handleRoute = () => {
      if (window.location.hash === '#admin') setIsAdminView(true);
      else setIsAdminView(false);
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
    <div className={`min-h-screen relative selection:bg-white selection:text-black bg-[#050505] text-[#e5e5e5] ${mounted ? 'opacity-100' : 'opacity-0'} transition-opacity duration-1000`}>
      <Navigation title="HUSSON" onNavigate={setCurrentView} currentView={currentView} onOpenAbout={() => setIsAboutOpen(true)} />

      <main className="w-full h-full">
        {currentView === 'home' && (
            <div className="fixed inset-0 z-0 bg-[#050505] flex items-center justify-center">
                {!videoLoaded && <Loader2 className="animate-spin text-white/20" size={32} />}
                <video 
                    key={showreelUrl}
                    src={showreelUrl} 
                    onLoadedData={() => setVideoLoaded(true)}
                    className={`w-full h-full object-cover transition-opacity duration-1000 ${videoLoaded ? 'opacity-60' : 'opacity-0'}`} 
                    autoPlay muted loop playsInline 
                />
                <div className="absolute inset-0 flex items-center justify-center cursor-pointer" onClick={() => setCurrentView('work')}>
                     <p className="text-xs uppercase tracking-[0.3em] text-white/50 hover:text-white transition-colors animate-pulse">Entrer</p>
                </div>
            </div>
        )}

        {currentView === 'work' && (
            <div className="pt-32 pb-20 px-4 md:px-6 max-w-[2000px] mx-auto animate-[fadeIn_0.5s_ease-out]">
                <div className="columns-1 md:columns-2 lg:columns-3 gap-4 md:gap-8 space-y-4 md:space-y-8">
                {projects.map((project) => (
                    <div key={project.id} className="break-inside-avoid group cursor-pointer" onClick={() => setSelectedProject(project)}>
                    <div className="relative overflow-hidden bg-neutral-900">
                        <img src={project.coverImage} alt={project.title} className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                        <div className="absolute bottom-0 left-0 w-full p-6 opacity-0 group-hover:opacity-100 transition-opacity flex justify-between items-end text-white mix-blend-difference">
                            <div><h3 className="text-lg font-medium">{project.title}</h3><p className="text-xs uppercase tracking-wider">{project.category}</p></div>
                            <span className="text-xs">{project.year}</span>
                        </div>
                    </div>
                    </div>
                ))}
                </div>
            </div>
        )}
      </main>

      {currentView === 'work' && (
        <footer className="px-6 py-12 flex flex-col md:flex-row justify-between items-center text-xs uppercase tracking-widest text-neutral-500 border-t border-neutral-900 mt-20">
            <div className="flex gap-4"><span>© HUSSON {new Date().getFullYear()}</span></div>
            <button onClick={() => { window.location.hash = 'admin'; }} className="text-[10px] opacity-20 hover:opacity-100 mt-4 md:mt-0">Admin</button>
        </footer>
      )}
      
      {currentView === 'home' && (
           <div className="fixed bottom-4 right-4 z-40">
                <button onClick={() => { window.location.hash = 'admin'; }} className="text-[10px] text-white/10 hover:text-white/50 transition-colors uppercase tracking-widest">Admin</button>
           </div>
      )}

      <ProjectDetail project={selectedProject} onClose={() => setSelectedProject(null)} />
      <AboutOverlay isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} bio={bio} onUpdateBio={setBio} />
    </div>
  );
}