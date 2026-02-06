import React, { useState, useRef } from 'react';
import { Project } from '../types';
import { X, Plus, Trash2, Edit2, LogOut, Home, FolderOpen, Loader2, Save } from 'lucide-react';

interface AdminDashboardProps {
  projects: Project[];
  setProjects: (projects: Project[]) => void;
  bio: string;
  setBio: (bio: string) => void;
  showreelUrl: string;
  setShowreelUrl: (url: string) => void;
  onClose: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ projects, setProjects, bio, setBio, showreelUrl, setShowreelUrl, onClose }) => {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [activeTab, setActiveTab] = useState<'home' | 'projects' | 'bio' | 'settings'>('home');
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const showreelInputRef = useRef<HTMLInputElement>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const stored = localStorage.getItem('portfolio_password') || 'Husson';
    if (password === stored) setIsAuthenticated(true);
    else alert('Code incorrect');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (base64: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) {
      alert("Fichier trop lourd (>8MB). Pour les vidéos, utilisez un lien URL.");
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      callback(reader.result as string);
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const saveProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;
    if (editingProject.id) {
      setProjects(projects.map(p => p.id === editingProject.id ? editingProject : p));
    } else {
      setProjects([{ ...editingProject, id: Date.now().toString() }, ...projects]);
    }
    setEditingProject(null);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6">
        <form onSubmit={handleLogin} className="w-full max-w-xs space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-xl tracking-[0.3em] font-light">HUSSON</h1>
            <p className="text-[9px] uppercase tracking-widest text-neutral-600">Private Access</p>
          </div>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-neutral-900 border border-neutral-800 p-4 rounded text-center tracking-[0.8em] focus:outline-none focus:border-neutral-600 transition-all"
            placeholder="••••"
            autoFocus
          />
          <button type="submit" className="w-full bg-white text-black py-4 rounded text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-neutral-200 transition-colors">Login</button>
          <button type="button" onClick={onClose} className="w-full text-neutral-600 text-[10px] uppercase tracking-widest hover:text-white">Cancel</button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans">
      <header className="border-b border-neutral-900 px-8 py-6 flex justify-between items-center sticky top-0 bg-[#050505]/90 backdrop-blur-sm z-50">
        <div className="flex items-center gap-12">
          <h1 className="text-sm font-bold tracking-[0.3em]">HUSSON PANEL</h1>
          <nav className="flex gap-8 text-[9px] uppercase tracking-[0.2em] font-medium text-neutral-500">
            <button onClick={() => setActiveTab('home')} className={activeTab === 'home' ? 'text-white' : ''}>Home</button>
            <button onClick={() => setActiveTab('projects')} className={activeTab === 'projects' ? 'text-white' : ''}>Work</button>
            <button onClick={() => setActiveTab('bio')} className={activeTab === 'bio' ? 'text-white' : ''}>About</button>
          </nav>
        </div>
        <button onClick={onClose} className="text-neutral-600 hover:text-white transition-colors uppercase tracking-widest text-[9px] flex items-center gap-2">
          <LogOut size={14} /> Close
        </button>
      </header>

      <main className="max-w-4xl mx-auto p-8 md:p-16">
        {activeTab === 'home' && (
          <div className="space-y-12 animate-fade-in">
            <div className="space-y-2">
              <h2 className="text-2xl font-light">Showreel Accueil</h2>
              <p className="text-xs text-neutral-500 uppercase tracking-widest">Vidéo principale en plein écran</p>
            </div>
            <div className="space-y-4">
              <div className="flex gap-3">
                <input type="text" value={showreelUrl} onChange={(e) => setShowreelUrl(e.target.value)} placeholder="URL de la vidéo..." className="flex-1 bg-neutral-900 border border-neutral-800 p-4 rounded outline-none text-xs" />
                <button onClick={() => showreelInputRef.current?.click()} className="bg-neutral-800 px-6 rounded hover:bg-neutral-700 transition-colors">
                  {isUploading ? <Loader2 className="animate-spin" size={18}/> : <FolderOpen size={18}/>}
                </button>
                <input type="file" ref={showreelInputRef} hidden accept="video/*" onChange={(e) => handleFileUpload(e, setShowreelUrl)} />
              </div>
              <div className="aspect-video bg-neutral-900 rounded overflow-hidden border border-neutral-800">
                <video src={showreelUrl} className="w-full h-full object-cover" autoPlay muted loop playsInline />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'projects' && (
          <div className="space-y-12 animate-fade-in">
            <div className="flex justify-between items-end">
              <div className="space-y-2">
                <h2 className="text-2xl font-light">Mes Projets</h2>
                <p className="text-xs text-neutral-500 uppercase tracking-widest">Gérez votre galerie de travaux</p>
              </div>
              <button 
                onClick={() => setEditingProject({id:'', title:'', category:'', year:'2024', description:'', coverImage:'', images:[]})}
                className="bg-white text-black px-6 py-2.5 rounded text-[10px] font-bold uppercase tracking-widest hover:bg-neutral-200"
              >
                + Nouveau
              </button>
            </div>

            <div className="grid gap-6">
              {projects.map(p => (
                <div key={p.id} className="bg-neutral-900/40 border border-neutral-900 p-4 rounded flex items-center justify-between group hover:border-neutral-700 transition-all">
                  <div className="flex items-center gap-6">
                    <img src={p.coverImage} className="w-20 h-14 object-cover rounded bg-neutral-800" />
                    <div>
                      <h3 className="font-medium text-sm tracking-tight uppercase">{p.title}</h3>
                      <p className="text-[9px] uppercase tracking-widest text-neutral-600 mt-1">{p.category} — {p.year}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setEditingProject(p)} className="p-3 text-neutral-600 hover:text-white transition-all"><Edit2 size={16}/></button>
                    <button onClick={() => confirm('Supprimer ?') && setProjects(projects.filter(x => x.id !== p.id))} className="p-3 text-neutral-600 hover:text-red-400 transition-all"><Trash2 size={16}/></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'bio' && (
          <div className="space-y-8 animate-fade-in">
            <h2 className="text-2xl font-light">Bio & Informations</h2>
            <textarea 
              value={bio} 
              onChange={(e) => setBio(e.target.value)} 
              className="w-full h-96 bg-neutral-900 border border-neutral-800 p-8 rounded text-neutral-300 outline-none focus:border-neutral-600 text-sm leading-relaxed" 
              placeholder="Rédigez votre biographie..." 
            />
          </div>
        )}
      </main>

      {/* MODAL EDITION PROJET */}
      {editingProject && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-6">
          <div className="bg-[#0c0c0c] w-full max-w-4xl max-h-[90vh] flex flex-col border border-neutral-800 rounded shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-neutral-800 flex justify-between items-center">
              <span className="text-[10px] font-bold uppercase tracking-widest">Éditeur de projet</span>
              <button onClick={() => setEditingProject(null)}><X size={20}/></button>
            </div>
            <form onSubmit={saveProject} className="flex-1 overflow-y-auto p-10 space-y-8">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="text-[9px] uppercase tracking-widest text-neutral-600">Titre</label>
                  <input type="text" value={editingProject.title} onChange={e => setEditingProject({...editingProject, title: e.target.value})} className="w-full bg-neutral-900 border border-neutral-800 p-3 rounded outline-none text-xs" required />
                </div>
                <div className="space-y-4">
                  <label className="text-[9px] uppercase tracking-widest text-neutral-600">Année</label>
                  <input type="text" value={editingProject.year} onChange={e => setEditingProject({...editingProject, year: e.target.value})} className="w-full bg-neutral-900 border border-neutral-800 p-3 rounded outline-none text-xs" required />
                </div>
              </div>
              <div className="space-y-4">
                <label className="text-[9px] uppercase tracking-widest text-neutral-600">Image de couverture</label>
                <div className="flex gap-2">
                  <input type="text" value={editingProject.coverImage} onChange={e => setEditingProject({...editingProject, coverImage: e.target.value})} className="flex-1 bg-neutral-900 border border-neutral-800 p-3 rounded outline-none text-[10px]" />
                  <button type="button" onClick={() => fileInputRef.current?.click()} className="bg-neutral-800 px-4 rounded hover:bg-neutral-700 transition-colors"><FolderOpen size={16}/></button>
                  <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={e => handleFileUpload(e, b => setEditingProject({...editingProject, coverImage: b}))} />
                </div>
              </div>
              <div className="space-y-4">
                <label className="text-[9px] uppercase tracking-widest text-neutral-600">Galerie (Images du projet)</label>
                <div className="space-y-3">
                  {editingProject.images.map((img, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <input type="text" value={img} onChange={e => {
                        const newImgs = [...editingProject.images];
                        newImgs[idx] = e.target.value;
                        setEditingProject({...editingProject, images: newImgs});
                      }} className="flex-1 bg-neutral-900 border border-neutral-800 p-2 rounded text-[10px]" />
                      <button type="button" onClick={() => setEditingProject({...editingProject, images: editingProject.images.filter((_, i) => i !== idx)})} className="text-neutral-600"><Trash2 size={14}/></button>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <button type="button" onClick={() => galleryInputRef.current?.click()} className="flex-1 border border-dashed border-neutral-800 p-3 rounded text-[9px] uppercase tracking-widest hover:border-neutral-600 transition-all flex items-center justify-center gap-2">
                      <FolderOpen size={14}/> Importer une image
                    </button>
                    <input type="file" ref={galleryInputRef} hidden accept="image/*" onChange={e => handleFileUpload(e, b => setEditingProject({...editingProject, images: [...editingProject.images, b]}))} />
                    <button type="button" onClick={() => setEditingProject({...editingProject, images: [...editingProject.images, '']})} className="bg-neutral-900 px-6 rounded text-[18px]">+</button>
                  </div>
                </div>
              </div>
              <button type="submit" className="w-full bg-white text-black py-5 rounded font-bold uppercase tracking-[0.3em] text-[10px] mt-8">Enregistrer le Projet</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};