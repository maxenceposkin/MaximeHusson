import React, { useState } from 'react';
import { Project } from '../types';
import { X, Plus, Trash2, Edit2, LogOut, Home, Send, Database, Cloud, CloudOff } from 'lucide-react';

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
  const [activeTab, setActiveTab] = useState<'home' | 'projects' | 'bio' | 'setup'>('home');
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
    if (confirm('Supprimer ce projet ?')) {
      onUpdateAll(projects.filter(p => p.id !== id), localBio, localShowreel);
    }
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
            className="w-full bg-neutral-900 border border-neutral-800 rounded p-3 text-center tracking-widest focus:outline-none focus:border-white"
            placeholder="●●●●"
          />
          <button type="submit" className="w-full bg-white text-black py-3 rounded font-medium text-xs uppercase tracking-widest hover:bg-neutral-200 transition-colors">
            Accéder
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <nav className="border-b border-neutral-900 px-6 py-4 flex justify-between items-center sticky top-0 bg-[#050505] z-50">
        <div className="flex items-center gap-6">
          <h1 className="text-lg font-medium tracking-tight">ADMIN</h1>
          <div className="flex gap-4 text-xs uppercase tracking-widest">
            <button onClick={() => setActiveTab('home')} className={`${activeTab === 'home' ? 'text-white' : 'text-neutral-500'}`}>Showreel</button>
            <button onClick={() => setActiveTab('projects')} className={`${activeTab === 'projects' ? 'text-white' : 'text-neutral-500'}`}>Projets</button>
            <button onClick={() => setActiveTab('bio')} className={`${activeTab === 'bio' ? 'text-white' : 'text-neutral-500'}`}>Bio</button>
            <button onClick={() => setActiveTab('setup')} className={`${activeTab === 'setup' ? 'text-blue-400' : 'text-neutral-500'} flex items-center gap-1`}>
                <Database size={12} /> Cloud
            </button>
          </div>
        </div>
        <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800">
                {isFirebaseActive ? <Cloud size={12} className="text-green-500" /> : <CloudOff size={12} className="text-red-500" />}
                <span className="text-[10px] uppercase tracking-tighter text-neutral-400">
                    {isFirebaseActive ? "Cloud Synchronisé" : "Mode Local"}
                </span>
             </div>
             <button onClick={onClose} className="text-neutral-500 hover:text-white"><LogOut size={18} /></button>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto p-10 space-y-12">
        {activeTab === 'home' && (
          <div className="space-y-6">
             <h2 className="text-xl font-light uppercase tracking-widest">Vidéo Showreel</h2>
             <div className="space-y-4">
                <input 
                    type="text" 
                    value={localShowreel} 
                    onChange={(e) => setLocalShowreel(e.target.value)} 
                    placeholder="URL de la vidéo MP4"
                    className="w-full bg-neutral-900 border border-neutral-800 p-4 rounded focus:border-white outline-none" 
                />
                <button 
                    onClick={() => onUpdateAll(projects, localBio, localShowreel)}
                    className="bg-white text-black px-6 py-2 rounded text-[10px] font-bold uppercase tracking-widest"
                >
                    Enregistrer pour tous
                </button>
             </div>
          </div>
        )}

        {activeTab === 'projects' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-light uppercase tracking-widest">Projets ({projects.length})</h2>
              <button onClick={() => setEditingProject(EmptyProject)} className="bg-white text-black px-4 py-2 rounded text-[10px] font-bold uppercase tracking-widest">Ajouter</button>
            </div>
            <div className="grid gap-2">
              {projects.map((p) => (
                <div key={p.id} className="flex items-center justify-between p-4 bg-neutral-900/50 rounded border border-neutral-800">
                  <span className="text-sm font-light">{p.title}</span>
                  <div className="flex gap-4">
                    <button onClick={() => setEditingProject(p)} className="text-neutral-500 hover:text-white"><Edit2 size={16} /></button>
                    <button onClick={() => handleDeleteProject(p.id)} className="text-neutral-500 hover:text-red-500"><Trash2 size={16} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'bio' && (
          <div className="space-y-6">
             <h2 className="text-xl font-light uppercase tracking-widest">Biographie</h2>
             <textarea 
                value={localBio} 
                onChange={(e) => setLocalBio(e.target.value)} 
                className="w-full h-64 bg-neutral-900 border border-neutral-800 p-6 rounded text-neutral-400 focus:border-white outline-none leading-relaxed" 
             />
             <button 
                onClick={() => onUpdateAll(projects, localBio, localShowreel)}
                className="bg-white text-black px-6 py-2 rounded text-[10px] font-bold uppercase tracking-widest"
             >
                Enregistrer pour tous
            </button>
          </div>
        )}

        {activeTab === 'setup' && (
            <div className="bg-neutral-900/50 border border-neutral-800 p-8 rounded-lg space-y-6">
                <h2 className="text-xl font-light">Activation du Cloud</h2>
                <div className="space-y-4 text-sm text-neutral-400 leading-relaxed">
                    <p>Actuellement, vos changements sont <strong>{isFirebaseActive ? "synchronisés avec Firebase" : "sauvegardés localement"}</strong>.</p>
                    <p>Pour que tout le monde voie vos changements :</p>
                    <ol className="list-decimal ml-6 space-y-2">
                        <li>Créez un compte sur <a href="https://firebase.google.com" className="text-blue-400 underline" target="_blank">Firebase Console</a>.</li>
                        <li>Créez un projet "Portfolio".</li>
                        <li>Activez <strong>Firestore Database</strong>.</li>
                        <li>Ajoutez une "Web App" pour obtenir vos clés de configuration.</li>
                        <li>Copiez ces clés dans le fichier <code>App.tsx</code> de votre projet.</li>
                    </ol>
                </div>
            </div>
        )}
      </main>

      {editingProject && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-6">
            <div className="bg-[#0a0a0a] w-full max-w-2xl border border-neutral-800 rounded p-8 space-y-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-light">{editingProject.id ? 'Modifier' : 'Nouveau Projet'}</h3>
                    <button onClick={() => setEditingProject(null)}><X /></button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <input placeholder="Titre" value={editingProject.title} onChange={e => setEditingProject({...editingProject, title: e.target.value})} className="bg-neutral-900 border border-neutral-800 p-3 rounded" />
                    <input placeholder="Année" value={editingProject.year} onChange={e => setEditingProject({...editingProject, year: e.target.value})} className="bg-neutral-900 border border-neutral-800 p-3 rounded" />
                    <input placeholder="Catégorie" value={editingProject.category} onChange={e => setEditingProject({...editingProject, category: e.target.value})} className="bg-neutral-900 border border-neutral-800 p-3 rounded" />
                    <input placeholder="Image Couverture (URL)" value={editingProject.coverImage} onChange={e => setEditingProject({...editingProject, coverImage: e.target.value})} className="bg-neutral-900 border border-neutral-800 p-3 rounded" />
                </div>
                <textarea placeholder="Description" value={editingProject.description} onChange={e => setEditingProject({...editingProject, description: e.target.value})} className="w-full bg-neutral-900 border border-neutral-800 p-3 rounded h-24" />
                <textarea 
                    placeholder="Images de la galerie (une URL par ligne)" 
                    value={editingProject.images.join('\n')} 
                    onChange={e => setEditingProject({...editingProject, images: e.target.value.split('\n').filter(s => s.trim())})} 
                    className="w-full bg-neutral-900 border border-neutral-800 p-3 rounded h-32 font-mono text-xs" 
                />
                <button onClick={handleSaveProject} className="w-full bg-white text-black py-4 rounded text-xs font-bold uppercase tracking-widest">Enregistrer le projet</button>
            </div>
        </div>
      )}
    </div>
  );
};
