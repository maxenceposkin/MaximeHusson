import React, { useState, useRef } from 'react';
import { Project } from '../types';
import { X, Plus, Trash2, Edit2, LogOut, Home, FolderOpen, Loader2, Check } from 'lucide-react';

interface AdminDashboardProps {
  projects: Project[];
  setProjects: (projects: Project[]) => void;
  bio: string;
  setBio: (bio: string) => void;
  showreelUrl: string;
  setShowreelUrl: (url: string) => void;
  onClose: () => void;
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

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ projects, setProjects, bio, setBio, showreelUrl, setShowreelUrl, onClose }) => {
  const [password, setPassword] = useState('');
  const [storedPassword] = useState(() => localStorage.getItem('portfolio_password') || 'Husson');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [activeTab, setActiveTab] = useState<'home' | 'projects' | 'bio' | 'settings'>('home');
  const [newPassword, setNewPassword] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const showreelInputRef = useRef<HTMLInputElement>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === storedPassword) {
      setIsAuthenticated(true);
    } else {
      alert('Code de sécurité incorrect.');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (base64: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
        alert("Fichier trop lourd (max 5MB). Pour les vidéos lourdes, privilégiez un lien URL.");
    }

    setIsUploading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      callback(reader.result as string);
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;
    if (editingProject.id) {
      setProjects(projects.map(p => p.id === editingProject.id ? editingProject : p));
    } else {
      const newProject = { ...editingProject, id: Date.now().toString() };
      setProjects([newProject, ...projects]);
    }
    setEditingProject(null);
  };

  const updateEditingProject = (field: keyof Project, value: any) => {
    if (!editingProject) return;
    setEditingProject({ ...editingProject, [field]: value });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="w-full max-w-sm space-y-6 animate-[fadeIn_0.5s_ease-out]">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-light tracking-[0.2em]">HUSSON ADMIN</h1>
            <p className="text-[10px] uppercase tracking-widest text-neutral-500">Authentification requise</p>
          </div>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-neutral-900 border border-neutral-800 rounded p-4 text-center tracking-[0.5em] focus:outline-none focus:border-white transition-colors"
            placeholder="••••"
            autoFocus
          />
          <button type="submit" className="w-full bg-white text-black py-4 rounded font-medium text-[10px] uppercase tracking-[0.2em] hover:bg-neutral-200 transition-colors">
            Accéder au Panel
          </button>
          <button type="button" onClick={onClose} className="w-full text-neutral-600 text-[10px] uppercase tracking-widest hover:text-white transition-colors">
            Retour
          </button>
        </form>
      </div>
    );
  }

  if (editingProject) {
    return (
      <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4">
        <div className="bg-[#0a0a0a] w-full max-w-5xl max-h-[95vh] flex flex-col border border-neutral-800 rounded shadow-2xl overflow-hidden">
          <div className="flex justify-between items-center p-6 border-b border-neutral-800 bg-[#0c0c0c]">
            <h2 className="text-sm uppercase tracking-widest font-medium text-white">{editingProject.id ? 'Éditer' : 'Nouveau Projet'}</h2>
            <button onClick={() => setEditingProject(null)} className="text-neutral-500 hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-8">
            <form id="projectForm" onSubmit={handleSaveProject} className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-neutral-500">Titre du projet</label>
                        <input type="text" value={editingProject.title} onChange={(e) => updateEditingProject('title', e.target.value)} className="w-full bg-neutral-900 border border-neutral-800 p-3 rounded outline-none focus:border-neutral-600" required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest text-neutral-500">Année</label>
                            <input type="text" value={editingProject.year} onChange={(e) => updateEditingProject('year', e.target.value)} className="w-full bg-neutral-900 border border-neutral-800 p-3 rounded outline-none" required />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest text-neutral-500">Catégorie</label>
                            <input type="text" value={editingProject.category} onChange={(e) => updateEditingProject('category', e.target.value)} className="w-full bg-neutral-900 border border-neutral-800 p-3 rounded outline-none" required />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-neutral-500">Description</label>
                        <textarea value={editingProject.description} onChange={(e) => updateEditingProject('description', e.target.value)} className="w-full bg-neutral-900 border border-neutral-800 p-3 rounded outline-none h-32 resize-none" required />
                    </div>
                    
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-neutral-500">Image de couverture</label>
                        <div className="flex gap-2">
                            <input type="text" value={editingProject.coverImage} onChange={(e) => updateEditingProject('coverImage', e.target.value)} className="flex-1 bg-neutral-900 border border-neutral-800 p-3 rounded outline-none text-xs" placeholder="URL ou importer..." />
                            <button type="button" onClick={() => fileInputRef.current?.click()} className="bg-neutral-800 p-3 rounded hover:bg-neutral-700 transition-colors"><FolderOpen size={18}/></button>
                            <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={(e) => handleFileUpload(e, (base64) => updateEditingProject('coverImage', base64))} />
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="flex justify-between items-center border-b border-neutral-800 pb-2">
                        <h3 className="text-[10px] font-bold tracking-widest uppercase text-neutral-500">Galerie</h3>
                        <div className="flex gap-2">
                             <button type="button" onClick={() => galleryInputRef.current?.click()} className="text-[9px] flex items-center gap-1 bg-neutral-800 text-white px-3 py-1.5 rounded hover:bg-neutral-700 uppercase tracking-widest">
                                <FolderOpen size={12} /> Importer
                            </button>
                            <button type="button" onClick={() => updateEditingProject('images', [...editingProject.images, ''])} className="text-[9px] flex items-center gap-1 bg-white text-black px-3 py-1.5 rounded hover:bg-neutral-200 uppercase tracking-widest font-bold">
                                <Plus size={12} /> URL
                            </button>
                            <input type="file" ref={galleryInputRef} hidden accept="image/*" onChange={(e) => handleFileUpload(e, (base64) => updateEditingProject('images', [...editingProject.images, base64]))} />
                        </div>
                    </div>
                    <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                        {editingProject.images.map((img, idx) => (
                            <div key={idx} className="flex gap-3 items-center bg-neutral-900/50 p-2 border border-neutral-800 rounded">
                                <img src={img || 'https://placehold.co/100x100/111/444?text=IMAGE'} className="w-12 h-12 object-cover rounded" />
                                <input type="text" value={img} onChange={(e) => {
                                    const newImgs = [...editingProject.images];
                                    newImgs[idx] = e.target.value;
                                    updateEditingProject('images', newImgs);
                                }} className="flex-1 bg-transparent border-none outline-none text-[10px] text-neutral-400" />
                                <button type="button" onClick={() => updateEditingProject('images', editingProject.images.filter((_, i) => i !== idx))} className="text-neutral-600 hover:text-red-500 transition-colors"><Trash2 size={16}/></button>
                            </div>
                        ))}
                    </div>
                </div>
            </form>
          </div>
          <div className="p-6 border-t border-neutral-800 bg-[#0c0c0c]">
             <button form="projectForm" type="submit" className="w-full bg-white text-black py-4 rounded font-bold tracking-[0.3em] uppercase text-[10px] hover:bg-neutral-200 transition-colors">
                Enregistrer le Projet
             </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <nav className="border-b border-neutral-900 px-8 py-6 flex justify-between items-center sticky top-0 bg-[#050505]/80 backdrop-blur-md z-50">
        <div className="flex items-center gap-10">
          <h1 className="text-lg font-medium tracking-[0.2em]">HUSSON PANEL</h1>
          <div className="flex gap-6 text-[10px] uppercase tracking-[0.2em] font-medium">
            <button onClick={() => setActiveTab('home')} className={`${activeTab === 'home' ? 'text-white' : 'text-neutral-500'} hover:text-white transition-colors`}>Accueil</button>
            <button onClick={() => setActiveTab('projects')} className={`${activeTab === 'projects' ? 'text-white' : 'text-neutral-500'} hover:text-white transition-colors`}>Projets</button>
            <button onClick={() => setActiveTab('bio')} className={`${activeTab === 'bio' ? 'text-white' : 'text-neutral-500'} hover:text-white transition-colors`}>Biographie</button>
            <button onClick={() => setActiveTab('settings')} className={`${activeTab === 'settings' ? 'text-white' : 'text-neutral-500'} hover:text-white transition-colors`}>Réglages</button>
          </div>
        </div>
        <button onClick={onClose} className="text-neutral-500 hover:text-white flex items-center gap-2 text-[10px] uppercase tracking-widest"><LogOut size={14}/> Quitter</button>
      </nav>

      <main className="max-w-screen-xl mx-auto p-8 md:p-12">
        {activeTab === 'home' && (
          <div className="max-w-2xl space-y-8 animate-[fadeIn_0.5s_ease-out]">
             <div>
                <h2 className="text-xl font-light mb-2">Showreel Accueil</h2>
                <p className="text-xs text-neutral-500">Vidéo plein écran qui s'affiche sur la page de garde.</p>
             </div>
             <div className="space-y-4">
                <div className="flex gap-2">
                    <input type="text" value={showreelUrl} onChange={(e) => setShowreelUrl(e.target.value)} placeholder="Lien direct .mp4..." className="flex-1 bg-neutral-900 border border-neutral-800 p-4 rounded outline-none focus:border-neutral-600" />
                    <button onClick={() => showreelInputRef.current?.click()} className="bg-neutral-800 px-4 rounded hover:bg-neutral-700 transition-colors">
                        {isUploading ? <Loader2 size={18} className="animate-spin" /> : <FolderOpen size={18}/>}
                    </button>
                    <input type="file" ref={showreelInputRef} hidden accept="video/*" onChange={(e) => handleFileUpload(e, setShowreelUrl)} />
                </div>
                {showreelUrl && (
                    <div className="aspect-video bg-black rounded overflow-hidden border border-neutral-800 shadow-xl">
                        <video src={showreelUrl} className="w-full h-full object-cover" autoPlay muted loop playsInline />
                    </div>
                )}
             </div>
          </div>
        )}

        {activeTab === 'projects' && (
            <div className="space-y-8 animate-[fadeIn_0.5s_ease-out]">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-light">Mes Projets <span className="text-neutral-600 text-sm ml-2">({projects.length})</span></h2>
                    <button onClick={() => setEditingProject(EmptyProject)} className="bg-white text-black px-6 py-2.5 rounded text-[10px] font-bold uppercase tracking-widest hover:bg-neutral-200 flex items-center gap-2 shadow-lg"><Plus size={16}/> Nouveau Projet</button>
                </div>
                <div className="grid gap-4">
                    {projects.map(p => (
                        <div key={p.id} className="bg-[#0a0a0a] border border-neutral-900 p-5 rounded flex items-center justify-between group hover:border-neutral-700 transition-all">
                            <div className="flex items-center gap-6">
                                <img src={p.coverImage} className="w-20 h-14 object-cover rounded bg-neutral-800" />
                                <div>
                                    <h3 className="font-medium tracking-tight">{p.title}</h3>
                                    <p className="text-[10px] uppercase tracking-widest text-neutral-500 mt-1">{p.category} — {p.year}</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <button onClick={() => setEditingProject(p)} className="p-3 text-neutral-600 hover:text-white hover:bg-neutral-800 rounded transition-all"><Edit2 size={18}/></button>
                                <button onClick={() => confirm('Supprimer définitivement ?') && setProjects(projects.filter(x => x.id !== p.id))} className="p-3 text-neutral-600 hover:text-red-400 hover:bg-neutral-800 rounded transition-all"><Trash2 size={18}/></button>
                            </div>
                        </div>
                    ))}
                    {projects.length === 0 && <div className="py-20 text-center border border-dashed border-neutral-800 rounded text-neutral-600">Aucun projet pour le moment.</div>}
                </div>
            </div>
        )}

        {activeTab === 'bio' && (
            <div className="max-w-2xl space-y-8 animate-[fadeIn_0.5s_ease-out]">
                <h2 className="text-xl font-light">Bio & Info</h2>
                <textarea value={bio} onChange={(e) => setBio(e.target.value)} className="w-full h-80 bg-[#0a0a0a] border border-neutral-800 p-6 rounded text-neutral-300 outline-none focus:border-neutral-600 leading-relaxed text-sm" placeholder="Rédigez votre biographie ici..." />
            </div>
        )}

        {activeTab === 'settings' && (
            <div className="max-w-sm space-y-8 animate-[fadeIn_0.5s_ease-out]">
                <div>
                    <h2 className="text-xl font-light mb-2">Sécurité</h2>
                    <p className="text-xs text-neutral-500">Modifiez le code d'accès à ce panel.</p>
                </div>
                <div className="space-y-4">
                    <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Nouveau code..." className="w-full bg-neutral-900 border border-neutral-800 p-4 rounded outline-none focus:border-neutral-600" />
                    <button onClick={() => {localStorage.setItem('portfolio_password', newPassword); alert('Mot de passe mis à jour.');}} className="w-full bg-white text-black py-4 rounded font-bold uppercase tracking-widest text-[10px]">Mettre à jour le code</button>
                </div>
            </div>
        )}
      </main>
    </div>
  );
};