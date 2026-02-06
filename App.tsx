import React, { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { ProjectDetail } from './components/ProjectDetail';
import { AboutOverlay } from './components/AboutOverlay';
import { AdminDashboard } from './components/AdminDashboard';
import { Project } from './types';
import { initializeApp } from "firebase/app";
import { getFirestore, doc, onSnapshot, setDoc } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCdd1zhByS1MQaO1KegHktgFOIAaeRkXNw",
  authDomain: "maxime-husson.firebaseapp.com",
  projectId: "maxime-husson",
  storageBucket: "maxime-husson.firebasestorage.app",
  messagingSenderId: "71281311981",
  appId: "1:71281311981:web:89d60fcd962b16883d8ce4"
};

// Initialisation (seulement si les clés sont remplies)
const isFirebaseSetup = firebaseConfig.apiKey !== "VOTRE_API_KEY";
const app = isFirebaseSetup ? initializeApp(firebaseConfig) : null;
const db = app ? getFirestore(app) : null;

const DEFAULT_PROJECTS: Project[] = [
  {
    id: '1',
    title: 'SILENCE URBAIN',
    category: 'Architecture',
    year: '2024',
    description: 'Une étude photographique sur les espaces liminaux de la banlieue parisienne.',
    coverImage: 'https://picsum.photos/600/800?random=1',
    images: ['https://picsum.photos/1200/800?random=11']
  }
];

const DEFAULT_BIO = "Basé à Paris, je capture l'éphémère à travers une lentille brute et honnête.";
const DEFAULT_SHOWREEL = "https://cdn.coverr.co/videos/coverr-walking-through-an-empty-underground-parking-lot-4536/1080p.mp4";

export default function App() {
  const [projects, setProjects] = useState<Project[]>(DEFAULT_PROJECTS);
  const [bio, setBio] = useState<string>(DEFAULT_BIO);
  const [showreelUrl, setShowreelUrl] = useState<string>(DEFAULT_SHOWREEL);
  const [loading, setLoading] = useState(isFirebaseSetup);

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isAdminView, setIsAdminView] = useState(false);
  const [currentView, setCurrentView] = useState<'home' | 'work'>('home');
  const [mounted, setMounted] = useState(false);

  // Ecoute en temps réel de la base de données
  useEffect(() => {
    setMounted(true);
    
    if (db) {
      const unsub = onSnapshot(doc(db, "portfolio", "data"), (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.projects) setProjects(data.projects);
          if (data.bio) setBio(data.bio);
          if (data.showreelUrl) setShowreelUrl(data.showreelUrl);
        }
        setLoading(false);
      }, (error) => {
        console.error("Erreur Firestore:", error);
        setLoading(false);
      });
      return () => unsub();
    } else {
        // Fallback local si pas de Firebase
        const savedProjects = localStorage.getItem('portfolio_projects');
        const savedBio = localStorage.getItem('portfolio_bio');
        const savedShowreel = localStorage.getItem('portfolio_showreel');
        if (savedProjects) setProjects(JSON.parse(savedProjects));
        if (savedBio) setBio(savedBio);
        if (savedShowreel) setShowreelUrl(savedShowreel);
    }
  }, []);

  const handleUpdateData = async (newProjects: Project[], newBio: string, newShowreel: string) => {
    setProjects(newProjects);
    setBio(newBio);
    setShowreelUrl(newShowreel);

    // Sauvegarde permanente dans le cloud
    if (db) {
      try {
        await setDoc(doc(db, "portfolio", "data"), {
          projects: newProjects,
          bio: newBio,
          showreelUrl: newShowreel,
          lastUpdate: new Date()
        });
      } catch (e) {
        console.error("Erreur lors de la sauvegarde cloud:", e);
      }
    } else {
        // Fallback local
        localStorage.setItem('portfolio_projects', JSON.stringify(newProjects));
        localStorage.setItem('portfolio_bio', newBio);
        localStorage.setItem('portfolio_showreel', newShowreel);
    }
  };

  useEffect(() => {
    const handleRoute = () => {
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

  if (loading) {
    return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-xs uppercase tracking-[0.3em] text-white/20 animate-pulse">Chargement...</div>;
  }

  if (isAdminView) {
      return (
          <AdminDashboard 
            projects={projects}
            bio={bio}
            showreelUrl={showreelUrl}
            onUpdateAll={handleUpdateData}
            onClose={() => { window.history.pushState(null, '', '/'); setIsAdminView(false); }}
            isFirebaseActive={isFirebaseSetup}
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
        {currentView === 'home' && (
            <div className="fixed inset-0 z-0 animate-[fadeIn_1s_ease-out]">
                <video 
                    key={showreelUrl}
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

        {currentView === 'work' && (
            <div className="pt-32 pb-20 px-4 md:px-6 max-w-[2000px] mx-auto animate-[fadeIn_0.5s_ease-out]">
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
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500" />
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
        onUpdateBio={(newBio) => handleUpdateData(projects, newBio, showreelUrl)}
      />
    </div>
  );
}
