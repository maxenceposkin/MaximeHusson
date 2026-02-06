import React, { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { ProjectDetail } from './components/ProjectDetail';
import { AboutOverlay } from './components/AboutOverlay';
import { AdminDashboard } from './components/AdminDashboard';
import { Project } from './types';

// Default Data (Fallback)
const DEFAULT_PROJECTS: Project[] = [
  {
    id: '1',
    title: 'SILENCE URBAIN',
    category: 'Architecture',
    year: '2024',
    description: 'Une étude photographique sur les espaces liminaux de la banlieue parisienne. Le projet capture le silence assourdissant des structures de béton au petit matin.',
    coverImage: 'https://picsum.photos/600/800?random=1',
    images: ['https://picsum.photos/1200/800?random=11', 'https://picsum.photos/800/1200?random=12', 'https://picsum.photos/1200/800?random=13']
  },
  {
    id: '2',
    title: 'L\'HEURE BLEUE',
    category: 'Film Stills',
    year: '2023',
    description: 'Série de captures extraites d\'un court-métrage expérimental tourné en 16mm. Une exploration de la mélancolie à travers la couleur.',
    coverImage: 'https://picsum.photos/800/500?random=2',
    images: ['https://picsum.photos/1200/600?random=21', 'https://picsum.photos/1200/600?random=22']
  },
  {
    id: '3',
    title: 'PORTRAIT N°5',
    category: 'Editorial',
    year: '2024',
    description: 'Commande pour un magazine indépendant. Lumière naturelle uniquement, capturée dans un appartement haussmannien vide.',
    coverImage: 'https://picsum.photos/600/900?random=3',
    images: ['https://picsum.photos/800/1200?random=31', 'https://picsum.photos/800/1200?random=32']
  },
  {
    id: '4',
    title: 'MATIÈRE NOIRE',
    category: 'Abstract',
    year: '2022',
    description: 'Exploration texturale des roches volcaniques en Islande. Contraste extrême et grain prononcé.',
    coverImage: 'https://picsum.photos/700/700?random=4',
    images: ['https://picsum.photos/1000/1000?random=41', 'https://picsum.photos/1000/1000?random=42']
  },
  {
    id: '5',
    title: 'NEON DREAMS',
    category: 'Fashion',
    year: '2023',
    description: 'Campagne digitale pour une marque de streetwear tokyoïte. Prises de vue nocturnes.',
    coverImage: 'https://picsum.photos/600/800?random=5',
    images: ['https://picsum.photos/900/1200?random=51']
  },
  {
    id: '6',
    title: 'EAU VIVE',
    category: 'Landscape',
    year: '2024',
    description: 'Le mouvement perpétuel de l\'océan Atlantique. Pose longue et filtres ND.',
    coverImage: 'https://picsum.photos/800/600?random=6',
    images: ['https://picsum.photos/1200/800?random=61']
  },
  {
    id: '7',
    title: 'BÉTON BRUT',
    category: 'Architecture',
    year: '2021',
    description: 'Hommage au brutalisme.',
    coverImage: 'https://picsum.photos/600/800?random=7',
    images: ['https://picsum.photos/800/1000?random=71']
  },
  {
    id: '8',
    title: 'ABSTRACT MOTION',
    category: 'Experimental',
    year: '2023',
    description: 'Danse contemporaine et flou de bougé.',
    coverImage: 'https://picsum.photos/700/500?random=8',
    images: ['https://picsum.photos/1000/600?random=81']
  }
];

const DEFAULT_SHOWREEL = "https://cdn.coverr.co/videos/coverr-walking-through-an-empty-underground-parking-lot-4536/1080p.mp4";

export default function App() {
  // State Initialization from LocalStorage
  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('portfolio_projects');
    return saved ? JSON.parse(saved) : DEFAULT_PROJECTS;
  });
  
  const [bio, setBio] = useState<string>(() => {
    return localStorage.getItem('portfolio_bio') || "Basé à Paris, je capture l'éphémère à travers une lentille brute et honnête. Mon travail explore la relation entre l'humain et son environnement urbain.";
  });

  const [showreelUrl, setShowreelUrl] = useState<string>(() => {
      return localStorage.getItem('portfolio_showreel') || DEFAULT_SHOWREEL;
  });

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isAdminView, setIsAdminView] = useState(false);
  const [currentView, setCurrentView] = useState<'home' | 'work'>('home');
  const [mounted, setMounted] = useState(false);

  // Persistence Effects
  useEffect(() => {
    localStorage.setItem('portfolio_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('portfolio_bio', bio);
  }, [bio]);

  useEffect(() => {
    localStorage.setItem('portfolio_showreel', showreelUrl);
  }, [showreelUrl]);

  // Route Handling
  useEffect(() => {
    setMounted(true);
    
    const handleRoute = () => {
      // Check for /admin or #admin
      if (window.location.pathname === '/admin' || window.location.hash === '#admin') {
        setIsAdminView(true);
      } else {
        setIsAdminView(false);
      }
    };

    handleRoute();
    window.addEventListener('popstate', handleRoute);
    return () => window.removeEventListener('popstate', handleRoute);
  }, []);

  const handleCloseAdmin = () => {
      // Reset URL to root
      window.history.pushState(null, '', '/');
      setIsAdminView(false);
  };

  if (isAdminView) {
      return (
          <AdminDashboard 
            projects={projects}
            setProjects={setProjects}
            bio={bio}
            setBio={setBio}
            showreelUrl={showreelUrl}
            setShowreelUrl={setShowreelUrl}
            onClose={handleCloseAdmin}
          />
      );
  }

  return (
    <div className={`min-h-screen relative selection:bg-white selection:text-black bg-[#050505] text-[#e5e5e5] ${mounted ? 'opacity-100' : 'opacity-0'} transition-opacity duration-1000`}>
      <Navigation 
        title="HUSSON" 
        onNavigate={setCurrentView}
        currentView={currentView}
        onOpenAbout={() => setIsAboutOpen(true)} 
      />

      <main className="w-full h-full">
        
        {/* HOME VIEW: SHOWREEL */}
        {currentView === 'home' && (
            <div className="fixed inset-0 z-0 animate-[fadeIn_1s_ease-out]">
                <video 
                    key={showreelUrl} // Force reload if URL changes
                    src={showreelUrl} 
                    className="w-full h-full object-cover opacity-60" 
                    autoPlay 
                    muted 
                    loop 
                    playsInline 
                />
                <div 
                    className="absolute inset-0 flex items-center justify-center cursor-pointer"
                    onClick={() => setCurrentView('work')}
                >
                     <p className="text-xs uppercase tracking-[0.3em] text-white/50 hover:text-white transition-colors animate-pulse">Entrer</p>
                </div>
            </div>
        )}

        {/* WORK VIEW: GALLERY */}
        {currentView === 'work' && (
            <div className="pt-32 pb-20 px-4 md:px-6 max-w-[2000px] mx-auto animate-[fadeIn_0.5s_ease-out]">
                {/* Masonry Grid Layout using CSS Columns */}
                <div className="columns-1 md:columns-2 lg:columns-3 gap-4 md:gap-8 space-y-4 md:space-y-8">
                {projects.map((project) => (
                    <div 
                    key={project.id} 
                    className="break-inside-avoid group cursor-pointer"
                    onClick={() => setSelectedProject(project)}
                    >
                    <div className="relative overflow-hidden bg-neutral-900">
                        <img 
                        src={project.coverImage} 
                        alt={project.title}
                        className="w-full h-auto object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-105 opacity-90 group-hover:opacity-100"
                        loading="lazy"
                        />
                        
                        {/* Overlay on Hover */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500" />
                        
                        {/* Text Overlay (Minimal) */}
                        <div className="absolute bottom-0 left-0 w-full p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex justify-between items-end text-white mix-blend-difference">
                        <div>
                            <h3 className="text-lg font-medium leading-none">{project.title}</h3>
                            <p className="text-xs mt-2 font-light uppercase tracking-wider">{project.category}</p>
                        </div>
                        <span className="text-xs font-mono">{project.year}</span>
                        </div>
                    </div>
                    </div>
                ))}
                </div>
            </div>
        )}
      </main>

      {/* Footer only visible on Work view or pinned bottom on home? Let's hide on Home for cinematic look */}
      {currentView === 'work' && (
        <footer className="px-6 py-12 flex flex-col md:flex-row justify-between items-center text-xs uppercase tracking-widest text-neutral-500 border-t border-neutral-900 mt-20">
            <div className="flex gap-4 mb-4 md:mb-0">
                <a href="#" className="hover:text-white transition-colors">Instagram</a>
                <a href="#" className="hover:text-white transition-colors">Email</a>
            </div>
            <div className="flex flex-col items-center md:items-end gap-2">
                <span>© HUSSON {new Date().getFullYear()}</span>
                <div className="flex gap-4">
                    <span className="text-[10px] opacity-50">Paris, France</span>
                    <button onClick={() => { setIsAdminView(true); window.history.pushState(null, '', '#admin'); }} className="text-[10px] opacity-20 hover:opacity-100 transition-opacity">Admin</button>
                </div>
            </div>
        </footer>
      )}
      
      {/* Hidden admin trigger area for Home view if footer is hidden, or just keep footer? 
          Decision: Keep Footer hidden on Home for clean look, but add an invisible trigger area at bottom right or rely on /admin URL */}
      {currentView === 'home' && (
           <div className="fixed bottom-4 right-4 z-40">
                <button onClick={() => { setIsAdminView(true); window.history.pushState(null, '', '#admin'); }} className="text-[10px] text-white/10 hover:text-white/50 transition-colors uppercase tracking-widest">Admin</button>
           </div>
      )}

      <ProjectDetail 
        project={selectedProject} 
        onClose={() => setSelectedProject(null)} 
      />

      <AboutOverlay 
        isOpen={isAboutOpen} 
        onClose={() => setIsAboutOpen(false)} 
        bio={bio}
        onUpdateBio={setBio}
      />
    </div>
  );
}