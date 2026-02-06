
import React, { useState, useEffect, useMemo } from 'react';
import { Navigation } from './components/Navigation';
import { ProjectDetail } from './components/ProjectDetail';
import { AboutOverlay } from './components/AboutOverlay';
import { AdminDashboard } from './components/AdminDashboard';
import { Project } from './types';

const DEFAULT_PROJECTS: Project[] = [
  {
    id: '1',
    title: 'STILLNESS IN MOTION',
    category: 'Motion Design',
    year: '2024',
    description: 'Une exploration de la fluidité temporelle à travers des paysages urbains capturés au ralenti.',
    coverImage: 'https://images.unsplash.com/photo-1492691523567-6119e281dfbb?q=80&w=2070&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1492691523567-6119e281dfbb?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1518131348530-97992994bb0f?q=80&w=2070&auto=format&fit=crop'
    ]
  },
  {
    id: '2',
    title: 'CONCRETE JUNGLE',
    category: 'Photography',
    year: '2023',
    description: 'La géométrie brutale des structures modernes face à la fragilité humaine.',
    coverImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop']
  },
  {
    id: '3',
    title: 'VESSEL OF LIGHT',
    category: 'Short Film',
    year: '2023',
    description: 'Documentaire expérimental sur les artisans verriers du nord de la France.',
    coverImage: 'https://images.unsplash.com/photo-1502134249126-9f3755a50d78?q=80&w=2070&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1502134249126-9f3755a50d78?q=80&w=2070&auto=format&fit=crop']
  }
];

const DEFAULT_VIDEO = "https://cdn.coverr.co/videos/coverr-walking-through-an-empty-underground-parking-lot-4536/1080p.mp4";

export default function App() {
  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const saved = localStorage.getItem('portfolio_projects');
      return saved ? JSON.parse(saved) : DEFAULT_PROJECTS;
    } catch { return DEFAULT_PROJECTS; }
  });

  const [bio, setBio] = useState(() => localStorage.getItem('portfolio_bio') || "Photographe et réalisateur basé à Paris. Explore les frontières entre la lumière et l'obscurité, le mouvement et l'immobilité.");
  const [showreelUrl, setShowreelUrl] = useState(() => localStorage.getItem('portfolio_showreel') || DEFAULT_VIDEO);
  const [currentView, setCurrentView] = useState<'home' | 'work'>('home');
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Immediate check for hash
    const checkHash = () => {
      const hash = window.location.hash;
      setIsAdmin(hash === '#admin');
    };
    checkHash();
    window.addEventListener('hashchange', checkHash);
    
    // Safety: ensure the app is visible
    const timer = setTimeout(() => setIsMounted(true), 50);
    
    return () => {
      window.removeEventListener('hashchange', checkHash);
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('portfolio_projects', JSON.stringify(projects));
      localStorage.setItem('portfolio_bio', bio);
      localStorage.setItem('portfolio_showreel', showreelUrl);
    } catch (e) { console.error("Persistence failed", e); }
  }, [projects, bio, showreelUrl]);

  if (isAdmin) {
    return (
      <AdminDashboard 
        projects={projects} setProjects={setProjects}
        bio={bio} setBio={setBio}
        showreelUrl={showreelUrl} setShowreelUrl={setShowreelUrl}
        onClose={() => { window.location.hash = ''; setIsAdmin(false); }}
      />
    );
  }

  return (
    <div className={`min-h-screen bg-black text-white selection:bg-white selection:text-black transition-opacity duration-1000 ${isMounted ? 'opacity-100' : 'opacity-0'}`}>
      <Navigation 
        title="MAXIME HUSSON" 
        onNavigate={setCurrentView} 
        currentView={currentView} 
        onOpenAbout={() => setIsAboutOpen(true)} 
      />

      <main className="relative">
        {currentView === 'home' ? (
          <div className="fixed inset-0 flex items-center justify-center overflow-hidden bg-black">
            <video 
              key={showreelUrl}
              src={showreelUrl} 
              autoPlay muted loop playsInline
              className="absolute inset-0 w-full h-full object-cover opacity-40 grayscale"
            />
            
            <div className="relative z-10 text-center animate-fade-in">
              <div className="mb-24 overflow-hidden">
                <h1 className="text-white text-4xl md:text-7xl lg:text-9xl font-extralight tracking-[0.3em] uppercase transition-all duration-1000">
                  Maxime Husson
                </h1>
                <p className="mt-6 text-white/40 text-[10px] md:text-[12px] uppercase tracking-[0.6em] font-light">
                  Visual Works & Motion Theory
                </p>
              </div>

              <button 
                onClick={() => setCurrentView('work')}
                className="group inline-flex flex-col items-center gap-6"
              >
                <span className="text-[10px] uppercase tracking-[0.4em] text-white/50 group-hover:text-white transition-all duration-500">
                  Index of work
                </span>
                <div className="w-[1px] h-12 bg-white/20 group-hover:h-24 group-hover:bg-white transition-all duration-1000 ease-out" />
              </button>
            </div>
          </div>
        ) : (
          <div className="pt-48 pb-32 px-6 md:px-12 lg:px-20 max-w-[2000px] mx-auto animate-fade-in">
            <div className="mb-20 pb-10 border-b border-white/5 flex justify-between items-end">
               <h2 className="text-[10px] uppercase tracking-[0.4em] text-white/30">Archive / 2020 — 2024</h2>
               <div className="text-[10px] uppercase tracking-[0.4em] text-white/30">Scroll to explore</div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-x-20 gap-y-32">
              {projects.map((project, idx) => (
                <div 
                  key={project.id} 
                  className={`group cursor-pointer ${idx % 2 !== 0 ? 'md:mt-48' : ''}`}
                  onClick={() => setSelectedProject(project)}
                >
                  <div className="relative overflow-hidden aspect-[16/11] bg-neutral-950">
                    <img 
                      src={project.coverImage} 
                      alt={project.title} 
                      className="w-full h-full object-cover grayscale opacity-70 group-hover:grayscale-0 group-hover:scale-105 group-hover:opacity-100 transition-all duration-[2s] ease-out" 
                    />
                    <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-1000" />
                  </div>
                  <div className="mt-10 flex justify-between items-start">
                    <div>
                      <h3 className="text-sm font-light tracking-[0.3em] uppercase mb-2">{project.title}</h3>
                      <p className="text-[9px] uppercase tracking-[0.2em] text-neutral-500 font-light">{project.category}</p>
                    </div>
                    <span className="text-[10px] text-neutral-600 font-light tracking-widest">{project.year}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {currentView === 'work' && (
        <footer className="px-6 md:px-20 py-24 mt-20 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-12 text-[9px] uppercase tracking-[0.4em] text-neutral-600">
          <div className="flex gap-16">
            <a href="#" className="hover:text-white transition-colors duration-500 underline-offset-8 hover:underline">Instagram</a>
            <a href="#" className="hover:text-white transition-colors duration-500 underline-offset-8 hover:underline">Vimeo</a>
            <a href="mailto:contact@maximehusson.com" className="hover:text-white transition-colors duration-500 underline-offset-8 hover:underline">Contact</a>
          </div>
          <div className="text-center md:text-right">
             <span>Paris — Based</span>
             <p className="mt-2 opacity-50">© 2024 — Maxime Husson</p>
          </div>
        </footer>
      )}

      <ProjectDetail project={selectedProject} onClose={() => setSelectedProject(null)} />
      <AboutOverlay isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} bio={bio} onUpdateBio={setBio} />
    </div>
  );
}
