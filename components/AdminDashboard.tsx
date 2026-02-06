
import React, { useState, useRef, useEffect } from 'react';
import { Project } from '../types';
import * as Lucide from 'lucide-react';

// Destructure icons safely
const { X, Plus, Trash2, Edit2, LogOut, Home, FolderOpen, Loader2, Save } = Lucide;

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
  const [activeTab, setActiveTab] = useState<'home' | 'projects' | 'bio'>('home');
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
      alert("Fichier trop lourd (>8MB). Pour les vidéos, préférez un lien URL.");
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
      <div className="min-h-screen bg-black flex items-center justify-center p-6 animate-fade-in">
        <form onSubmit={handleLogin} className="w-full max-w-xs space-y-12">
          <div className="text-center space-y-3">
            <h1 className="text-2xl tracking-[0.5em] font-light text-white uppercase">Husson</h1>
            <p className="text-[9px] uppercase tracking-[0.4em] text-neutral-600">Secure Access</p>
          </div>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-900 p-5 text-center tracking-[1em] focus:outline-none focus:border-white/20 transition-all text-white"
            placeholder="••••"
            autoFocus
          />
          <button type="submit" className="w-full bg-white text-black py-5 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-neutral-200 transition-colors">Authorize</button>
          <button type="button" onClick={onClose} className="w-full text-neutral-600 text-[10px] uppercase tracking-widest hover:text-white transition-colors">Cancel</button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black animate-fade-in">
      <header className="border-b border-white/5 px-8 py-8 flex justify-between items-center sticky top-0 bg-black/90 backdrop-blur-xl z-50">
        <div className="flex items-center gap-16">
          <h1 className="text-xs font-light tracking-[0.5em] uppercase">Control Panel</h1>
          <nav className="flex gap-10 text-[10px] uppercase tracking-[0.3em] font-light text-neutral-500">
            <button onClick={() => setActiveTab('home')} className={`transition-colors ${activeTab === 'home' ? 'text-white' : 'hover:text-white/60'}`}>Home</button>
            <button onClick={() => setActiveTab('projects')} className={`transition-colors ${activeTab === 'projects' ? 'text-white' : 'hover:text-white/60'}`}>Work</button>
            <button onClick={() => setActiveTab('bio')} className={`transition-colors ${activeTab === 'bio' ? 'text-white' : 'hover:text-white/60'}`}>Bio</button>
          </nav>
        </div>
        <button onClick={onClose} className="text-neutral-500 hover:text-white transition-colors uppercase tracking-[0.3em] text-[9px] flex items-center gap-3">
           Sign Out
        </button>
      </header>

      <main className="max-w-5xl mx-auto p-12 md:p-24">
        {activeTab === 'home' && (
          <div className="space-y-16">
            <div className="space-y-4">
              <h2 className="text-3xl font-light tracking-tight">Main Showreel</h2>
              <p className="text-[10px] text-neutral-500 uppercase tracking-widest">Le visuel d'accueil de votre portfolio</p>
            </div>
            <div className="space-y-6">
              <div className="flex gap-4">
                <input type="text" value={showreelUrl} onChange={(e) => setShowreelUrl(e.target.value)} placeholder="Video URL..." className="flex-1 bg-neutral-950 border border-neutral-900 p-5 rounded outline-none text-[11px] tracking-wide" />
                <button onClick={() => showreelInputRef.current?.click()} className="bg-neutral-900 px-8 hover:bg-neutral-800 transition-colors">
                  {isUploading ? <Loader2 className="animate-spin" size={18}/> : <FolderOpen size={18}/>}
                </button>
                <input type="file" ref={showreelInputRef} hidden accept="video/*" onChange={(e) => handleFileUpload(e, setShowreelUrl)} />
              </div>
              <div className="aspect-video bg-neutral-950 border border-white/5 overflow-hidden">
                <video src={showreelUrl} className="w-full h-full object-cover opacity-50" autoPlay muted loop playsInline />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'projects' && (
          <div className="space-y-16">
            <div className="flex justify-between items-end">
              <div className="space-y-4">
                <h2 className="text-3xl font-light tracking-tight">Archives</h2>
                <p className="text-[10px] text-neutral-500 uppercase tracking-widest">Gestion des projets sélectionnés</p>
              </div>
              <button 
                onClick={() => setEditingProject({id:'', title:'', category:'', year:'2024', description:'', coverImage:'', images:[]})}
                className="bg-white text-black px-10 py-3 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-neutral-200"
              >
                + New Entry
              </button>
            </div>

            <div className="grid gap-4">
              {projects.map(p => (
                <div key={p.id} className="bg-neutral-950/40 border border-white/5 p-6 flex items-center justify-between group hover:border-white/10 transition-all">
                  <div className="flex items-center gap-8">
                    <img src={p.coverImage} className="w-24 h-16 object-cover grayscale opacity-50 group-hover:opacity-100 transition-opacity bg-neutral-900" />
                    <div>
                      <h3 className="font-light text-sm tracking-[0.2em] uppercase">{p.title}</h3>
                      <p className="text-[9px] uppercase tracking-[0.2em] text-neutral-600 mt-2">{p.category} — {p.year}</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <button onClick={() => setEditingProject(p)} className="p-4 text-neutral-700 hover:text-white transition-all"><Edit2 size={16}/></button>
                    <button onClick={() => confirm('Delete project?') && setProjects(projects.filter(x => x.id !== p.id))} className="p-4 text-neutral-700 hover:text-red-400 transition-all"><Trash2 size={16}/></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'bio' && (
          <div className="space-y-12">
            <div className="space-y-4">
              <h2 className="text-3xl font-light tracking-tight">Biography</h2>
              <p className="text-[10px] text-neutral-500 uppercase tracking-widest">Votre manifeste artistique</p>
            </div>
            <textarea 
              value={bio} 
              onChange={(e) => setBio(e.target.value)} 
              className="w-full h-96 bg-neutral-950 border border-white/5 p-10 text-neutral-300 outline-none focus:border-white/10 text-sm leading-relaxed tracking-wide" 
              placeholder="Écrivez ici..." 
            />
          </div>
        )}
      </main>

      {editingProject && (
        <div className="fixed inset-0 z-[100] bg-black/98 flex items-center justify-center p-6 backdrop-blur-md">
          <div className="bg-black w-full max-w-4xl max-h-[90vh] flex flex-col border border-white/10 shadow-2xl overflow-hidden">
            <div className="p-8 border-b border-white/5 flex justify-between items-center">
              <span className="text-[10px] font-bold uppercase tracking-[0.4em]">Project Editor</span>
              <button onClick={() => setEditingProject(null)} className="hover:rotate-90 transition-transform"><X size={24} strokeWidth={1}/></button>
            </div>
            <form onSubmit={saveProject} className="flex-1 overflow-y-auto p-12 space-y-10">
              <div className="grid grid-cols-2 gap-12">
                <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-[0.3em] text-neutral-600">Project Title</label>
                  <input type="text" value={editingProject.title} onChange={e => setEditingProject({...editingProject, title: e.target.value})} className="w-full bg-neutral-950 border border-white/5 p-4 outline-none text-[11px] tracking-widest uppercase" required />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-[0.3em] text-neutral-600">Year</label>
                  <input type="text" value={editingProject.year} onChange={e => setEditingProject({...editingProject, year: e.target.value})} className="w-full bg-neutral-950 border border-white/5 p-4 outline-none text-[11px]" required />
                </div>
              </div>
              
              <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-[0.3em] text-neutral-600">Cover Image URL</label>
                <div className="flex gap-4">
                  <input type="text" value={editingProject.coverImage} onChange={e => setEditingProject({...editingProject, coverImage: e.target.value})} className="flex-1 bg-neutral-950 border border-white/5 p-4 outline-none text-[10px]" />
                  <button type="button" onClick={() => fileInputRef.current?.click()} className="bg-neutral-900 px-6 hover:bg-neutral-800 transition-colors"><FolderOpen size={18}/></button>
                  <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={e => handleFileUpload(e, b => setEditingProject({...editingProject, coverImage: b}))} />
                </div>
              </div>

              <div className="space-y-6">
                <label className="text-[10px] uppercase tracking-[0.3em] text-neutral-600">Gallery Assets</label>
                <div className="grid grid-cols-1 gap-4">
                  {editingProject.images.map((img, idx) => (
                    <div key={idx} className="flex gap-4 items-center">
                      <input type="text" value={img} onChange={e => {
                        const newImgs = [...editingProject.images];
                        newImgs[idx] = e.target.value;
                        setEditingProject({...editingProject, images: newImgs});
                      }} className="flex-1 bg-neutral-950 border border-white/5 p-3 text-[10px]" />
                      <button type="button" onClick={() => setEditingProject({...editingProject, images: editingProject.images.filter((_, i) => i !== idx)})} className="text-neutral-700 hover:text-red-400"><Trash2 size={16}/></button>
                    </div>
                  ))}
                  <div className="flex gap-4 mt-4">
                    <button type="button" onClick={() => galleryInputRef.current?.click()} className="flex-1 border border-dashed border-white/10 p-4 text-[10px] uppercase tracking-[0.3em] hover:bg-white/5 transition-all flex items-center justify-center gap-3">
                      Add from library
                    </button>
                    <input type="file" ref={galleryInputRef} hidden accept="image/*" onChange={e => handleFileUpload(e, b => setEditingProject({...editingProject, images: [...editingProject.images, b]}))} />
                    <button type="button" onClick={() => setEditingProject({...editingProject, images: [...editingProject.images, '']})} className="bg-neutral-900 px-10 text-xl font-light">+</button>
                  </div>
                </div>
              </div>
              <button type="submit" className="w-full bg-white text-black py-6 font-bold uppercase tracking-[0.4em] text-[10px] mt-12 hover:bg-neutral-200 transition-colors">Confirm Project</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
