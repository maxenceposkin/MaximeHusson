import React, { useState } from 'react';
import { Project } from '../types';
import { X, Plus, Trash2, Edit2, LogOut, Database, Cloud, CloudOff } from 'lucide-react';

interface AdminDashboardProps {
  projects: Project[];
  bio: string;
  showreelUrl: string;
  onUpdateAll: (projects: Project[], bio: string, showreel: string) => void;
  onClose: () => void;
  isFirebaseActive: boolean;
}

const EmptyProject: Project = {
  id: '',
  title: '',
  category: '',
  year: new Date().getFullYear().toString(),
  description: '',
  coverImage: '',
  images: []
};

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ projects, bio, showreelUrl, onUpdateAll, onClose, isFirebaseActive }) => {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [activeTab, setActiveTab] = useState<'home' | 'projects' | 'bio'>('home');
  const [localBio, setLocalBio] = useState(bio);
  const [localShowreel, setLocalShowreel] = useState(showreelUrl);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'Husson') {
      setIsAuthenticated(true);
    } else {
      alert('Code incorrect');
    }
  };

  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;
    let newProjects;
    if (editingProject.id) {
      newProjects = projects.map(p => p.id === editingProject.id ? editingProject : p);
    } else {
      const newProject = { ...editingProject, id: Date.now().toString() };
      newProjects = [newProject, ...projects];
    }
    onUpdateAll(newProjects, localBio, localShowreel);
    setEditingProject(null);
  };

  const handleDeleteProject = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
      onUpdateAll(projects.filter(p => p.id !== id), localBio, localShowreel);
    }
  };

  const updateEditingProject = (field: keyof Project, value: any) => {
    if (!editingProject) return;
    setEditingProject({ ...editingProject, [field]: value });
  };

  const handleSaveAll = () => {
    onUpdateAll(projects, localBio, localShowreel);
    alert('Modifications enregistrées !');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="w-full max-w-sm space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-light tracking-wide">HUSSON ADMIN</h1>
            <p className="text-sm text-neutral-500">Mot de passe par défaut : Husson</p>
          </div>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-neutral-900 border border-neutral-800 rounded p-3 text-center tracking-widest focus:outline-none focus:border-white transition-colors"
            placeholder="●●●●"
            autoFocus
          />
          <button type="submit" className="w-full bg-white text-black py-3 rounded font-medium text-xs uppercase tracking-widest hover:bg-neutral-200 transition-colors">
            Accéder
          </button>
          <button type="button" onClick={onClose} className="w-full text-neutral-500 text-xs hover:text-white transition-colors">
            Retour au site
          </button>
        </form>
      </div>
    );
  }

  if (editingProject) {
    return (
      <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-[#0a0a0a] w-full max-w-6xl max-h-[90vh] flex flex-col border border-neutral-800 rounded-lg shadow-2xl">
          <div className="flex justify-between items-center p-6 border-b border-neutral-800">
            <h2 className="text-lg font-medium text-white">{editingProject.id ? 'Modifier le projet' : 'Nouveau projet'}</h2>
            <button onClick={() => setEditingProject(null)} className="text-neutral-500 hover:text-white flex items-center gap-2 text-sm">
                <X size={18} />
                <span>Annuler</span>
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 md:p-8">
            <form id="projectForm" onSubmit={handleSaveProject} className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="space-y-6">
                    <h3 className="text-xs font-bold tracking-widest uppercase text-neutral-500 border-b border-neutral-800 pb-2">Informations</h3>
                    <div className="space-y-2">
                        <label className="text-xs uppercase tracking-wider text-neutral-500">Titre</label>
                        <input type="text" value={editingProject.title} onChange={(e) => updateEditingProject('title', e.target.value)} className="w-full bg-neutral-900 border border-neutral-800 p-3 rounded focus:border-white outline-none" required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-wider text-neutral-500">Année</label>
                            <input type="text" value={editingProject.year} onChange={(e) => updateEditingProject('year', e.target.value)} className="w-full bg-neutral-900 border border-neutral-800 p-3 rounded focus:border-white outline-none" required />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-wider text-neutral-500">Catégorie</label>
                            <input type="text" value={editingProject.category} onChange={(e) => updateEditingProject('category', e.target.value)} className="w-full bg-neutral-900 border border-neutral-800 p-3 rounded focus:border-white outline-none" required />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs uppercase tracking-wider text-neutral-500">Description</label>
                        <textarea value={editingProject.description} onChange={(e) => updateEditingProject('description', e.target.value)} className="w-full bg-neutral-900 border border-neutral-800 p-3 rounded focus:border-white outline-none h-40 resize-none" required />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs uppercase tracking-wider text-neutral-500">Image de couverture (URL)</label>
                        <input type="text" value={editingProject.coverImage} onChange={(e) => updateEditingProject('coverImage', e.target.value)} className="w-full bg-neutral-900 border border-neutral-800 p-3 rounded focus:border-white outline-none" required />
                    </div>
                </div>
                <div className="space-y-6">
                     <h3 className="text-xs font-bold tracking-widest uppercase text-neutral-500 border-b border-neutral-800 pb-2">Galerie (URLs séparées par des virgules)</h3>
                     <textarea 
                        value={editingProject.images.join(', ')} 
                        onChange={(e) => updateEditingProject('images', e.target.value.split(',').map(s => s.trim()))} 
                        className="w-full bg-neutral-900 border border-neutral-800 p-3 rounded focus:border-white outline-none h-64 resize-none text-sm font-mono"
                        placeholder="https://img1.jpg, https://img2.jpg..."
                    />
                </div>
            </form>
          </div>
          <div className="p-6 border-t border-neutral-800 bg-[#0a0a0a]">
             <button form="projectForm" type="submit" className="w-full bg-white text-black py-4 rounded font-medium hover:bg-neutral-200 transition-colors tracking-widest uppercase text-sm">
                Enregistrer le projet
              </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <nav className="border-b border-neutral-900 px-6 py-4 flex justify-between items-center sticky top-0 bg-[#050505] z-50">
        <div className="flex items-center gap-6">
          <h1 className="text-lg font-medium tracking-tight">HUSSON ADMIN</h1>
          <div className="flex gap-4 text-xs uppercase tracking-widest">
            <button onClick={() => setActiveTab('home')} className={`${activeTab === 'home' ? 'text-white' : 'text-neutral-500'} hover:text-white transition-colors`}>Showreel</button>
            <button onClick={() => setActiveTab('projects')} className={`${activeTab === 'projects' ? 'text-white' : 'text-neutral-500'} hover:text-white transition-colors`}>Projets</button>
            <button onClick={() => setActiveTab('bio')} className={`${activeTab === 'bio' ? 'text-white' : 'text-neutral-500'} hover:text-white transition-colors`}>Bio</button>
          </div>
        </div>
        <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800">
                {isFirebaseActive ? <Cloud size={12} className="text-green-500" /> : <CloudOff size={12} className="text-red-500" />}
                <span className="text-[10px] uppercase tracking-tighter text-neutral-400">
                    {isFirebaseActive ? "Sync ON" : "Local Mode"}
                </span>
             </div>
             <button onClick={onClose} className="flex items-center gap-2 text-xs uppercase tracking-widest text-neutral-500 hover:text-white transition-colors">
                <LogOut size={16} /><span>Quitter</span>
             </button>
        </div>
      </nav>

      <main className="max-w-screen-xl mx-auto p-6 md:p-10">
        {activeTab === 'home' && (
          <div className="max-w-2xl space-y-6">
             <h2 className="text-xl font-light">Vidéo Showreel</h2>
             <input type="text" value={localShowreel} onChange={(e) => setLocalShowreel(e.target.value)} className="w-full bg-neutral-900 border border-neutral-800 p-3 rounded focus:border-white outline-none" />
             {localShowreel && <video src={localShowreel} className="w-full aspect-video object-cover rounded border border-neutral-800" autoPlay muted loop playsInline />}
             <button onClick={handleSaveAll} className="bg-white text-black px-6 py-3 rounded text-xs font-bold uppercase tracking-widest hover:bg-neutral-200 transition-colors">Enregistrer</button>
          </div>
        )}

        {activeTab === 'projects' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-light">Projets ({projects.length})</h2>
              <button onClick={() => setEditingProject(EmptyProject)} className="bg-white text-black px-4 py-2 rounded text-xs font-bold uppercase tracking-widest hover:bg-neutral-200 transition-colors">Nouveau</button>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {projects.map((project) => (
                <div key={project.id} className="bg-[#0a0a0a] border border-neutral-900 p-3 rounded flex items-center justify-between group hover:border-neutral-700 transition-colors">
                  <div className="flex items-center gap-4">
                    <img src={project.coverImage} className="w-12 h-12 object-cover rounded bg-neutral-900" alt="" />
                    <div className="text-sm">
                      <h3 className="font-medium">{project.title}</h3>
                      <p className="text-neutral-500 text-xs">{project.category}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setEditingProject(project)} className="p-2 text-neutral-500 hover:text-white hover:bg-neutral-800 rounded transition-colors"><Edit2 size={16} /></button>
                    <button onClick={() => handleDeleteProject(project.id)} className="p-2 text-neutral-500 hover:text-red-400 hover:bg-neutral-800 rounded transition-colors"><Trash2 size={16} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {activeTab === 'bio' && (
          <div className="max-w-2xl space-y-6">
             <h2 className="text-xl font-light">Biographie</h2>
             <textarea value={localBio} onChange={(e) => setLocalBio(e.target.value)} className="w-full h-64 bg-[#0a0a0a] border border-neutral-800 p-4 rounded text-neutral-300 focus:border-white outline-none leading-relaxed" />
             <button onClick={handleSaveAll} className="bg-white text-black px-6 py-3 rounded text-xs font-bold uppercase tracking-widest hover:bg-neutral-200 transition-colors">Enregistrer</button>
          </div>
        )}
      </main>
    </div>
  );
};
