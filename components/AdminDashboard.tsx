import React, { useState, useRef } from 'react';
import { Project } from '../types';
import { X, Plus, Trash2, Edit2, LogOut, Settings, Image as ImageIcon, Video, Home, FolderOpen, Loader2 } from 'lucide-react';

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
  const [storedPassword, setStoredPassword] = useState(() => localStorage.getItem('portfolio_password') || 'Husson');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [activeTab, setActiveTab] = useState<'home' | 'projects' | 'bio' | 'settings'>('home');
  const [newPassword, setNewPassword] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // Refs for hidden file inputs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const showreelInputRef = useRef<HTMLInputElement>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === storedPassword) {
      setIsAuthenticated(true);
    } else {
      alert('Code incorrect');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (base64: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;

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
        <form onSubmit={handleLogin} className="w-full max-w-sm space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-light tracking-wide">HUSSON ADMIN</h1>
            <p className="text-sm text-neutral-500">Entrez le code de sécurité</p>
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
              <X size={18} /> <span>Annuler</span>
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 md:p-8">
            <form id="projectForm" onSubmit={handleSaveProject} className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="space-y-6">
                    <h3 className="text-xs font-bold tracking-widest uppercase text-neutral-500 border-b border-neutral-800 pb-2">Infos</h3>
                    <input type="text" placeholder="Titre" value={editingProject.title} onChange={(e) => updateEditingProject('title', e.target.value)} className="w-full bg-neutral-900 border border-neutral-800 p-3 rounded outline-none" required />
                    <div className="grid grid-cols-2 gap-4">
                        <input type="text" placeholder="Année" value={editingProject.year} onChange={(e) => updateEditingProject('year', e.target.value)} className="w-full bg-neutral-900 border border-neutral-800 p-3 rounded outline-none" required />
                        <input type="text" placeholder="Catégorie" value={editingProject.category} onChange={(e) => updateEditingProject('category', e.target.value)} className="w-full bg-neutral-900 border border-neutral-800 p-3 rounded outline-none" required />
                    </div>
                    <textarea placeholder="Description" value={editingProject.description} onChange={(e) => updateEditingProject('description', e.target.value)} className="w-full bg-neutral-900 border border-neutral-800 p-3 rounded outline-none h-32 resize-none" required />
                    
                    <div className="space-y-2">
                        <label className="text-xs uppercase tracking-wider text-neutral-500">Image de couverture</label>
                        <div className="flex gap-2">
                            <input type="text" value={editingProject.coverImage} onChange={(e) => updateEditingProject('coverImage', e.target.value)} className="flex-1 bg-neutral-900 border border-neutral-800 p-3 rounded outline-none text-sm" placeholder="URL ou importer..." />
                            <button type="button" onClick={() => fileInputRef.current?.click()} className="bg-neutral-800 p-3 rounded hover:bg-neutral-700 transition-colors"><FolderOpen size={18}/></button>
                            <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={(e) => handleFileUpload(e, (base64) => updateEditingProject('coverImage', base64))} />
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="flex justify-between items-center border-b border-neutral-800 pb-2">
                        <h3 className="text-xs font-bold tracking-widest uppercase text-neutral-500">Galerie Photo</h3>
                        <div className="flex gap-2">
                             <button type="button" onClick={() => galleryInputRef.current?.click()} className="text-xs flex items-center gap-1 bg-neutral-800 text-white px-2 py-1 rounded hover:bg-neutral-700">
                                <FolderOpen size={12} /> Importer
                            </button>
                            <button type="button" onClick={() => updateEditingProject('images', [...editingProject.images, ''])} className="text-xs flex items-center gap-1 bg-white text-black px-2 py-1 rounded hover:bg-neutral-200">
                                <Plus size={12} /> URL
                            </button>
                            <input type="file" ref={galleryInputRef} hidden accept="image/*" onChange={(e) => handleFileUpload(e, (base64) => updateEditingProject('images', [...editingProject.images, base64]))} />
                        </div>
                    </div>
                    <div className="space-y-4">
                        {editingProject.images.map((img, idx) => (
                            <div key={idx} className="flex gap-2 items-center bg-neutral-900/50 p-2 rounded">
                                <img src={img || 'https://placehold.co/50x50/111/white?text=X'} className="w-10 h-10 object-cover rounded" />
                                <input type="text" value={img} onChange={(e) => {
                                    const newImgs = [...editingProject.images];
                                    newImgs[idx] = e.target.value;
                                    updateEditingProject('images', newImgs);
                                }} className="flex-1 bg-transparent border-none outline-none text-xs" />
                                <button type="button" onClick={() => updateEditingProject('images', editingProject.images.filter((_, i) => i !== idx))} className="text-neutral-500 hover:text-red-500"><Trash2 size={14}/></button>
                            </div>
                        ))}
                    </div>
                </div>
            </form>
          </div>
          <div className="p-6 border-t border-neutral-800 bg-[#0a0a0a]">
             <button form="projectForm" type="submit" className="w-full bg-white text-black py-4 rounded font-medium hover:bg-neutral-200 tracking-widest uppercase text-sm">Enregistrer</button>
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
          <div className="flex gap-4 text-sm">
            <button onClick={() => setActiveTab('home')} className={`${activeTab === 'home' ? 'text-white' : 'text-neutral-500'} flex items-center gap-2`}><Home size={16}/> Accueil</button>
            <button onClick={() => setActiveTab('projects')} className={`${activeTab === 'projects' ? 'text-white' : 'text-neutral-500'}`}>Projets</button>
            <button onClick={() => setActiveTab('bio')} className={`${activeTab === 'bio' ? 'text-white' : 'text-neutral-500'}`}>Bio</button>
            <button onClick={() => setActiveTab('settings')} className={`${activeTab === 'settings' ? 'text-white' : 'text-neutral-500'}`}>Réglages</button>
          </div>
        </div>
        <button onClick={onClose} className="text-neutral-500 hover:text-white flex items-center gap-2 text-xs uppercase tracking-widest"><LogOut size={16}/> Quitter</button>
      </nav>

      <main className="max-w-screen-xl mx-auto p-6 md:p-10">
        {activeTab === 'home' && (
          <div className="max-w-2xl space-y-6">
             <h2 className="text-xl font-light">Showreel Vidéo</h2>
             <div className="space-y-4">
                <div className="flex gap-2">
                    <input type="text" value={showreelUrl} onChange={(e) => setShowreelUrl(e.target.value)} placeholder="URL vidéo (mp4)..." className="flex-1 bg-neutral-900 border border-neutral-800 p-3 rounded outline-none" />
                    <button onClick={() => showreelInputRef.current?.click()} className="bg-neutral-800 p-3 rounded hover:bg-neutral-700 transition-colors">
                        {isUploading ? <Loader2 size={18} className="animate-spin" /> : <FolderOpen size={18}/>}
                    </button>
                    <input type="file" ref={showreelInputRef} hidden accept="video/*" onChange={(e) => handleFileUpload(e, setShowreelUrl)} />
                </div>
                {showreelUrl && (
                    <div className="aspect-video bg-black rounded overflow-hidden border border-neutral-800">
                        <video src={showreelUrl} className="w-full h-full object-cover" autoPlay muted loop playsInline />
                    </div>
                )}
             </div>
          </div>
        )}

        {activeTab === 'projects' && (
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-light">Projets</h2>
                    <button onClick={() => setEditingProject(EmptyProject)} className="bg-white text-black px-4 py-2 rounded text-sm font-medium hover:bg-neutral-200 flex items-center gap-2"><Plus size={16}/> Nouveau</button>
                </div>
                <div className="grid gap-4">
                    {projects.map(p => (
                        <div key={p.id} className="bg-[#0a0a0a] border border-neutral-900 p-4 rounded-lg flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <img src={p.coverImage} className="w-16 h-12 object-cover rounded" />
                                <div><h3 className="font-medium">{p.title}</h3><p className="text-xs text-neutral-500">{p.category}</p></div>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => setEditingProject(p)} className="p-2 text-neutral-500 hover:text-white"><Edit2 size={18}/></button>
                                <button onClick={() => confirm('Supprimer ?') && setProjects(projects.filter(x => x.id !== p.id))} className="p-2 text-neutral-500 hover:text-red-400"><Trash2 size={18}/></button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {activeTab === 'bio' && (
            <textarea value={bio} onChange={(e) => setBio(e.target.value)} className="w-full h-64 bg-[#0a0a0a] border border-neutral-800 p-4 rounded text-neutral-300 outline-none" />
        )}

        {activeTab === 'settings' && (
            <div className="max-w-sm space-y-4">
                <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Nouveau code..." className="w-full bg-neutral-900 border border-neutral-800 p-3 rounded outline-none" />
                <button onClick={() => {localStorage.setItem('portfolio_password', newPassword); alert('OK');}} className="w-full bg-white text-black py-3 rounded font-medium">Enregistrer le code</button>
            </div>
        )}
      </main>
    </div>
  );
};